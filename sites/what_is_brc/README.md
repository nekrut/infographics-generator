# What is BRC Analytics?

An interactive slideshow introducing BRC Analytics - a free, browser-based platform for pathogen genomics analysis.

## View Online

**[Coming soon - deploy to GitHub Pages]**

## Contents

13 slides covering:

1. **BRC Analytics** - Key metrics (5,060 assemblies, 1,920 taxa, FREE compute)
2. **Find organism** - Select from 1,920 taxa
3. **Select genome** - Select from 5,060 genome assemblies
4. **Select workflow** - Best-practice workflows
5. **Select data** - From SRA or upload your own
6. **Run workflow** - One or 1,000,000 samples
7. **Interpret!** - Analyze and publish
8. **Best data source in one package** - Battle tested resources (whatIsBrc.svg)
9. **Cloud-Powered Infrastructure** - ACCESS-CI map
10. **Pathogen Taxonomy Browser** - Interactive sunburst with 1,920 taxa
11. **Analysis Workflows** - Variant calling, RNA-seq, assembly
12. **Key Links** - Quick access to BRC resources
13. **QR Code** - Scan to visit brc-analytics.org

## Features

### Interactive Sunburst (Slide 10)
- Circular phylogeny browser showing all pathogen taxa
- Click to drill down into taxonomy levels
- Side panel with subcategories and assembly counts
- Links directly to brc-analytics.org with appropriate filters

### BRC Branding
- White header with BRC logo
- Inter Tight font for headings
- Navy blue (#28285B) primary color
- Yellow (#FFEB78) accent color

## Controls

| Key | Action |
|-----|--------|
| `Space` | Pause / Resume |
| `→` | Next slide |
| `←` | Previous slide |

## Development

### Prerequisites
- Node.js
- The infographics-generator framework

### Build
```bash
cd /path/to/infographics-generator
node build.js sites/what_is_brc
```

### Preview
```bash
cd sites/what_is_brc/dist
python3 -m http.server 8080
# Open http://localhost:8080
```

Note: Must use HTTP server (not file://) for the sunburst visualization to load taxonomy data.

## Images

All images in `images/` directory:

| File | Description |
|------|-------------|
| `select-species.png` | Find organism interface |
| `select-assembly.png` | Select genome interface |
| `select-workflow.png` | Workflow selection interface |
| `find-data.png` | Data selection interface |
| `run-wf.png` | Run workflow interface |
| `interpret.png` | Results/interpretation interface |
| `whatIsBrc.svg` | BRC data sources infographic |
| `access-map.svg` | ACCESS-CI infrastructure map |
| `brc-logo.svg` | BRC Analytics logo |
| `qr-code.png` | QR code for brc-analytics.org |

## Data Files

- `ncbi-taxa-tree.json` - Taxonomy hierarchy (2MB, 1,920 taxa) from brc-analytics catalog

## Source

Generated using [infographics-generator](https://github.com/nekrut/infographics-generator) framework.

To modify content, edit `slides.md` and rebuild.
