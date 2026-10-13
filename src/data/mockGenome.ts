import type { Genome, GenomicRegion } from "./genome";

export const mockGenome: Genome = {
  chromosomes: [
    { name: "chr1", length: 1_000_000 },
  ],
};

export interface Gene extends GenomicRegion {
  id: string;
  name: string;
}

export interface Variant {
  id: string;
  chromosome: string;
  position: number;
  type: "SNP" | "INDEL";
}

export const mockGenes: Gene[] = [
  {
    id: "gene-1",
    name: "GENE-A",
    chromosome: "chr1",
    start: 100_000,
    end: 220_000,
  },
  {
    id: "gene-2",
    name: "GENE-B",
    chromosome: "chr1",
    start: 350_000,
    end: 480_000,
  },
  {
    id: "gene-3",
    name: "GENE-C",
    chromosome: "chr1",
    start: 700_000,
    end: 920_000,
  },
];

export const mockVariants: Variant[] = [
  { id: "var-1", chromosome: "chr1", position: 150_000, type: "SNP" },
  { id: "var-2", chromosome: "chr1", position: 390_000, type: "INDEL" },
  { id: "var-3", chromosome: "chr1", position: 650_000, type: "SNP" },
  { id: "var-4", chromosome: "chr1", position: 850_000, type: "SNP" },
];