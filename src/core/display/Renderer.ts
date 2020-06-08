// the class is responsible for all the work with WebGL context
import ShaderProgram from './ShaderProgram';
import rectangleShaders from '../../assets/shaders/rectangle';
import imageShaders from '../../assets/shaders/image';

export default class {
  gl: WebGLRenderingContext;
  rectangleProgram: ShaderProgram;
  imageProgram: ShaderProgram;
  aPosition: number;
  uResolution: WebGLUniformLocation;
  uColor: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext
  ) {
    this.gl = gl;
    this.rectangleProgram = new ShaderProgram(
      this.gl,
      rectangleShaders.vertexShaderSource,
      rectangleShaders.fragmentShaderSource
    );

    this.imageProgram = new ShaderProgram(
      this.gl,
      imageShaders.vertexShaderSource,
      imageShaders.fragmentShaderSource
    );
  }

  drawRect(
    positions: number[] | Iterable<number>,
    color: number[],
  ): void {
    const aPosition = this.gl.getAttribLocation(this.rectangleProgram.program, 'aPosition');
    const uResolution = this.gl.getUniformLocation(this.rectangleProgram.program, 'uResolution');
    const uColor = this.gl.getUniformLocation(this.rectangleProgram.program, 'uColor');

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.DYNAMIC_DRAW
    );
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.gl.useProgram(this.rectangleProgram.program);

    this.gl.enableVertexAttribArray(aPosition);
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(uResolution, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform4f(uColor, color[0] / 255, color[1] / 255, color[2] / 255, color[3]);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  clear(): void {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
