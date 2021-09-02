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
const new_line2 = (pos1, pos2, color="black", width=1)=>{
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}
const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);

    // Need: Original ball point, next ball point, then the end of line pointing to that ball point    

    const ap = anchor.pos;

    for (let i = 0; i < balls.length; i++) {
        const b = balls[i];

        if (i>0) {
            b.pos = { x: balls[i-1].pos.x+balls[i-1].dist, y: balls[i-1].pos.y+10 };
            b.anchor = balls[i-1];
        }

        const bp = b.pos;
        const bv = b.vect;
        const a = b.anchor;
        const ap = b.anchor.pos;
        const next = { x: bp.x+ bv.x,  y: bp.y+ bv.y,  };
        let dx = next.x - ap.x;
        let dy = next.y - ap.y;
        
        let angle = Math.atan2(dy, dx);

        const clamp = { x: ap.x+ Math.cos(angle)* a.dist, y: ap.y+ Math.sin(angle)* a.dist };
        new_line2(anchor, clamp, "blue", 3);

        dx = clamp.x - bp.x;
        dy = clamp.y - bp.y;

        let dist = Math.sqrt(dx*dx + dy*dy);

        angle = Math.atan2(dy, dx);

        b.vect.x = Math.cos(angle)*dist;
        b.vect.y = Math.sin(angle)*dist + gravity;

        b.vect.x += a.vect.x;
        b.vect.y += a.vect.y;

        b.vect.x *= drag;
        b.vect.y *= drag;

        b.pos.x += b.vect.x;
        b.pos.y += b.vect.y;
        new_circ(b.pos.x, b.pos.y, 10, "green");
        new_line2(bp, ap, "black", 2);
    }
    new_circ(anchor.pos.x, anchor.pos.y, 10, "red");
    // new_line(anchor.x, anchor.y, ball.pos.x, ball.pos.y);
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
const anchor = {
    pos: {
        x: canvas.width/2,
        y: canvas.height/4,
    },
    vect: {
        x: 0,
        y: 0,
    },
    dist: 100
}
const balls = [
    {
        anchor: anchor,
        pos: {
            x: anchor.pos.x+100,
            y: anchor.pos.y+10,
        },
        vect: {
            x: 0,
            y: 1
        },
        dist: 100,
    },
    {
        anchor: null,
        pos: {
            x: null,
            y: null,
        },
        vect: {
            x: 0,
            y: 1
        },
        dist: 100,
    }
]

const gravity = 0.1;
const drag = 1.0024;

ctx.fillStyle = 'aqua';
// ctx.fillRect(10, 10, 150, 100);

//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    
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
    
})

//#endregion

let pause = false;
const main_loop = setInterval(() => {
    if (pause) return;
    main_func();
}, 1000/60);
