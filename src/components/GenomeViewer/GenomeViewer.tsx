import { useEffect, useRef } from "react";
import { initializeWebGPU } from "../../renderer/webgpu/device";
import { createTrianglePipeline } from "../../renderer/webgpu/pipeline";

export function GenomeViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    async function initialize(canvas: HTMLCanvasElement) {
      try {
        const { device } = await initializeWebGPU();

        const context = canvas.getContext(
          "webgpu"
        ) as GPUCanvasContext | null;

        if (!context) {
          throw new Error("Failed to get WebGPU canvas context.");
        }

        const format = navigator.gpu.getPreferredCanvasFormat();

        context.configure({
          device,
          format,
          alphaMode: "opaque",
        });

        const pipeline = createTrianglePipeline(device, format);

        const commandEncoder = device.createCommandEncoder();

        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: {
                r: 0.02,
                g: 0.02,
                b: 0.02,
                a: 1,
              },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });

        renderPass.setPipeline(pipeline);
        renderPass.draw(3);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);

        console.log("WebGPU triangle rendered successfully.");
      } catch (error) {
        console.error("WebGPU initialization failed:", error);
      }
    }

    initialize(canvas);
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

