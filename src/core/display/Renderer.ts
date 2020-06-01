// the class is responsible for all the work with WebGL context
import Shader from './Shader';
import defaultShaders from '../../assets/shaders/defaults';

export default class {
  gl: WebGLRenderingContext;
  shader: Shader;
  aPosition: number;

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
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  drawTriangle(positions: number[] | Iterable<number>): void {
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW
    );

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.useProgram(this.shader.program);

    this.gl.enableVertexAttribArray(this.aPosition);
    this.gl.vertexAttribPointer(this.aPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}
