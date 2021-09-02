//#region Functions

function drawRotated(x, y, angle) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(angle-Math.PI/2);
    ctx.fillStyle = "green";
    ctx.fillRect(-25, -25, 50, 50);
    ctx.fillRect(-5, 0, 10, 50);
}
const main_func = ()=>{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    var angle = Math.atan2(mouse.pos.y - canvas.width/2, mouse.pos.x - canvas.height/2);

    // draw rotated design
    drawRotated(canvas.width/2, canvas.height/2, angle);
}
//#endregion

//#region Constants / Variables
let last_angle = 0;
//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    const x = e.offsetX;
    const y = e.offsetY;
}
canvas.onmouseup = (e) => {
    mouse.down = false;
}
canvas.onmousemove = function(e) {
}
document.addEventListener("keydown", (e)=>{
    controller_keydown(e.key);
    switch (e.key) {
        case "p":
            pause = !pause;
            break;
        case "o":
            pause = true;
            step = true;
            break;
        case " ":
    }
});
document.addEventListener("keyup", (e)=>{
    controller_keyup(e.key);
});
document.addEventListener("keypress", (e)=>{
    
})

//#endregion

let pause = false;
let step = false;
const main_loop = setInterval(() => {
    if (pause && !step) return;
    if (step) {
        step = false;
    }
    try {
        main_func();
    } catch (error) {
        console.log(error);
        pause=true;
    }
}, 1000/60);

