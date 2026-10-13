import type { Genome, GenomicRegion } from "./genome";

export class GenomeCoordinateSystem {
  constructor(private readonly genome: Genome) {}

  chromosomeLength(chromosome: string): number {
    const entry = this.genome.chromosomes.find(
      (item) => item.name === chromosome
    );

    if (!entry) {
      throw new Error(`Unknown chromosome: ${chromosome}`);
    }

    return entry.length;
  }

  positionToNormalized(
    chromosome: string,
    position: number
  ): number {
    const length = this.chromosomeLength(chromosome);

    if (!Number.isFinite(position) || position < 0 || position > length) {
      throw new Error("Position is outside the chromosome.");
    }

    return position / length;
  }

  regionToNormalized(region: GenomicRegion) {
    const length = this.chromosomeLength(region.chromosome);

    if (
      !Number.isFinite(region.start) ||
      !Number.isFinite(region.end) ||
      region.start < 0 ||
      region.end > length ||
      region.end <= region.start
    ) {
      throw new Error("Invalid genomic region.");
    }

    return {
      start: region.start / length,
      end: region.end / length,
      width: (region.end - region.start) / length,
    };
  }
}