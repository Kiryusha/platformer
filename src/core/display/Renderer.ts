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

    let texMatrix = this.translation(srcX / width, srcY / height, 0);
    texMatrix = this.scale(texMatrix, srcWidth / width, srcHeight / height, 1);

    // Set the matrix.
    this.gl.uniformMatrix4fv(this.imageProgram.uTextureMatrix, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    this.gl.uniform1i(this.imageProgram.uTexture, 0);

    // draw the quad (2 triangles, 6 vertices)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private translation(tx: number, ty: number, tz: number) {
    let dst = new Float32Array(16);

    dst[ 0] = 1;
    dst[ 1] = 0;
    dst[ 2] = 0;
    dst[ 3] = 0;
    dst[ 4] = 0;
    dst[ 5] = 1;
    dst[ 6] = 0;
    dst[ 7] = 0;
    dst[ 8] = 0;
    dst[ 9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = tx;
    dst[13] = ty;
    dst[14] = tz;
    dst[15] = 1;

    return dst;
  }

  private scale(
    m: Float32Array,
    sx: number,
    sy: number,
    sz: number,
  ) {
    const dst = new Float32Array(16);

    dst[0] = sx * m[0 * 4 + 0];
    dst[1] = sx * m[0 * 4 + 1];
    dst[2] = sx * m[0 * 4 + 2];
    dst[3] = sx * m[0 * 4 + 3];
    dst[4] = sy * m[1 * 4 + 0];
    dst[5] = sy * m[1 * 4 + 1];
    dst[6] = sy * m[1 * 4 + 2];
    dst[7] = sy * m[1 * 4 + 3];
    dst[8] = sz * m[2 * 4 + 0];
    dst[9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  }

  public clear(): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
