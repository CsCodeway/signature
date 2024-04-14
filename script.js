const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let strokeColor = "black";

const colorInput = document.getElementById("text-color");
colorInput.addEventListener("change", (e) => {
  strokeColor = e.target.value;
});

function getTouchPos(canvasDom, touchEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("touchstart", (e) => {
  isDrawing = true;
  const pos = getTouchPos(canvas, e);
  [lastX, lastY] = [pos.x, pos.y];
});
function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const pos =
    e.type === "mousemove"
      ? { x: e.offsetX, y: e.offsetY }
      : getTouchPos(canvas, e);
  drawLine(lastX, lastY, pos.x, pos.y);
  [lastX, lastY] = [pos.x, pos.y];
}

canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchmove", draw);

function endDrawing() {
  isDrawing = false;
}
canvas.addEventListener("mouseup", endDrawing);
canvas.addEventListener("mouseout", endDrawing);
canvas.addEventListener("touchend", endDrawing);

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}
const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
const download = document.getElementById("download");
download.addEventListener("click", () => {
  if (
    ctx
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some((channel) => channel !== 0)
  ) {
    const dataURL = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "signature.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("Please draw a signature first!");
  }
});