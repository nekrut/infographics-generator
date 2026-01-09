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
const TEMPLATE_FILE = path.join(FRAMEWORK_DIR, 'template.html');
const OUTPUT_DIR = path.join(siteDir, 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.html');

// Slide type patterns
const SLIDE_TYPES = {
  stats: /\|\s*Stat\s*\|\s*Label\s*\|/i,
  split: /^>\s*split/m,
  wordcloud: /^>\s*type:\s*wordcloud/m,
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
    paragraphs: [],
    highlight: null,
    reverse: false,
    background: null
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
    if (!text.match(/^(type:|split|background:)/i)) {
      slide.subtitle = text;
      break;
    }
  }

  // Detect slide type
  if (SLIDE_TYPES.stats.test(content)) {
    slide.type = 'stats';
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
    case 'ecosystem':
      return generateEcosystemSlide(slide, activeClass);
    case 'galaxies':
      return generateGalaxiesSlide(slide, activeClass);
    case 'links':
      return generateLinksSlide(slide, activeClass);
    case 'qr':
      return generateQrSlide(slide, activeClass);
    default:
      return generateIntroSlide(slide, activeClass);
  }
}

function generateStatsSlide(slide, activeClass) {
  const colors = ['orange', 'blue', 'green', 'yellow', 'red', 'dark'];
  const gridClass = slide.stats.length === 4 ? 'four-col' :
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
  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-wordcloud${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      <div id="wordcloud-container"></div>
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
  const descHTML = slide.paragraphs.map(p => `<p>${p}</p>`).join('\n        ');

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

  return `
    <!-- Slide ${slide.index + 1}: ${slide.title} -->
    <section class="slide slide-qr${activeClass}" data-section="${slide.section}">
      <h1 class="slide-title">${slide.title}</h1>
      ${imgHTML}
    </section>`;
}

// Generate masthead links
function generateMastheadLinks(masthead) {
  return masthead.map((item, i) => {
    const activeClass = i === 0 ? ' active' : '';
    return `<a class="masthead-link${activeClass}" data-section="${item.section}">${item.name}</a>`;
  }).join('\n      ');
}

// Generate wordcloud topics JavaScript
function generateWordcloudTopics(slides) {
  const wordcloudSlide = slides.find(s => s.type === 'wordcloud');
  if (!wordcloudSlide || !wordcloudSlide.items.length) {
    return '[]';
  }
  const topics = wordcloudSlide.items.map(item =>
    `{ text: '${item.text}', url: '${item.url}' }`
  ).join(',\n      ');
  return `[\n      ${topics}\n    ]`;
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
  const wordcloudTopics = generateWordcloudTopics(slides);

  // Replace placeholders
  template = template.replace('{{MASTHEAD_LINKS}}', mastheadHTML);
  template = template.replace('{{SLIDES}}', slidesHTML);
  template = template.replace('{{WORDCLOUD_TOPICS}}', wordcloudTopics);

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
}

// Run build
build();
