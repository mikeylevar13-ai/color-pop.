export function floodFill(ctx, x, y, hexColor, opts = {}) {
  const { tolerance = 28, barrier = 90, minAlpha = 10 } = opts;

  const { width, height } = ctx.canvas;
  const img = ctx.getImageData(0, 0, width, height);
  const data = img.data;

  const idx = (xx, yy) => (yy * width + xx) * 4;

  const startI = idx(x, y);
  const startPx = pxAt(data, startI);
  if (isBarrier(startPx, barrier, minAlpha)) return;

  const fill = hexToRgba(hexColor);
  if (sameColor(startPx, fill)) return;

  const stack = [{ x, y }];
  const seen = new Uint8Array(width * height);

  while (stack.length) {
    const p = stack.pop();
    if (p.x < 0 || p.x >= width || p.y < 0 || p.y >= height) continue;

    const s = p.y * width + p.x;
    if (seen[s]) continue;
    seen[s] = 1;

    const i = idx(p.x, p.y);
    const cur = pxAt(data, i);

    if (isBarrier(cur, barrier, minAlpha)) continue;
    if (!withinTolerance(cur, startPx, tolerance)) continue;

    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = 255;

    stack.push({ x: p.x + 1, y: p.y });
    stack.push({ x: p.x - 1, y: p.y });
    stack.push({ x: p.x, y: p.y + 1 });
    stack.push({ x: p.x, y: p.y - 1 });
  }

  ctx.putImageData(img, 0, 0);
}

function pxAt(data, i) {
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}
function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function isBarrier(px, barrier, minAlpha) {
  const [r, g, b, a] = px;
  if (a < minAlpha) return false;
  return luminance([r, g, b]) < barrier;
}
function withinTolerance(c, t, tol) {
  return (
    Math.abs(c[0] - t[0]) <= tol &&
    Math.abs(c[1] - t[1]) <= tol &&
    Math.abs(c[2] - t[2]) <= tol &&
    Math.abs(c[3] - t[3]) <= tol
  );
}
function sameColor(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function hexToRgba(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}
