import { useEffect, useRef, useState } from "react";
import { floodFill } from "../lib/floodFill.js";
import { makeHistory } from "../lib/history.js";

export default function CanvasColoring({ imageSrc, color, onReady }) {
  const canvasRef = useRef(null);
  const [hist] = useState(() => makeHistory());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const targetW = Math.min(img.width || 1024, 1024);
      const scale = targetW / img.width;
      const targetH = Math.round(img.height * scale);

      canvas.width = targetW;
      canvas.height = targetH;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      hist.reset(ctx);
      onReady?.({ canvas, ctx, hist });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const t = e.touches?.[0];
    const clientX = t ? t.clientX : e.clientX;
    const clientY = t ? t.clientY : e.clientY;
    return {
      x: Math.floor(((clientX - r.left) * canvas.width) / r.width),
      y: Math.floor(((clientY - r.top) * canvas.height) / r.height),
    };
  };

  const onFill = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const { x, y } = getPos(e);

    hist.push(ctx);
    floodFill(ctx, x, y, color, { tolerance: 30, barrier: 90 });
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={onFill}
      onTouchStart={onFill}
      style={{
        width: "min(96vw, 860px)",
        height: "auto",
        borderRadius: 14,
        border: "1px solid #243044",
        background: "#fff",
        touchAction: "none",
        display: "block",
      }}
    />
  );
}
