const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const size = window.innerHeight-4;

//#region Functions
(function(){
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    const scale = window.devicePixelRatio; 
    canvas.width = Math.floor(size * scale);
    canvas.height = Math.floor(size * scale);
    ctx.scale(scale, scale);
})()
const new_part = (px, py, vx, vy)=>{
    return {
        pos: {
            x: px,
            y: py
        },
        vect: {
            x: vx,
            y: vy
        }
    }
}
const new_circ = (x, y, radius, color)=>{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let touched = [];
        for (let j = 0; j < particles.length; j++) {
            if (i == j) continue;
            const p2 = particles[j];
            const x_diff = p2.pos.x - p.pos.x;
            const y_diff = p2.pos.y - p.pos.y;
            const dist = Math.sqrt(x_diff*x_diff + y_diff*y_diff);
            if (dist > repel_dist) {
                if (dist < repel_dist+100) {
                    touched.push(p2.pos);
                }
                continue;
            }
            // close_index++;
            const angle = Math.atan2(y_diff, x_diff);

            const x = Math.cos(angle) * repel_force;
            const y = Math.sin(angle) * repel_force;
            
            p.vect.x -= x;
            p.vect.y -= y;
        }
        //  + ((Math.round(Math.random()*100)%3)-1)
        p.pos.x += p.vect.x;
        p.pos.y += gravity + p.vect.y;
        
        // Touching bottom
        if (p.pos.y + 5 > canvas.height) {
            p.pos.y = canvas.height-5;
            p.vect.y -= 1;
        }
        // Touching left wall
        if (p.pos.x < 5) {
            p.pos.x = 5
            p.vect.x += 1;
        }
        // Touching right wall
        else if (p.pos.x > canvas.width-5) {
            p.pos.x = canvas.width-5;
            p.vect.x -= 1;
        }
            
        p.vect.x *= drag;
        p.vect.y *= drag;

        new_circ(p.pos.x, p.pos.y, 10, "blue");
    }
}
//#endregion

//#region Constants / Variables
const mouse = {
    down: false,
    pos: {
        x: null,
        y: null,
    }
}
let particles = [];
const gravity = 10;
const drag = 0.95;
const repel_force = 1;
const repel_dist = 50;

ctx.fillStyle = 'aqua';
// ctx.fillRect(10, 10, 150, 100);

//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    const x = e.layerX;
    const y = e.layerY;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const x_diff = x - p.pos.x;
        const y_diff = y - p.pos.y;
        const dist = Math.sqrt(x_diff*x_diff + y_diff*y_diff);
        if (dist < 40) {
            p.vect.y -= 10;
        }
    }
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
    if (e.key == "n") {
        particles.push(new_part(mouse.pos.x, mouse.pos.y, 0, 0));
    }
    if (e.key == " ") {
        pause = !pause;
    }
})

//#endregion
let pause = false;
const main_loop = setInterval(() => {
    if (pause) return;
    // if (mouse.pos.x == null || mouse.pos.y == null) return;
    main_func();
}, 1000/60);
