import { Camera } from "./camera";
import { initializeWebGPU } from "./webgpu/device";
import { createTrianglePipeline } from "./webgpu/pipeline";
import { resizeCanvas } from "./webgpu/resize";

export class GenomeRenderer {
  private canvas: HTMLCanvasElement;

  private device: GPUDevice | null = null;
  private context: GPUCanvasContext | null = null;
  private pipeline: GPURenderPipeline | null = null;
  private cameraBuffer: GPUBuffer | null = null;
  private cameraBindGroup: GPUBindGroup | null = null;

  private animationFrameId: number | null = null;

  private camera: Camera;

  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new Camera();

    this.setupInteraction();
  }

  async initialize(): Promise<void> {
    const { device } = await initializeWebGPU();

    this.device = device;

    const context = this.canvas.getContext(
      "webgpu"
    ) as GPUCanvasContext | null;

    if (!context) {
      throw new Error("Failed to get WebGPU canvas context.");
    }

    this.context = context;

    const format = navigator.gpu.getPreferredCanvasFormat();

    context.configure({
      device,
      format,
      alphaMode: "opaque",
    });

    this.pipeline = createTrianglePipeline(device, format);

    this.cameraBuffer = device.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.cameraBindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.cameraBuffer,
          },
        },
      ],
    });
  }

  start(): void {
    if (!this.device || !this.context || !this.pipeline) {
      throw new Error("Renderer has not been initialized.");
    }

    const render = () => {
      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  private renderFrame(): void {
    if (!this.device || !this.context || !this.pipeline) {
      return;
    }

    resizeCanvas(this.canvas);

    const commandEncoder = this.device.createCommandEncoder();

    const position = this.camera.position;
    const zoom = this.camera.getZoom();

    const cameraData = new Float32Array([
      position.x,
      position.y,
      zoom,
      0,
    ]);

    this.device.queue.writeBuffer(
      this.cameraBuffer,
      0,
      cameraData
    );

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context
            .getCurrentTexture()
            .createView(),

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

    renderPass.setPipeline(this.pipeline);
    renderPass.setBindGroup(0, this.cameraBindGroup);
    renderPass.draw(3);
    renderPass.end();

    this.device.queue.submit([
      commandEncoder.finish(),
    ]);
  }

  private setupInteraction(): void {
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointerleave", this.handlePointerUp);

    this.canvas.addEventListener("wheel", this.handleWheel, {
      passive: false,
    });
  }

  private handlePointerDown = (event: PointerEvent): void => {
    this.isDragging = true;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    this.canvas.setPointerCapture(event.pointerId);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMouseX;
    const dy = event.clientY - this.lastMouseY;

    this.camera.moveScreenSpace(
      dx,
      dy,
      this.canvas.clientWidth,
      this.canvas.clientHeight
    );

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  };

  private handlePointerUp = (): void => {
    this.isDragging = false;
  };

  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault();

    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;

    this.camera.zoomBy(zoomFactor);
  };


  getCamera(): Camera {
    return this.camera;
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy(): void {
    this.stop();

    this.canvas.removeEventListener(
      "pointerdown",
      this.handlePointerDown
    );
    this.canvas.removeEventListener(
      "pointermove",
      this.handlePointerMove
    );
    this.canvas.removeEventListener(
      "pointerup",
      this.handlePointerUp
    );
    this.canvas.removeEventListener(
      "pointerleave",
      this.handlePointerUp
    );
    this.canvas.removeEventListener(
      "wheel",
      this.handleWheel
    );

    this.device = null;
    this.context = null;
    this.pipeline = null;
  }
}
