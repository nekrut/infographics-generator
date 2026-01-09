# Infographics Generator

A framework for generating promotional slideshow websites from Markdown content.

## Quick Start

```bash
# Install dependencies
npm install

# Build a site
npm run build:what_is_galaxy

# Output is in sites/what_is_galaxy/dist/
```

## Creating a New Site

1. Create a site directory:
   ```bash
   mkdir -p sites/my_new_site/images
   ```

2. Create `sites/my_new_site/slides.md` with your content (see format below)

3. Add images to `sites/my_new_site/images/`

4. Add a `favicon.svg` (optional)

5. Build:
   ```bash
   node build.js sites/my_new_site
   ```

6. Output is in `sites/my_new_site/dist/`

## Markdown Format

```markdown
---
title: Site Title
masthead:
  - name: Section 1
    section: section1
  - name: Section 2
    section: section2
---

# [section1] Slide Title
> Subtitle text

Content here...

---

# [section2] Next Slide
> Another subtitle

More content...
```

## Supported Slide Types

| Type | Directive | Description |
|------|-----------|-------------|
| Stats | `\| Stat \| Label \|` table | Grid of stat cards with colors |
| Intro | Default (with image) | Title, subtitle, centered image |
| Split | `> split` or `> split: reverse` | Two-column: text + image |
| Wordcloud | `> type: wordcloud` | Sparkly topic grid |
| Ecosystem | `> type: ecosystem` | Panel grid with logos |
| Galaxies | `> type: galaxies` | Background image slide |
| Links | `> type: links` | Grid of clickable link cards |
| QR | `> type: qr` | Large centered QR code |

## Slide Type Examples

### Stats Slide
```markdown
# [section] Title
> Subtitle

| Stat | Label |
|------|-------|
| 1,000 | users |
| 500 | projects |
```

### Split Slide
```markdown
# [section] Title
> split

First paragraph with **bold** text.

Second paragraph.

::: highlight
Highlighted callout text.
:::

![Alt text](images/image.png)
```

### Links Slide
```markdown
# [section] Key Resources
> type: links

- Label1: https://example.com
- Label2: https://another.com
```

### QR Code Slide
```markdown
# [section] Scan Me
> type: qr

![QR Code](images/qr-code.svg)
```

## Special Syntax

- `# [section] Title` - Section tag for masthead navigation
- `::: highlight ... :::` - Yellow-bordered highlight box
- `![alt](path)` - Images
- `**bold**` - Bold text in paragraphs
- `> subtitle` - Slide subtitle (first blockquote without directives)

## Project Structure

```
infographics-generator/
├── build.js              # Build script
├── template.html         # HTML template with CSS/JS
├── package.json          # Dependencies and scripts
├── README.md             # This file
│
└── sites/                # Site content directories
    └── what_is_galaxy/   # Example site
        ├── slides.md     # Slide content
        ├── images/       # Site images
        ├── favicon.svg   # Site favicon
        └── dist/         # Generated output
            ├── index.html
            ├── images/
            └── favicon.svg
```

## Keyboard Controls (in generated site)

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume auto-play |
| `→` | Next slide |
| `←` | Previous slide |
| `Escape` | Resume auto-play |

## License

MIT
