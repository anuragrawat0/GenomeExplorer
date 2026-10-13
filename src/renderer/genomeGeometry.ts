import { mockGenes, mockVariants } from "../data/mockGenome";
import { mockGenome } from "../data/mockGenome";
import { GenomeCoordinateSystem } from "../data/GenomeCoordinateSystem";

const coordinates = new GenomeCoordinateSystem(mockGenome);

// Each vertex: x, y, r, g, b, a
const vertices: number[] = [];

function addRect(
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  color: [number, number, number, number],
) {
  const points = [
    [x1, y1], [x2, y1], [x1, y2],
    [x1, y2], [x2, y1], [x2, y2],
  ];

  for (const [x, y] of points) {
    vertices.push(x!, y!, ...color);
  }
}

const axisColor: [number, number, number, number] = [
  0.55, 0.60, 0.68, 1.0,
];

// Horizontal chromosome backbone
addRect(0, 1, 0.78, 0.785, axisColor);

// Tick marks every 10% of chromosome length
for (let i = 0; i <= 10; i++) {
  const x = i / 10;
  const halfWidth = 0.0015;

  addRect(
    Math.max(0, x - halfWidth),
    Math.min(1, x + halfWidth),
    0.745,
    0.805,
    axisColor,
  );
}

// Gene rectangles
for (const gene of mockGenes) {
  const region = coordinates.regionToNormalized(gene);

  addRect(
    region.start, region.end,
    0.55, 0.72,
    [0.1, 0.7, 1.0, 1.0],
  );
}

// Variant markers
for (const variant of mockVariants) {
  const x = coordinates.positionToNormalized(
    variant.chromosome,
    variant.position,
  );

  const color: [number, number, number, number] =
    variant.type === "SNP"
      ? [1.0, 0.3, 0.25, 1.0]
      : [1.0, 0.8, 0.15, 1.0];

  addRect(x - 0.002, x + 0.002, 0.32, 0.52, color);
}

export const genomeVertices = new Float32Array(vertices);