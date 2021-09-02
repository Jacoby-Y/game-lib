//? Not mine ~~~

const ctx = canvas.getContext("2d");
// create mouse event listener
const mouse = { x: 0, y: 0 };
function mouseEvents(e) {
  const bounds = canvas.getBoundingClientRect();
  mouse.x = e.pageX - bounds.left - scrollX;
  mouse.y = e.pageY - bounds.top - scrollY;
}
document.addEventListener("mousemove", mouseEvents);

// draw design at x,y and rotated by angle
function drawRotated(x, y, angle) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, Math.PI * 2);
    ctx.moveTo(-100, 0);
    ctx.lineTo(100, 0);
    ctx.lineTo(60, -80);
    ctx.closePath();
    ctx.stroke();
    
    ctx.strokeRect(0, 0, 10, 10);
}

// render loop called 60 times a second
function update(timer) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.clearRect(0, 0, 300, 300);
    

    // get angle from center to mouse
    var angle = Math.atan2(mouse.y - 150, mouse.x - 150);

    // draw rotated design
    drawRotated(150, 150, angle);
    requestAnimationFrame(update);
}
requestAnimationFrame(update);