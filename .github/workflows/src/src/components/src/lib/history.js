export function makeHistory(limit = 30) {
  let past = [];
  let future = [];

  const snap = (ctx) =>
    ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

  return {
    reset(ctx) {
      past = [snap(ctx)];
      future = [];
    },
    push(ctx) {
      past.push(snap(ctx));
      if (past.length > limit) past.shift();
      future = [];
    },
    undo(ctx) {
      if (past.length <= 1) return;
      future.push(past.pop());
      ctx.putImageData(past[past.length - 1], 0, 0);
    },
    redo(ctx) {
      if (!future.length) return;
      const next = future.pop();
      past.push(next);
      ctx.putImageData(next, 0, 0);
    },
  };
}
