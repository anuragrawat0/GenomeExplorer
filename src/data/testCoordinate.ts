import { mockGenome, mockGenes } from "./mockGenome";
import { GenomeCoordinateSystem } from "./GenomeCoordinateSystem";

const coordinates = new GenomeCoordinateSystem(mockGenome);

for (const gene of mockGenes) {
  const mapped = coordinates.regionToNormalized(gene);

  console.log(gene.name, mapped);
}