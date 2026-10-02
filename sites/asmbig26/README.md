# Galaxy @ ASM BIG 2026

Booth slideshow for the ASM Bioinformatics, Genomics and Big Data Conference
(ASM BIG, October 11-14, 2026, Washington, D.C.). It reworks the
`what_is_galaxy` deck around microbiology: the microGalaxy community, the
Microbiology Galaxy Lab, isolate and microbiome analysis, curated IWC
workflows, training, and how to join.

Primary content source: https://galaxyproject.org/community/sig/microbial/

## Build

```bash
node build.js sites/asmbig26
cp -r sites/asmbig26/dist ~/git/infographics/asmbig26
```

## Assets

- `images/microgalaxy-logo.png`, `images/isolates-overview.png`,
  `images/microbiome-overview.png`: from the microGalaxy lab sources in
  [galaxy_codex](https://github.com/galaxyproject/galaxy_codex/tree/main/communities/microgalaxy)
  and the 2025 Microbiology Galaxy Lab paper figures
  (https://github.com/usegalaxy-eu/microbiology_galaxy_lab_paper_2025).
- `images/iwc-microbiome.png`, `images/gtn-microbiome.png`: screenshots of
  iwc.galaxyproject.org (Microbiome filter) and the GTN Microbiome topic.
- `images/qr-*.svg`: generated with `qrencode -t SVG -m 2`.
- Remaining screenshots and logos are shared with `what_is_galaxy`.

## Numbers to refresh before reuse

Lab stats (315+ tool suites, 115+ workflows, 170+ reference genomes, 11 TB)
and publication counts (2,908 / 836 / 593, through December 2025) come from
the microGalaxy SIG page; the global Galaxy stats on slide 1 are shared with
`what_is_galaxy`.
