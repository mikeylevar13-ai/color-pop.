import { useRef, useState } from "react";
import CanvasColoring from "./components/CanvasColoring.jsx";

const COLORS = ["#111827","#ef4444","#f59e0b","#22c55e","#3b82f6","#a855f7","#ec4899","#ffffff"];

export default function App() {
  const [color, setColor] = useState("#3b82f6");
  const apiRef = useRef(null);

  const exportPng = () => {
    const canvas = apiRef.current?.canvas;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "color-pop.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const undo = () => apiRef.current?.hist?.undo(apiRef.current.ctx);
  const redo = () => apiRef.current?.hist?.redo(apiRef.current.ctx);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb", padding: 18 }}>
      <h1 style={{ margin: "6px 0 12px", fontFamily: "system-ui" }}>Color Pop</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            title={c}
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: c,
              border: c === color ? "2px solid #fff" : "1px solid #334155",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={exportPng}>Export PNG</button>
      </div>

      <CanvasColoring
        imageSrc={"/pages/outline1.png"}
        color={color}
        onReady={(api) => (apiRef.current = api)}
      />
    </div>
  );
}
