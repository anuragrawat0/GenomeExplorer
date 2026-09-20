import triangleShader from "./shaders/triangle.wgsl?raw";

export function createTrianglePipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline {
  const shaderModule = device.createShaderModule({
    code: triangleShader,
  });

  return device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        device.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.VERTEX,
              buffer: {
                type: "uniform",
              },
            },
          ],
        }),
      ],
    }),

    vertex: {
      module: shaderModule,
      entryPoint: "vertexMain",
    },

    fragment: {
      module: shaderModule,
      entryPoint: "fragmentMain",
      targets: [{ format }],
    },

    primitive: {
      topology: "triangle-list",
    },
  });
}