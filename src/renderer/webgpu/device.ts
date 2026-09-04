export interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
}

export async function initializeWebGPU(): Promise<WebGPUContext> {
  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported in this browser.");
  }

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error("Failed to get a WebGPU adapter.");
  }

  const device = await adapter.requestDevice();

  device.lost.then((info) => {
    console.error("WebGPU device lost:", info.message);
  });

  return {
    adapter,
    device,
  };
}