import { useEffect, useRef } from "react";

const toRadians = (deg) => (deg * Math.PI) / 180;
const map = (val, a1, a2, b1, b2) => b1 + ((val - a1) * (b2 - b1)) / (a2 - a1);

const Pizza = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const sliceCount = 6;
    const sliceSize = 60;
    const width = (canvas.width = canvas.height = sliceSize * 2 + 50);
    const center = width / 2;
    const sliceDegree = 360 / sliceCount;
    const sliceRadians = toRadians(sliceDegree);
    let progress = 0;
    let cooldown = 5;

    const update = () => {
      ctx.clearRect(0, 0, width, width);
      if (--cooldown < 0) progress += sliceRadians * 0.03 + progress * 0.1;

      ctx.save();
      ctx.translate(center, center);

      for (let i = sliceCount - 1; i > 0; i--) {
        let rad = i === sliceCount - 1 ? sliceRadians * i + progress : sliceRadians * i;
        ctx.beginPath();
        ctx.lineCap = "butt";
        ctx.lineWidth = 11;
        ctx.arc(0, 0, sliceSize, rad, rad + sliceRadians);
        ctx.strokeStyle = "#F57F17";
        ctx.stroke();

        let startX = sliceSize * Math.cos(rad);
        let startY = sliceSize * Math.sin(rad);
        let endX = sliceSize * Math.cos(rad + sliceRadians);
        let endY = sliceSize * Math.sin(rad + sliceRadians);

        ctx.fillStyle = "#FBC02D";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(startX, startY);
        ctx.arc(0, 0, sliceSize, rad, rad + sliceRadians);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 0.3;
        ctx.stroke();

        let x = sliceSize * 0.65 * Math.cos(rad + sliceRadians / 2);
        let y = sliceSize * 0.65 * Math.sin(rad + sliceRadians / 2);
        ctx.beginPath();
        ctx.arc(x, y, sliceDegree / 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#D84315";
        ctx.fill();
      }
      ctx.restore();

      if (progress > sliceRadians) {
        ctx.translate(center, center);
        ctx.rotate(-toRadians(sliceDegree));
        ctx.translate(-center, -center);
        progress = 0;
        cooldown = 10;
      }
      requestAnimationFrame(update);
    };
    update();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <canvas ref={canvasRef} width={150} height={150}></canvas>
    </div>
  );
};

export default Pizza;
