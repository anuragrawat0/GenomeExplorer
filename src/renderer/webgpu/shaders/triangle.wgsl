@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
    var positions = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 0.6),
        vec2<f32>(-0.6, -0.6),
        vec2<f32>(0.6, -0.6)
    );

    let position = positions[vertexIndex];

    return vec4<f32>(position, 0.0, 1.0);
}

@fragment
fn fragmentMain() -> @location(0) vec4<f32> {
    return vec4<f32>(0.1, 0.7, 1.0, 1.0);
}