const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    const divisor = 8;
    for (let py = 0; py < canvas.height/divisor; py++) {
        for (let px = 0; px < canvas.width/divisor; px++) {
            const x = px * divisor;
            const y = py * divisor;
            const dist = distance2(mouse.pos, {x: x, y: y});
            const dist_circ = distance2(circ, {x: x, y: y});
            const angle = get_angle({x: x, y: y}, mouse.pos);
            let alpha = 1;
            if (dist <= light_dist && dist_circ > circ.radius)
                alpha = dist/light_dist;
            
            for (let i = 0; i < dist; i++) {
                ctx.fillStyle = `blue`;
                const rx = x+Math.cos(angle)*i;
                const ry = y+Math.sin(angle)*i;
                if (distance2(circ, {x:rx,y:ry})<=circ.radius) {
                    alpha = 1;
                    break;
                }
                // ctx.fillRect(rx,ry, divisor, divisor);
            }

            ctx.fillStyle = `rgba(0,0,0, ${alpha})`;
            ctx.fillRect(x,y, divisor, divisor);
        }
    }
}
//#endregion

//#region Constants / Variables

const light_dist = 300;
const circ = {x: canvas.width/2, y: canvas.height/2, radius: 30};
//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    const x = e.layerX;
    const y = e.layerY;
    
}
canvas.onmouseup = (e) => {
    mouse.down = false;
}
canvas.onmousemove = function(e) {
    const x = e.layerX;
    const y = e.layerY;
    mouse.pos = {x: x, y: y};
}
document.addEventListener("keydown", (e)=>{
    if (e.key == "s") {
        step = true;
    }
    if (e.key == " ") {
        pause = !pause;
    }
})

//#endregion

let pause = true;
let step = true;
const main_loop = setInterval(() => {
    if (step) {
        main_func();
        step = false;
        return;
    }
    if (pause) return;
    main_func();
}, 1000/10);
