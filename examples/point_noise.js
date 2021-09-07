//#region Functions
const main_func = ()=>{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    update_entities();
    event_manager.step_jobs();
    
    run_shader((x,y, divisor, data)=>{
        let closest = Infinity;
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dist = distance(x,y, p.x, p.y);

            if (dist < closest) {
                closest = dist;
            }
        }
        if (closest > 255) return;

        const shade = Math.floor((closest/255)*255);

        const color = `rgb(${shade}, ${shade}, ${shade})`;
        draw.rect(x,y, divisor, divisor, {fill: true, fillStyle: color, stroke: false});
    }, 10)

    // pixelate(100);
}
//#endregion

//#region Constants / Variables

const points = [];
for (let i = 0; i < 10; i++) {
    points.push({
        x: random_range(0, canvas.width, true),
        y: random_range(0, canvas.height, true),
    });
}

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

let pause = true;
let step = true;
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

