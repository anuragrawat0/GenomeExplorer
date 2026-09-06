import triangleShader from "./shaders/triangle.wgsl?raw";

export function createTrianglePipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline {
  const shaderModule = device.createShaderModule({
    code: triangleShader,
  });

  return device.createRenderPipeline({
    layout: "auto",

    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
    },

    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [
        {
          format,
        },
      ],
    },

    primitive: {
      topology: "triangle-list",
    },
  });
}