const drawings = {
  knee: [
    [[68,75],[103,75],[103,110]],
    [[68,75],[103,75],[132,61]]
  ],
  elbow: [
    [[70,49],[79,74],[90,97]],
    [[70,49],[79,74],[96,51]]
  ]
};

function drawLine(ctx, points, color, width) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  points.forEach(([x,y], index) => index ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
}

document.querySelectorAll("canvas[data-movement]").forEach(canvas => {
  const ctx = canvas.getContext("2d");
  const poses = drawings[canvas.dataset.movement];
  if (!ctx || !poses) return;
  ctx.fillStyle = "#f5f8f3";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  const ink = "#244a3a";
  const accent = "#bd5b26";
  poses.forEach((limb, index) => {
    ctx.save();
    ctx.translate(index * 153 + 4,0);
    drawLine(ctx,[[52,60],[52,82],[97,82],[97,112]],"#7c8e82",3);
    drawLine(ctx,[[66,39],[68,75],[95,76],[97,108]],ink,4);
    ctx.beginPath();
    ctx.arc(65,28,9,0,2*Math.PI);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.stroke();
    drawLine(ctx,limb,accent,5);
    ctx.fillStyle = ink;
    ctx.font = "13px sans-serif";
    ctx.fillText(index ? "Bevegelse" : "Start", 45, 131);
    ctx.restore();
  });
});
