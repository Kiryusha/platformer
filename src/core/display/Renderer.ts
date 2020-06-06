// the class is responsible for all the work with WebGL context
import Shader from './Shader';
import defaultShaders from '../../assets/shaders/defaults';

export default class {
  gl: WebGLRenderingContext;
  shader: Shader;
  aPosition: number;
  uResolution: WebGLUniformLocation;
  uColor: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext
  ) {
    this.gl = gl;
    this.shader = new Shader(
      this.gl,
      defaultShaders.vertexShaderSource,
      defaultShaders.fragmentShaderSource
    );

    this.aPosition = this.gl.getAttribLocation(this.shader.program, 'aPosition');
    this.uResolution = this.gl.getUniformLocation(this.shader.program, 'uResolution');
    this.uColor = this.gl.getUniformLocation(this.shader.program, 'uColor');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
  }

  drawRect(
    positions: number[] | Iterable<number>,
    color: number[],
  ): void {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.DYNAMIC_DRAW
    );
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.useProgram(this.shader.program);

    this.gl.enableVertexAttribArray(this.aPosition);
    this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.uResolution, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform4f(this.uColor, color[0] / 255, color[1] / 255, color[2] / 255, color[3]);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  clear(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
