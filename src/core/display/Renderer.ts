// the class is responsible for all the work with WebGL context
import ShaderProgram from './ShaderProgram';
import rectangleShaders from '../../assets/shaders/rectangle';
import imageShaders from '../../assets/shaders/image';
import layerShaders from '../../assets/shaders/layer';

export default class {
  gl: WebGLRenderingContext;
  rectangleProgram: ShaderProgram;
  imageProgram: ShaderProgram;
  layerProgram: ShaderProgram;
  aPosition: number;
  uResolution: WebGLUniformLocation;
  uColor: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    sceneWidth: number,
    sceneHeight: number,
    tileSize: number,
  ) {
    this.gl = gl;
    this.rectangleProgram = new ShaderProgram(
      this.gl,
      rectangleShaders.vertexShaderSource,
      rectangleShaders.fragmentShaderSource,
      'rectangle'
    );

    this.imageProgram = new ShaderProgram(
      this.gl,
      imageShaders.vertexShaderSource,
      imageShaders.fragmentShaderSource,
      'image'
    );

    this.layerProgram = new ShaderProgram(
      this.gl,
      layerShaders.vertexShaderSource,
      layerShaders.fragmentShaderSource,
      'layer',
      sceneWidth,
      sceneHeight,
      tileSize,
    );
  }

  public drawRect(
    positions: number[] | Iterable<number>,
    color: number[],
  ): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.DYNAMIC_DRAW
    );
    this.gl.useProgram(this.rectangleProgram.program);

    this.gl.enableVertexAttribArray(this.rectangleProgram.aPosition);
    this.gl.vertexAttribPointer(
      this.rectangleProgram.aPosition,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );
    this.gl.uniform2f(
      this.rectangleProgram.uResolution,
      this.gl.canvas.width,
      this.gl.canvas.height
    );
    this.gl.uniform4f(
      this.rectangleProgram.uColor,
      color[0] / 255,
      color[1] / 255,
      color[2] / 255,
      color[3]
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  public drawImage(
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

    // set the resolution
    this.gl.uniform2f(this.imageProgram.uResolution, this.gl.canvas.width, this.gl.canvas.height);
    // Set the translation.
    this.gl.uniform2f(this.imageProgram.uTranslation, dstX, dstY);
    // Set the scale.
    this.gl.uniform2f(this.imageProgram.uScale, dstWidth, dstHeight);

    let texMatrix = this.translation(srcX / width, srcY / height);
    texMatrix = this.scale(texMatrix, srcWidth / width, srcHeight / height);

    // Set the matrix.
    this.gl.uniformMatrix3fv(this.imageProgram.uTextureMatrix, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    this.gl.uniform1i(this.imageProgram.uTexture, 0);

    // draw the quad (2 triangles, 6 vertices)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  public drawLayer(
    texture: WebGLTexture,
    width: number,
    height: number,
    tiles: LayerTile[]
  ) {
    // Tell WebGL to use our shader program pair
    this.gl.useProgram(this.layerProgram.program);

    let amount = 0;

    for (let i: number = 0; i < tiles.length; i += 1) {
      let texMatrix;
      texMatrix = this.translation(tiles[0].sourceX / width, tiles[0].sourceY / height);
      texMatrix = this.scale(texMatrix, tiles[0].tileSize / width, tiles[0].tileSize / height);

      this.gl.uniformMatrix3fv(this.layerProgram.uTextureMatrix, false, texMatrix);
      amount += 1;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.layerProgram.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(this.layerProgram.tileCoords),
      this.gl.STREAM_DRAW
    );

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Setup the attributes to pull data from our buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.layerProgram.positionBuffer);
    this.gl.enableVertexAttribArray(this.layerProgram.aPosition);
    this.gl.vertexAttribPointer(this.layerProgram.aPosition, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.layerProgram.textureCoordBuffer);
    this.gl.enableVertexAttribArray(this.layerProgram.aTextureCoord);
    this.gl.vertexAttribPointer(this.layerProgram.aTextureCoord, 2, this.gl.FLOAT, false, 0, 0);

    // set the resolution
    this.gl.uniform2f(this.layerProgram.uResolution, this.gl.canvas.width, this.gl.canvas.height);
    // Set the translation.
    this.gl.uniform2f(this.layerProgram.uTranslation, 0, 0);
    // Set the scale.
    this.gl.uniform2f(this.layerProgram.uScale, 256, 144);
    // console.log(texMatrix)
    // Set the matrix.

    // Tell the shader to get the texture from texture unit 0
    this.gl.uniform1i(this.layerProgram.uTexture, 0);

    // draw the quad (2 triangles, 6 vertices)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  private translation(tx: number, ty: number) {
    let dst = new Float32Array(9);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 1;
    dst[5] = 0;
    dst[6] = tx;
    dst[7] = ty;
    dst[8] = 1;

    return dst;
  }

  private scale(
    m: Float32Array,
    sx: number,
    sy: number,
  ) {
    const dst = new Float32Array(9);

    dst[0] = sx * m[0];
    dst[1] = sx * m[1];
    dst[2] = sx * m[2];
    dst[3] = sy * m[3];
    dst[4] = sy * m[4];
    dst[5] = sy * m[5];
    dst[6] = m[6];
    dst[7] = m[7];
    dst[8] = m[8];

    return dst;
  }

  public clear(): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
