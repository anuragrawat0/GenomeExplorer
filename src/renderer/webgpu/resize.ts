export function resizeCanvas(
  canvas: HTMLCanvasElement,
  devicePixelRatio = window.devicePixelRatio
): boolean {
  const width = Math.floor(canvas.clientWidth * devicePixelRatio);
  const height = Math.floor(canvas.clientHeight * devicePixelRatio);

  if (canvas.width === width && canvas.height === height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;

  return true;
}
