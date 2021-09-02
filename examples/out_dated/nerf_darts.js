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

const new_circ = (x, y, radius, color)=>{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
const new_line = (x1, y1, x2, y2, color="black", width=1)=>{
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    if (line_holder.start.x != null && line_holder.end.x != null) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.moveTo(line_holder.start.x, line_holder.start.y);
        ctx.lineTo(line_holder.end.x, line_holder.end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red"
        ctx.moveTo(line_holder.start.x, line_holder.start.y);
        ctx.lineTo(line_holder.start.x + Math.cos(line_holder.angle)*arrow.size, line_holder.start.y + Math.sin(line_holder.angle)*arrow.size);
        ctx.stroke();
    }

    for (let i = 0; i < arrows.length; i++) {
        const a = arrows[i];
        if (a.hit) {
            new_line(
                a.pos.x, a.pos.y,
                a.pos.x + (-1*Math.cos(a.angle))*arrow.size, a.pos.y + (-1*Math.sin(a.angle))*arrow.size,
                "red", 5
            );
            continue;
        }
        a.vect.x *= arrow.drag;
        a.vect.y *= arrow.drag;
        a.vect.y += arrow.gravity;
        a.pos.x += a.vect.x;
        a.pos.y += a.vect.y;
        a.angle = Math.atan2(a.vect.y, a.vect.x);

        if (a.pos.x < 0) {
            a.pos.x = 0;
            a.hit = true;
        }
        if (a.pos.y < 0) {
            a.pos.y = 0;
            a.hit = true;
        }
        if (a.pos.x > canvas.width) {
            a.pos.x = canvas.width;
            a.hit = true;
        }
        if (a.pos.y > canvas.height) {
            a.pos.y = canvas.height;
            a.hit = true;
        }
        
        const dx = a.pos.x - canvas.width/2;
        const dy = a.pos.y - canvas.height/2;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= 50) {
            a.hit = true;
        }

        new_line(
            a.pos.x, a.pos.y,
            a.pos.x + (-1*Math.cos(a.angle))*arrow.size, a.pos.y + (-1*Math.sin(a.angle))*arrow.size,
            "red", 5
        );
    }

    new_circ(canvas.width/2, canvas.height/2, 50, "blue")
}
const new_arrow = (x, y, vx, vy, a)=>{
    return {
        pos: {
            x: x,
            y: y,
        },
        vect: {
            x: vx,
            y: vy,
        },
        angle: a,
        hit: false,
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
const line_holder = {
    start: {
        x: null,
        y: null,
    },
    end: {
        x: null, 
        y: null,
    },
    angle: null,
}
let arrows = [];
const arrow = {
    color: "red",
    size: 50,
    drag: 0.99,
    force_mult: 0.2,
    gravity: 1,
}

ctx.fillStyle = 'aqua';
// ctx.fillRect(10, 10, 150, 100);

//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    const x = e.layerX;
    const y = e.layerY;
    line_holder.start.x = x;
    line_holder.start.y = y;
    line_holder.end.x = null;
    line_holder.end.y = null;
}
canvas.onmouseup = (e) => {
    mouse.down = false;
    // const mx = e.layerX;
    // const my = e.layerY;

    // const ax = Math.cos(line_holder.angle)*arrow.size + line_holder.start.x;
    // const ay = Math.sin(line_holder.angle)*arrow.size + line_holder.start.y;

    // const x_diff = line_holder.start.x - line_holder.end.x;
    // const y_diff = line_holder.start.y - line_holder.end.y;

    // // const dist = Math.sqrt(x_diff*x_diff + y_diff*y_diff);

    // arrows.push( new_arrow(ax, ay, x_diff*arrow.force_mult, y_diff*arrow.force_mult, line_holder.angle) );

    // line_holder.start = {x: null, y: null};
    // line_holder.end = {x: null, y: null};
}
canvas.onmousemove = function(e) {
    const x = e.layerX;
    const y = e.layerY;
    mouse.pos = {x: x, y: y};
    if (mouse.down) {
        line_holder.end.x = e.layerX;
        line_holder.end.y = e.layerY;

        const x1 = line_holder.start.x;
        const y1 = line_holder.start.y;

        const x2 = line_holder.end.x;
        const y2 = line_holder.end.y;

        const x_diff = x2 - x1;
        const y_diff = y2 - y1;
        const angle = Math.atan2(y_diff, x_diff);
        line_holder.angle = angle;

        const x = Math.cos(angle);
        const y = Math.sin(angle);
    }
}
document.addEventListener("keydown", (e)=>{
    if (e.key == " ") {
        const ax = Math.cos(line_holder.angle)*arrow.size + line_holder.start.x;
        const ay = Math.sin(line_holder.angle)*arrow.size + line_holder.start.y;
    
        const x_diff = line_holder.start.x - line_holder.end.x;
        const y_diff = line_holder.start.y - line_holder.end.y;
    
        // const dist = Math.sqrt(x_diff*x_diff + y_diff*y_diff);
    
        arrows.push( new_arrow(ax, ay, x_diff*arrow.force_mult, y_diff*arrow.force_mult, line_holder.angle) );
    
        // line_holder.start = {x: null, y: null};
        // line_holder.end = {x: null, y: null};
    }
})

//#endregion

let pause = false;
const main_loop = setInterval(() => {
    if (pause) return;
    main_func();
}, 1000/60);
