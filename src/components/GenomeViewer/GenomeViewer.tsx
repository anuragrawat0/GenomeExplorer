import { useEffect, useRef } from "react";
import { GenomeRenderer } from "../../renderer/GenomeRenderer";

export function GenomeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const renderer = new GenomeRenderer(canvas);

    async function startRenderer() {
      try {
        await renderer.initialize();
        renderer.start();
      } catch (error) {
        console.error("Failed to initialize renderer:", error);
      }
    }

    startRenderer();

    return () => {
      renderer.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}