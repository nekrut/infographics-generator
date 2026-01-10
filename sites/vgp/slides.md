---
title: VGP on Galaxy
masthead:
  - name: Overview
    section: overview
  - name: Pipeline
    section: pipeline
  - name: Scale
    section: scale
  - name: Resources
    section: resources
---

# [overview] Building the Tree of Life
> split

The Vertebrate Genomes Project (VGP) aims to generate near error-free, chromosome-level reference genome assemblies for all ~70,000 extant vertebrate species.

Galaxy provides the computational infrastructure to achieve this at scale, with standardized, reproducible workflows accessible to researchers worldwide.

::: highlight
"95% of the main discoveries that have driven biotechnology came from studying things that were not model organisms at the time." - Giulio Formenti
:::

![VGP Phylogenetic Tree](images/tree.png)

---

# [overview] 274 genomes and counting
> type: scatter

---

# [pipeline] End-to-End Assembly Pipeline
> split: reverse

The VGP pipeline consists of 10 modular workflows organized into 5 stages, from raw data to chromosome-level assembly.

Each stage is designed to work with different data types: HiFi, Hi-C, Bionano, and parental Illumina for trio assemblies.

::: highlight
Workflows 1-9 cover the main assembly pipeline, with Workflow 0 dedicated to mitochondrial genome assembly.
:::

![VGP Assembly Pipeline](images/pipeline.png)

---

# [pipeline] Pre-Assembly & Assembly
> type: workflow

- VGP0 Mitogenome Assembly | HiFi reads, Species name, Genetic code | GenBank file, Annotation images
- VGP1 K-mer Profiling | HiFi reads, K-mer length, Ploidy | Meryl database, GenomeScope plots
- VGP2 K-mer Profiling Trio | HiFi reads, Parental Illumina | Meryl DBs, GenomeScope profiles
- VGP3 HiFi Assembly | HiFi reads, Meryl DB, GenomeScope | Primary assembly, Alternate assembly
- VGP4 HiFi+HiC Assembly | HiFi reads, HiC reads, Meryl DB | Haplotype 1, Haplotype 2
- VGP5 Trio Assembly | HiFi reads, Parental reads, Meryl DBs | Paternal haplotype, Maternal haplotype

---

# [pipeline] Post-Assembly Processing
> type: workflow

- VGP6 Purge Duplicates | Assemblies, Trimmed HiFi, Meryl DB | Purged primary, Purged alternate
- VGP6b Purge Single | Assembly, Trimmed HiFi, Meryl DB | Purged assembly
- VGP7 Bionano Scaffolding | Assembly (GFA), Bionano cmap | Scaffolds, QC plots
- VGP8 HiC Scaffolding | Assembly (GFA), HiC reads | Scaffolded assembly, Contact map

---

# [pipeline] VGP Workflow Modules
> type: image-click

![VGP Workflow Modules](images/VGP_workflow_modules.svg)

---

# [scale] Massive Computational Scale
> Compute resources used by VGP on Galaxy

| Stat | Label |
|------|-------|
| 24,500+ | hours of runtime |
| 40,600+ | jobs executed |
| 4 TB | peak memory per job |
| 128 | max cores per job |

---

# [scale] 3 Years of Genome Assembly
> split

From July 2022 to October 2025, the VGP has continuously used Galaxy to assemble vertebrate genomes.

The top workflows by execution count include Hi-C scaffolding (244 runs), PretextMap generation (210 runs), and decontamination (131 runs).

::: highlight
77.9% of all workflow runs completed successfully, with the remainder either cancelled or requiring troubleshooting.
:::

![ACCESS-CI Infrastructure](images/access-map.svg)

---

# [scale] Powered by Galaxy + ACCESS-CI
> split: reverse

VGP leverages the US national cyberinfrastructure through ACCESS-CI, running on resources at TACC (Jetstream2), PSC, NCSA, and SDSC.

This provides the massive memory (up to 4TB) and CPU resources (up to 128 cores) needed for large vertebrate genome assemblies.

::: highlight
Galaxy provides an equivalent of >$2,000,000/year of free computational infrastructure to genomics researchers.
:::

![VGP Workflows](images/workflows.svg)

---

# [resources] Key VGP Resources
> type: links

- VGP Galaxy: https://vgp.usegalaxy.org
- GenomeArk: https://genomeark.org
- VGP Website: https://vertebrategenomesproject.org
- Galaxy US: https://usegalaxy.org
- IWC Workflows: https://iwc.galaxyproject.org
- GTN Assembly Training: https://training.galaxyproject.org/training-material/topics/assembly/

---

# [resources] vgp.usegalaxy.org
> type: qr

![QR Code](images/qr-code.svg)
