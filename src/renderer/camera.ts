export class Camera {
  private x = 0;
  private y = 0;
  private zoom = 1;

  get position() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getZoom(): number {
    return this.zoom;
  }

  moveScreenSpace(
    dx: number,
    dy: number,
    viewportWidth: number,
    viewportHeight: number
  ): void {
    const worldDX = (dx / viewportWidth) * 2 / this.zoom;
    const worldDY = (dy / viewportHeight) * 2 / this.zoom;

    this.x -= worldDX;
    this.y += worldDY;
  }

  zoomBy(factor: number): void {
    this.zoom = Math.max(
      0.1,
      Math.min(100, this.zoom * factor)
    );
  }
}

