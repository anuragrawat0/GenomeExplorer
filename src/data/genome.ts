export type Base = "A" | "C" | "G" | "T" | "N";

export interface GenomicPosition {
  chromosome: string;
  position: number;
}

export interface GenomicRegion {
  chromosome: string;
  start: number;
  end: number;
}

export interface Chromosome {
  name: string;
  length: number;
}

export interface Genome {
  chromosomes: Chromosome[];
}
