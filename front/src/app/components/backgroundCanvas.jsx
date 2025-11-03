import { useEffect, useRef } from "react";

export default function BackgroundCanvas({ width, height }) {
  const bgRef = useRef(null);

  useEffect(() => {
    const canvas = bgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    drawPermanentBackground(ctx, width, height);
  }, [width, height]);

  function drawPermanentBackground(ctx, width, height) {
    // Fill background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Light gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(219, 234, 254, 0.4)");
    gradient.addColorStop(1, "rgba(191, 219, 254, 0.15)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.07)";
    ctx.lineWidth = 1;
    const spacing = 25;
    for (let x = 0; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  return (
    <canvas
      ref={bgRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 z-0"
    />
  );
}
