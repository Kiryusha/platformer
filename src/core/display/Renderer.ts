// the class is responsible for all the work with WebGL context
import ShaderProgram from './ShaderProgram';
import Matrix from './Matrix';
import rectangleShaders from '../../assets/shaders/rectangle';
import imageShaders from '../../assets/shaders/image';
import layerShaders from '../../assets/shaders/layer';

export default class {
  gl: WebGLRenderingContext;
  rectangleProgram: ShaderProgram;
  imageProgram: ShaderProgram;
  layerProgram: ShaderProgram;
  matrix: Matrix;
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
    this.matrix = new Matrix();
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

    let texMatrix = this.matrix.translation(srcX / width, srcY / height);
    texMatrix = this.matrix.scale(texMatrix, srcWidth / width, srcHeight / height);

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
    camera: Camera,
    tiles: LayerTile[]
  ) {
    this.gl.useProgram(this.layerProgram.program);

    let tileCoords: any[] = [];
    let amount = 0;

    for (let i: number = 0; i < tiles.length; i += 1) {
      let texMatrix;
      tileCoords = tileCoords.concat(this.layerProgram.tileCoords[i]);
      texMatrix = this.matrix.translation(tiles[i].sourceX / width, tiles[i].sourceY / height);
      texMatrix = this.matrix.scale(texMatrix, tiles[i].tileSize / width, tiles[i].tileSize / height);

      this.gl.uniformMatrix3fv(this.layerProgram.uTextureMatrix, false, texMatrix);
      amount += 1;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.layerProgram.textureCoordBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(tileCoords),
      this.gl.STATIC_DRAW
    );

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.layerProgram.textureCoordBuffer);
    this.gl.enableVertexAttribArray(this.layerProgram.aTextureCoord);
    this.gl.vertexAttribPointer(this.layerProgram.aTextureCoord, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.uniform2f(this.layerProgram.uResolution, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform2f(this.layerProgram.uTranslation, camera.x , camera.y);
    this.gl.uniform2f(this.layerProgram.uScale, camera.width, camera.height);

    this.gl.uniform1i(this.layerProgram.uTexture, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6 * amount);
  }

  public clear(): void {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
