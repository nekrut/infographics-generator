# VGP on Galaxy

Interactive infographic showcasing the Vertebrate Genomes Project (VGP) on Galaxy.

## Live Demo

View at: https://nekrut.github.io/infographics/vgp/

## Overview

This site presents the VGP's use of Galaxy for genome assembly, featuring:

- **Species Diversity**: Image grid of 50 vertebrate species from the VGP catalog
- **Phylogenetic Tree**: Visual representation of vertebrate diversity
- **Assembly Pipeline**: Interactive workflow modules for genome assembly
- **Computational Scale**: Bar charts showing compute usage by workflow and tool
- **Infrastructure**: Galaxy + ACCESS-CI resources powering the project

## Slides

1. Sequencing Vertebrate Diversity (image grid)
2. Building the Tree of Life (split layout)
3. 274 Genomes and Counting (scatter plot)
4. VGP Workflow Modules (clickable image)
5. Pre-Assembly & Assembly (workflow cards)
6. Post-Assembly Processing (workflow cards)
7. VGP Workflows by Compute (bar chart)
8. Top Assembly Tools (bar chart)
9. Peak Memory by Tool (bar chart)
10. Powered by Galaxy + ACCESS-CI (split layout)
11. Key VGP Resources (link cards)
12. QR Code (gxy.io/what-is-vgp)

## Data Files

- `workflow-hours.json` - Core hours by VGP workflow
- `tool-hours.json` - Core hours by assembly tool
- `tool-memory.json` - Peak memory usage by tool

## Build

```bash
cd /path/to/infographics-generator
node build.js sites/vgp
# Output in sites/vgp/dist/
```

## Species Images

The `images/species/` directory contains 300x300 thumbnails sourced from GenomeArk/Wikimedia Commons, representing vertebrate species with completed genome assemblies.
