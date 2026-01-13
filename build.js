#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// Get site directory from command line argument
const siteDir = process.argv[2] || 'sites/what_is_galaxy';

// Configuration
const FRAMEWORK_DIR = __dirname;
const SLIDES_FILE = path.join(siteDir, 'slides.md');
// Check for site-specific template first, fall back to framework template
const SITE_TEMPLATE = path.join(siteDir, 'template.html');
const TEMPLATE_FILE = fs.existsSync(SITE_TEMPLATE) ? SITE_TEMPLATE : path.join(FRAMEWORK_DIR, 'template.html');
const OUTPUT_DIR = path.join(siteDir, 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

// Slide type patterns
const SLIDE_TYPES = {
  stats: /\|\s*Stat\s*\|\s*Label\s*\|/i,
  split: /^>\s*split/m,
  text: /^>\s*type:\s*text/m,
  wordcloud: /^>\s*type:\s*wordcloud/m,
  scatter: /^>\s*type:\s*scatter/m,
  barchart: /^>\s*type:\s*barchart/m,
  imagegrid: /^>\s*type:\s*imagegrid/m,
  workflow: /^>\s*type:\s*workflow/m,
  imageclick: /^>\s*type:\s*image-click/m,
  sunburst: /^>\s*type:\s*sunburst/m,
  ecosystem: /^>\s*type:\s*ecosystem/m,
  galaxies: /^>\s*type:\s*galaxies/m,
  links: /^>\s*type:\s*links/m,
  qr: /^>\s*type:\s*qr/m,
  intro: null  // Default for simple image slides
};

// Parse a single slide from markdown
function parseSlide(content, index) {
  const lines = content.trim().split('\n');
  const slide = {
    index,
    section: 'global',
    title: '',
    subtitle: '',
    type: 'intro',
    content: '',
    image: null,
    stats: [],
    items: [],
    images: [],
    paragraphs: [],
    highlight: null,
    reverse: false,
    background: null,
    dataSource: null
  };

  // Parse title line: # [section] Title
  const titleMatch = lines[0]?.match(/^#\s*\[(\w+)\]\s*(.+)$/);
  if (titleMatch) {
    slide.section = titleMatch[1];
    slide.title = titleMatch[2];
  } else if (lines[0]?.startsWith('# ')) {
    slide.title = lines[0].substring(2);
  }

  // Parse subtitle (blockquote without special directives)
  const blockquotes = content.match(/^>\s*(.+)$/gm) || [];
  for (const bq of blockquotes) {
    const text = bq.replace(/^>\s*/, '').trim();
    if (!text.match(/^(type:|split|stats:|lists:|background:|data:|grid:)/i)) {
      slide.subtitle = text;
      break;
    }
  }

  // Detect slide type
  if (SLIDE_TYPES.stats.test(content)) {
    slide.type = 'stats';
    slide.vertical = /^>\s*stats:\s*vertical/m.test(content);
    slide.lists = /^>\s*stats:\s*lists/m.test(content);
    // Parse stats table
    const tableMatch = content.match(/\|[^\n]+\|\n\|[-|\s]+\|\n([\s\S]*?)(?=\n\n|$)/);
    if (tableMatch) {
      const rows = tableMatch[1].trim().split('\n');
      slide.stats = rows.map(row => {
        const cells = row.split('|').filter(c => c.trim());
        return { number: cells[0]?.trim(), label: cells[1]?.trim() };
      });
    }
  } else if (SLIDE_TYPES.split.test(content)) {
    slide.type = 'split';
    slide.reverse = /^>\s*split:\s*reverse/m.test(content);

    // Parse highlight first (so we can exclude from paragraphs)
    const highlightMatch = content.match(/:::\s*highlight\n([\s\S]*?)\n:::/);
    if (highlightMatch) {
      slide.highlight = highlightMatch[1].trim();
    }

    // Parse paragraphs (exclude highlight content)
    const paragraphs = content.match(/^(?!>|#|\||\!\[|:::)[^\n]+$/gm);
    slide.paragraphs = paragraphs?.filter(p => p.trim() && p.trim() !== slide.highlight) || [];

    // Parse image
    const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      slide.image = { alt: imgMatch[1], src: imgMatch[2] };
    }
  } else if (SLIDE_TYPES.wordcloud.test(content)) {
    slide.type = 'wordcloud';
    // Parse list items as wordcloud topics
    const listMatches = content.matchAll(/^-\s*\[([^\]]+)\]\(([^)]+)\)/gm);
    for (const match of listMatches) {
      slide.items.push({ text: match[1], url: match[2] });
    }
  } else if (SLIDE_TYPES.scatter.test(content)) {
    slide.type = 'scatter';
  } else if (SLIDE_TYPES.barchart.test(content)) {
    slide.type = 'barchart';
    // Parse data source from > data: filename
    const dataMatch = content.match(/^>\s*data:\s*(.+)$/m);
    if (dataMatch) {
      slide.dataSource = dataMatch[1].trim();
    }
  } else if (SLIDE_TYPES.imagegrid.test(content)) {
    slide.type = 'imagegrid';
    slide.gridLarge = /^>\s*grid:\s*large/m.test(content);
    // Parse image list from markdown image syntax ![alt](src)
    const imageMatches = content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
    slide.images = [];
    for (const match of imageMatches) {
      slide.images.push({ alt: match[1], src: match[2] });
    }
  } else if (SLIDE_TYPES.workflow.test(content)) {
    slide.type = 'workflow';
    // Parse workflow items: - ID Name | input1, input2 | output1, output2
    const workflowMatches = content.matchAll(/^-\s*(\S+)\s+([^|]+)\s*\|\s*([^|]+)\s*\|\s*(.+)$/gm);
    for (const match of workflowMatches) {
      slide.items.push({
        id: match[1].trim(),
        name: match[2].trim(),
        inputs: match[3].split(',').map(s => s.trim()),
        outputs: match[4].split(',').map(s => s.trim())
      });
    }
  } else if (SLIDE_TYPES.imageclick.test(content)) {
    slide.type = 'imageclick';
    // Parse image
    const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      slide.image = { alt: imgMatch[1], src: imgMatch[2] };
    }
  } else if (SLIDE_TYPES.sunburst.test(content)) {
    slide.type = 'sunburst';
  } else if (SLIDE_TYPES.ecosystem.test(content)) {
    slide.type = 'ecosystem';
    // Parse ecosystem panels (## headers with images and descriptions)
    const panelMatches = content.matchAll(/##\s*([^\n]+)\n!\[([^\]]*)\]\(([^)]+)\)\n([^\n#]+)/g);
    for (const match of panelMatches) {
      slide.items.push({
        title: match[1].trim(),
        alt: match[2],
        logo: match[3],
        description: match[4].trim()
      });
    }
  } else if (SLIDE_TYPES.galaxies.test(content)) {
    slide.type = 'galaxies';
    const bgMatch = content.match(/^>\s*background:\s*(.+)$/m);
    if (bgMatch) {
      slide.background = bgMatch[1].trim();
    }
    // Get description paragraphs
    const paragraphs = content.match(/^(?!>|#|\||!\[)[^\n]+$/gm);
    slide.paragraphs = paragraphs?.filter(p => p.trim()) || [];
  } else if (SLIDE_TYPES.links.test(content)) {
    slide.type = 'links';
    // Parse links: - Label: URL format
    const linkMatches = content.matchAll(/^-\s*([^:]+):\s*(https?:\/\/[^\s]+)/gm);
    for (const match of linkMatches) {
      slide.items.push({ label: match[1].trim(), url: match[2].trim() });
    }
  } else if (SLIDE_TYPES.qr.test(content)) {
    slide.type = 'qr';
    // Parse QR code image
    const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      slide.image = { alt: imgMatch[1], src: imgMatch[2] };
    }
  } else if (SLIDE_TYPES.text.test(content)) {
    slide.type = 'text';
    // Parse paragraphs for large centered text display
    const paragraphs = content.match(/^(?!>|#|\||!\[)[^\n]+$/gm);
    slide.paragraphs = paragraphs?.filter(p => p.trim()) || [];
  } else {
    // Default: intro slide with image
    slide.type = 'intro';
    const imgMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch) {
      slide.image = { alt: imgMatch[1], src: imgMatch[2] };
    }
  }

  return slide;
}

// Generate HTML for a slide
function generateSlideHTML(slide) {
  const isFirst = slide.index === 0;
  const activeClass = isFirst ? ' active' : '';

  switch (slide.type) {
    case 'stats':
      return generateStatsSlide(slide, activeClass);
    case 'intro':
      return generateIntroSlide(slide, activeClass);
    case 'split':
      return generateSplitSlide(slide, activeClass);
    case 'wordcloud':
      return generateWordcloudSlide(slide, activeClass);
    case 'scatter':
      return generateScatterSlide(slide, activeClass);
    case 'barchart':
      return generateBarchartSlide(slide, activeClass);
    case 'imagegrid':
      return generateImageGridSlide(slide, activeClass);
    case 'workflow':
      return generateWorkflowSlide(slide, activeClass);
    case 'imageclick':
      return generateImageClickSlide(slide, activeClass);
    case 'sunburst':
      return generateSunburstSlide(slide, activeClass);
    case 'ecosystem':
      return generateEcosystemSlide(slide, activeClass);
    case 'galaxies':
      return generateGalaxiesSlide(slide, activeClass);
    case 'links':
      return generateLinksSlide(slide, activeClass);
    case 'qr':
      return generateQrSlide(slide, activeClass);
    case 'text':
      return generateTextSlide(slide, activeClass);
    default:
      return generateIntroSlide(slide, activeClass);
  }
}

function generateStatsSlide(slide, activeClass) {
  const colors = ['orange', 'blue', 'green', 'yellow', 'red', 'dark'];
  const gridClass = slide.lists ? 'lists' :
                    slide.vertical ? 'vertical' :
                    slide.stats.length === 4 ? 'four-col' :
                    slide.stats.length === 2 ? 'two-col' : '';

  const statsHTML = slide.stats.map((stat, i) => `
        <div class="stat-card ${colors[i % colors.length]}">
          <div class="stat-number">${stat.number}</div>
          <div class="stat-label">${stat.label}</div>
        </div>`).join('');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-stats${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div class="stats-grid ${gridClass}">
${statsHTML}
      </div>
    </section>`;
}

function generateIntroSlide(slide, activeClass) {
  const imgHTML = slide.image ?
    `<img class="slide-image" src="${slide.image.src}" alt="${slide.image.alt}">` : '';

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-intro${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      ${imgHTML}
    </section>`;
}

function generateSplitSlide(slide, activeClass) {
  const reverseClass = slide.reverse ? ' reverse' : '';
  const paragraphsHTML = slide.paragraphs.map(p =>
    `<p class="slide-text">${marked.parseInline(p)}</p>`).join('\n          ');
  const highlightHTML = slide.highlight ?
    `<div class="slide-highlight">${slide.highlight}</div>` : '';
  const imgHTML = slide.image ?
    `<img src="${slide.image.src}" alt="${slide.image.alt}">` : '';

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide${activeClass}" data-section="${slide.section}">
      <div class="slide-split${reverseClass}">
        <div class="content-side">
          <h1 class="slide-title">${slide.title}</h1>
          ${paragraphsHTML}
          ${highlightHTML}
        </div>
        <div class="image-side">
          ${imgHTML}
        </div>
      </div>
    </section>`;
}

function generateWordcloudSlide(slide, activeClass) {
  const subtitleHTML = slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : '';
  const topics = slide.items.map(item =>
    `{ text: '${item.text.replace(/'/g, "\\'")}', url: '${item.url}' }`
  ).join(', ');
  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-wordcloud${activeClass}" data-section="${slide.section}" data-topics="[${topics}]">
      <h1 class="slide-title">${slide.title}</h1>
      ${subtitleHTML}
      <div class="wordcloud-container"></div>
    </section>`;
}

function generateScatterSlide(slide, activeClass) {
  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-scatter${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <div id="scatter-container"></div>
    </section>`;
}

function generateBarchartSlide(slide, activeClass) {
  const dataAttr = slide.dataSource ? ` data-source="${slide.dataSource}"` : '';
  const containerId = `barchart-container-${slide.index}`;
  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-barchart${activeClass}" data-section="${slide.section}"${dataAttr}>
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div id="${containerId}" class="barchart-container"></div>
    </section>`;
}

function generateImageGridSlide(slide, activeClass) {
  const gridClass = slide.gridLarge ? ' grid-large' : '';
  const imagesHTML = slide.images.map(img =>
    `<div class="grid-image-item">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
        <span class="grid-image-label">${img.alt}</span>
      </div>`
  ).join('\n      ');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-imagegrid${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div class="image-grid${gridClass}">
      ${imagesHTML}
      </div>
    </section>`;
}

function generateWorkflowSlide(slide, activeClass) {
  const workflowsHTML = slide.items.map(wf => {
    const inputsHTML = wf.inputs.map(input =>
      `<span class="workflow-input">${input}</span>`).join('\n            ');
    const outputsHTML = wf.outputs.map(output =>
      `<span class="workflow-output">${output}</span>`).join('\n            ');

    return `
          <div class="workflow-row">
            <div class="workflow-inputs">
              ${inputsHTML}
            </div>
            <div class="workflow-box">
              <div class="workflow-id">${wf.id}</div>
              <div class="workflow-name">${wf.name}</div>
            </div>
            <div class="workflow-outputs">
              ${outputsHTML}
            </div>
          </div>`;
  }).join('\n');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-workflow${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <div class="workflow-container">
${workflowsHTML}
      </div>
    </section>`;
}

function generateImageClickSlide(slide, activeClass) {
  const imgHTML = slide.image ?
    `<img class="clickable-image" src="${slide.image.src}" alt="${slide.image.alt}">` : '';

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-image-click${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      ${imgHTML}
      <p class="click-hint">Click image to view fullscreen</p>
    </section>`;
}

function generateSunburstSlide(slide, activeClass) {
  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-sunburst${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div class="sunburst-wrapper">
        <div id="sunburst-container"></div>
        <div id="sunburst-panel">
          <div class="sunburst-panel-card">
            <div class="sunburst-panel-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <a id="sunburst-browse-link" href="https://brc-analytics.org/organisms" target="_blank">Browse All Assemblies</a>
            </div>
            <div class="sunburst-panel-title-row">
              <h4 class="sunburst-panel-title">Subcategories</h4>
              <div id="sunburst-back-btn" class="sunburst-back-btn" style="display: none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
            </div>
            <div id="sunburst-children-list" class="sunburst-children-list"></div>
          </div>
          <p id="sunburst-hint" class="sunburst-hint">Click the visualization to explore available assemblies</p>
        </div>
      </div>
    </section>`;
}

function generateEcosystemSlide(slide, activeClass) {
  const panelsHTML = slide.items.map(item => `
        <div class="ecosystem-panel">
          <div class="panel-logo"><img src="${item.logo}" alt="${item.alt}"></div>
          <div class="panel-title">${item.title}</div>
          <div class="panel-description">${item.description}</div>
        </div>`).join('');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-ecosystem${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div class="ecosystem-grid">
${panelsHTML}
      </div>
    </section>`;
}

function generateGalaxiesSlide(slide, activeClass) {
  const descHTML = slide.paragraphs.map(p => `<p>${marked.parseInline(p)}</p>`).join('\n        ');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-galaxies${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <p class="slide-subtitle">${slide.subtitle}</p>
      <div class="galaxies-description">
        ${descHTML}
      </div>
    </section>`;
}

function generateLinksSlide(slide, activeClass) {
  const linksHTML = slide.items.map(item => `
        <a class="link-card" href="${item.url}" target="_blank">
          <span class="link-label">${item.label}</span>
          <span class="link-url">${item.url.replace('https://', '')}</span>
        </a>`).join('');
  const subtitleHTML = slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : '';

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-links${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      ${subtitleHTML}
      <div class="links-grid">
${linksHTML}
      </div>
    </section>`;
}

function generateQrSlide(slide, activeClass) {
  const imgHTML = slide.image ?
    `<img class="qr-code" src="${slide.image.src}" alt="${slide.image.alt}">` : '';
  const subtitleHTML = slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : '';

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-qr${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      ${subtitleHTML}
      ${imgHTML}
    </section>`;
}

function generateTextSlide(slide, activeClass) {
  const paragraphsHTML = slide.paragraphs.map(p =>
    `<p class="text-slide-paragraph">${marked.parseInline(p)}</p>`).join('\n      ');

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-text${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <div class="text-slide-content">
      ${paragraphsHTML}
      </div>
    </section>`;
}

// Generate masthead links
function generateMastheadLinks(masthead) {
  return masthead.map((item, i) => {
    const activeClass = i === 0 ? ' active' : '';
    return `<a class="masthead-link${activeClass}" data-section="${item.section}">${item.name}</a>`;
  }).join('\n      ');
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Main build function
function build() {
  console.log(`Building site from ${siteDir}...`);
  console.log(`Using template: ${TEMPLATE_FILE}`);

  // Read slides.md
  if (!fs.existsSync(SLIDES_FILE)) {
    console.error(`Error: ${SLIDES_FILE} not found`);
    process.exit(1);
  }
  const slidesContent = fs.readFileSync(SLIDES_FILE, 'utf8');

  // Parse front matter
  const { data: frontMatter, content } = matter(slidesContent);

  // Split into individual slides (separated by ---)
  const slideContents = content.split(/\n---\n/).filter(s => s.trim());

  // Parse each slide
  const slides = slideContents.map((content, index) => parseSlide(content, index));

  console.log(`Parsed ${slides.length} slides`);

  // Read template
  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(`Error: ${TEMPLATE_FILE} not found`);
    process.exit(1);
  }
  let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // Generate HTML
  const mastheadHTML = generateMastheadLinks(frontMatter.masthead || []);
  const slidesHTML = slides.map(generateSlideHTML).join('\n');

  // Load scatter data if exists
  const scatterDataPath = path.join(siteDir, 'scatter-data.json');
  let scatterData = '[]';
  if (fs.existsSync(scatterDataPath)) {
    scatterData = fs.readFileSync(scatterDataPath, 'utf8');
  }

  // Replace placeholders
  template = template.replace('{{MASTHEAD_LINKS}}', mastheadHTML);
  template = template.replace('{{SLIDES}}', slidesHTML);
  template = template.replace('{{SCATTER_DATA}}', scatterData);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write output HTML
  fs.writeFileSync(OUTPUT_FILE, template);
  console.log(`Generated ${OUTPUT_FILE}`);

  // Copy images to dist
  const imagesDir = path.join(siteDir, 'images');
  if (fs.existsSync(imagesDir)) {
    copyDir(imagesDir, path.join(OUTPUT_DIR, 'images'));
    console.log('Copied images to dist/');
  }

  // Copy favicon to dist
  const faviconPath = path.join(siteDir, 'favicon.svg');
  if (fs.existsSync(faviconPath)) {
    fs.copyFileSync(faviconPath, path.join(OUTPUT_DIR, 'favicon.svg'));
    console.log('Copied favicon.svg to dist/');
  }

  // Copy taxonomy data (for sunburst) to dist if exists
  const taxonomyPath = path.join(siteDir, 'ncbi-taxa-tree.json');
  if (fs.existsSync(taxonomyPath)) {
    fs.copyFileSync(taxonomyPath, path.join(OUTPUT_DIR, 'ncbi-taxa-tree.json'));
    console.log('Copied ncbi-taxa-tree.json to dist/');
  }

  // Copy bar chart data files to dist if they exist
  const barchartFiles = ['workflow-hours.json', 'tool-hours.json', 'memory-dist.json', 'tool-memory.json'];
  for (const filename of barchartFiles) {
    const filepath = path.join(siteDir, filename);
    if (fs.existsSync(filepath)) {
      fs.copyFileSync(filepath, path.join(OUTPUT_DIR, filename));
      console.log(`Copied ${filename} to dist/`);
    }
  }
}

// Run build
build();
