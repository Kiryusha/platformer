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
    // this.rectangleProgram = new ShaderProgram(
    //   this.gl,
    //   rectangleShaders.vertexShaderSource,
    //   rectangleShaders.fragmentShaderSource,
    //   'rectangle'
    // );

    this.imageProgram = new ShaderProgram(
      this.gl,
      imageShaders.vertexShaderSource,
      imageShaders.fragmentShaderSource,
      'image'
    );
  }

  drawRect(
    positions: number[] | Iterable<number>,
    color: number[],
  ): void {
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    // this.gl.bufferData(
    //   this.gl.ARRAY_BUFFER,
    //   new Float32Array(positions),
    //   this.gl.DYNAMIC_DRAW
    // );
    // this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    //
    // this.gl.clearColor(0, 0, 0, 0);
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    //
    // this.gl.useProgram(this.rectangleProgram.program);
    //
    // this.gl.enableVertexAttribArray(this.rectangleProgram.aPosition);
    // this.gl.vertexAttribPointer(
    //   this.rectangleProgram.aPosition,
    //   2,
    //   this.gl.FLOAT,
    //   false,
    //   0,
    //   0
    // );
    // this.gl.uniform2f(
    //   this.rectangleProgram.uResolution,
    //   this.gl.canvas.width,
    //   this.gl.canvas.height
    // );
    // this.gl.uniform4f(
    //   this.rectangleProgram.uColor,
    //   color[0] / 255,
    //   color[1] / 255,
    //   color[2] / 255,
    //   color[3]
    // );
    //
    // this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  drawImage(
    texture: WebGLTexture,
    width: number,
    height: number,
    srcX: number,
    srcY: number,
    srcWidth?: number,
    srcHeight?: number,
    dstX?: number,
    dstY?: number,
    dstWidth?: number,
    dstHeight?: number
  ): void {
    if (dstX === undefined) {
      dstX = srcX;
    }

    if (dstY === undefined) {
      dstY = srcY;
    }

    if (srcWidth === undefined) {
      srcWidth = width;
    }

    if (srcHeight === undefined) {
      srcHeight = height;
    }

    if (dstWidth === undefined) {
      dstWidth = srcWidth;
    }

    if (dstHeight === undefined) {
      dstHeight = srcHeight;
    }

    const u0 = srcX / width;
    const v0 = srcY / height;

    const u1 = (srcX + srcWidth) / width;
    const v1 = (srcY + srcHeight) / height;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.imageProgram.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        u0,  v0,
        u1,  v0,
        u0,  v1,
        u0,  v1,
        u1,  v0,
        u1,  v1,
      ]),
      this.gl.STREAM_DRAW
    );

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Tell WebGL to use our shader program pair
    this.gl.useProgram(this.imageProgram.program);

    // Setup the attributes to pull data from our buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.imageProgram.positionBuffer);
    this.gl.enableVertexAttribArray(this.imageProgram.aPosition);
    this.gl.vertexAttribPointer(this.imageProgram.aPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.imageProgram.textureCoordBuffer);
    this.gl.enableVertexAttribArray(this.imageProgram.aTextureCoord);
    this.gl.vertexAttribPointer(this.imageProgram.aTextureCoord, 2, this.gl.FLOAT, false, 0, 0);

    // set the resolution
    this.gl.uniform2f(this.imageProgram.uResolution, this.gl.canvas.width, this.gl.canvas.height);
    // Set the translation.
    this.gl.uniform2f(this.imageProgram.uTranslation, dstX, dstY);
    // Set the rotation.
    this.gl.uniform2f(this.imageProgram.uRotation, Math.sin(0), Math.cos(0));
    // Set the scale.
    this.gl.uniform2f(this.imageProgram.uScale, dstWidth, dstHeight);

    // Tell the shader to get the texture from texture unit 0
    this.gl.uniform1i(this.imageProgram.uTexture, 0);

    // draw the quad (2 triangles, 6 vertices)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  public clear(): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
