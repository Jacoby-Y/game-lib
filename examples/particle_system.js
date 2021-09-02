//#region Functions

const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if (mouse.on_canvas) {
        for (let i = 0; i < em.parts.length; i++) {
            const p = em.parts[i];
            const angle = get_angle({x: p.pos.x, y: p.pos.y}, mouse.pos);
            const dist = distance2({x: p.pos.x, y: p.pos.y}, mouse.pos);
            p.vect.x += Math.cos(angle)*100/dist;
            p.vect.y += Math.sin(angle)*100/dist;

            if (dist <= 30) {
                p.destroy = true;
            }
        }
    }
    em.step();

    draw_text(20, 50, `Points: ${points}`, null, "green", "left");
}
//#endregion

//#region Constants / Variables


let points = 0;

ctx.fillStyle = "green";

const em = new Emitter();
em.tpe = 2;
em.speed_range = [15,20];
em.origin = new Vector2(canvas.width/2, canvas.height/2);
em.drag = 0.95;
em.direction = 1;
em.arc_range = [0, 6];
em.life_span = 600;
em.on_destroy = ()=>{points++};
em.vect_range = [
    new Vector2(-25,-25),
    new Vector2(25,25),
]
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
    const x = e.offsetX;
    const y = e.offsetY;
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