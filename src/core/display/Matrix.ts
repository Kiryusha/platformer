// Matrix for working with 2D
export default class Matrix {
  public translation(tx: number, ty: number) {
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

  public scale(
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
}
