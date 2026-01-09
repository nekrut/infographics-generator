# What is BRC Analytics?

An interactive slideshow introducing BRC Analytics - a free, browser-based platform for pathogen genomics analysis.

## View Online

**[Coming soon - deploy to GitHub Pages]**

## Contents

13 slides covering:

1. **BRC Analytics** - Key metrics (5,060 assemblies, 1,920 taxa, FREE compute)
2. **Find Your Pathogen Data** - Browse NCBI, ENA, or upload your own
3. **Select a Workflow** - Curated IWC pipelines
4. **Run Your Analysis** - Cloud compute via ACCESS-CI/TACC
5. **Interpret & Publish** - Jupyter notebooks, visualizations
6. **Integrated Data Sources** - NCBI, UCSC, ENA integration
7. **Cloud-Powered Infrastructure** - ACCESS-CI map
8. **Reproducibility Built-In** - Workflow versioning, audit trails
9. **Pathogen Taxonomy Browser** - Interactive sunburst with 1,920 taxa
10. **Analysis Workflows** - Variant calling, RNA-seq, assembly
11. **Validated Research** - Measles & C. auris case studies
12. **Key Links** - Quick access to BRC resources
13. **QR Code** - Scan to visit brc-analytics.org

## Features

### Interactive Sunburst (Slide 9)
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

## Images Needed

Place in `images/` directory:

| File | Description |
|------|-------------|
| `data-browser.png` | Screenshot of BRC data browser |
| `workflow-selection.png` | Workflow selection interface |
| `analysis-running.png` | Analysis in progress view |
| `results-viz.png` | Results/Jupyter visualization |
| `phylogenetic-tree.png` | From measles case study |
| `qr-code.png` | QR code for brc-analytics.org |

### Already Included
- `access-map.svg` - ACCESS-CI infrastructure map
- `brc-logo.svg` - BRC Analytics logo

## Data Files

- `ncbi-taxa-tree.json` - Taxonomy hierarchy (2MB, 1,920 taxa) from brc-analytics catalog

## Source

Generated using [infographics-generator](https://github.com/nekrut/infographics-generator) framework.

To modify content, edit `slides.md` and rebuild.
