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

# [overview] Sequencing Vertebrate Diversity
> type: imagegrid
> 50 species from the VGP assembly catalog

![Abramis brama](images/species/Abramis_brama_300x300.jpg)
![Acanthisitta chloris](images/species/Acanthisitta_chloris_300x300.jpg)
![Acanthopagrus latus](images/species/Acanthopagrus_latus_300x300.jpg)
![Acomys russatus](images/species/Acomys_russatus_300x300.jpg)
![Alca torda](images/species/Alca_torda_300x300.jpg)
![Amblyraja radiata](images/species/Amblyraja_radiata_300x300.jpg)
![Ammospiza caudacuta](images/species/Ammospiza_caudacuta_300x300.jpg)
![Anguilla anguilla](images/species/Anguilla_anguilla_300x300.jpg)
![Antennarius maculatus](images/species/Antennarius_maculatus_300x300.jpg)
![Apus apus](images/species/Apus_apus_300x300.jpg)
![Argentina silus](images/species/Argentina_silus_300x300.jpg)
![Ascidiella aspersa](images/species/Ascidiella_aspersa_300x300.jpg)
![Aythya ferina](images/species/Aythya_ferina_300x300.jpg)
![Barbus barbus](images/species/Barbus_barbus_300x300.jpg)
![Borostomias antarcticus](images/species/Borostomias_antarcticus_300x300.jpg)
![Bucephala clangula](images/species/Bucephala_clangula_300x300.jpg)
![Callithrix jacchus](images/species/Callithrix_jacchus_300x300.jpg)
![Candoia aspera](images/species/Candoia_aspera_300x300.jpg)
![Carcharodon carcharias](images/species/Carcharodon_carcharias_300x300.jpg)
![Cervus elaphus](images/species/Cervus_elaphus_300x300.jpg)
![Chelmon rostratus](images/species/Chelmon_rostratus_300x300.jpg)
![Chiroxiphia lanceolata](images/species/Chiroxiphia_lanceolata_300x300.jpg)
![Ciconia maguari](images/species/Ciconia_maguari_300x300.jpg)
![Cnephaeus nilssonii](images/species/Cnephaeus_nilssonii_300x300.jpg)
![Coregonus lavaretus](images/species/Coregonus_lavaretus_300x300.jpg)
![Cottoperca gobio](images/species/Cottoperca_gobio_300x300.jpg)
![Cynocephalus volans](images/species/Cynocephalus_volans_300x300.jpg)
![Dendropsophus ebraccatus](images/species/Dendropsophus_ebraccatus_300x300.jpg)
![Diceros bicornis](images/species/Diceros_bicornis_300x300.jpg)
![Dryobates pubescens](images/species/Dryobates_pubescens_300x300.jpg)
![Electrona antarctica](images/species/Electrona_antarctica_300x300.jpg)
![Elgaria multicarinata](images/species/Elgaria_multicarinata_300x300.jpg)
![Equus caballus](images/species/Equus_caballus_300x300.jpg)
![Erpetoichthys calabaricus](images/species/Erpetoichthys_calabaricus_300x300.jpg)
![Eubalaena glacialis](images/species/Eubalaena_glacialis_300x300.jpg)
![Falco biarmicus](images/species/Falco_biarmicus_300x300.jpg)
![Gadus morhua](images/species/Gadus_morhua_300x300.jpg)
![Gastrophryne carolinensis](images/species/Gastrophryne_carolinensis_300x300.jpg)
![Geotrypetes seraphini](images/species/Geotrypetes_seraphini_300x300.jpg)
![Gobius niger](images/species/Gobius_niger_300x300.jpg)
![Grus americana](images/species/Grus_americana_300x300.jpg)
![Harpia harpyja](images/species/Harpia_harpyja_300x300.jpg)
![Heptranchias perlo](images/species/Heptranchias_perlo_300x300.jpg)
![Hippopotamus amphibius](images/species/Hippopotamus_amphibius_300x300.jpg)
![Hydrolagus colliei](images/species/Hydrolagus_colliei_300x300.jpg)
![Hyperoodon ampullatus](images/species/Hyperoodon_ampullatus_300x300.jpg)
![Labrus bergylta](images/species/Labrus_bergylta_300x300.jpg)
![Lampetra fluviatilis](images/species/Lampetra_fluviatilis_300x300.jpg)
![Lemur catta](images/species/Lemur_catta_300x300.jpg)
![Leucopleurus acutus](images/species/Leucopleurus_acutus_300x300.jpg)

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

# [pipeline] VGP Workflow Modules
> type: image-click

![VGP Workflow Modules](images/VGP_workflow_modules.svg)

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

# [scale] VGP Workflows by Compute
> type: barchart
> data: workflow-hours.json
> Core hours used by workflows

---

# [scale] Top Assembly Tools
> type: barchart
> data: tool-hours.json
> Core hours used by individual tools

---

# [scale] Peak Memory by Tool
> type: barchart
> data: tool-memory.json
> Assembly needs memory!

---

# [scale] Powered by Galaxy + ACCESS-CI
> split: reverse

VGP leverages the US national cyberinfrastructure through ACCESS-CI, running on resources at TACC (Jetstream2), PSC, NCSA, and SDSC.

This provides the massive memory (up to 4TB) and CPU resources (up to 128 cores) needed for large vertebrate genome assemblies.

::: highlight
Galaxy provides an equivalent of >$2,000,000/year of free computational infrastructure to genomics researchers.
:::

![ACCESS-CI Infrastructure](images/access-map.svg)

---

# [resources] Key VGP Resources
> type: links

- VGP Galaxy: https://vgp.usegalaxy.org
- GenomeArk: https://genomeark2.org
- VGP Website: https://vertebrategenomesproject.org
- Galaxy US: https://usegalaxy.org

---

# [resources] gxy.io/what-is-vgp
> type: qr

![QR Code](images/qr-what-is-vgp.svg)
