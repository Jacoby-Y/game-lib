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

const new_point = (x, y, connections, anchored=false)=>{
    return {
        pos: {
            x: x,
            y: y,
        },
        vect: {
            x: 0,
            y: 0,
        },
        conns: connections,
        anchored: anchored,
        resting: false,
    }
}

const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.anchored) {
            new_circ(p.pos.x, p.pos.y, 10, "maroon");
            continue;
        }
        for (let j = 0; j < p.conns.length; j++) {
            const conn = points[p.conns[j]];

            const angle1 = get_angle(conn.pos, p.pos);

            const clamp = { x: conn.pos.x+ Math.cos(angle1)*conn_dist, y: conn.pos.y+ Math.sin(angle1)*conn_dist };
            new_circ(clamp.x, clamp.y, 4, "red");
            // angle = get_angle(p.pos, clamp);

            const angle2 = get_angle(p.pos, clamp);

            // if (distance2(p.pos, clamp) < 10) continue;

            if (!p.resting) {
                p.vect.x += Math.cos(angle2);
                p.vect.y += Math.sin(angle2);
                p.vect.y += gravity;
            }

            p.vect.x *= drag;
            p.vect.y *= drag;

            new_line(p.pos.x, p.pos.y, p.pos.x+p.vect.x*3, p.pos.y+p.vect.y*3, "red", 5);

            p.pos.x += p.vect.x;
            p.pos.y += p.vect.y;

            if (distance2(p.pos, clamp) < 5) {
                p.vect.x *= 0.9;
                p.vect.y *= 0.9;
                if (p.vect.x < 0.1 && p.vect.x > -0.1 && p.vect.y < 0.1 && p.vect.y > -0.1) {
                    p.resting = true;
                }
            }
            new_circ(p.pos.x, p.pos.y, 10, "black");
            new_line2(p.pos, conn.pos);
        }
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
const points = [
    new_point(100, 100, [], true), // 0
    new_point(500, 100, [], true), // 1

    new_point(200, 200, [0], false), // 2
    new_point(300, 200, [2, 4, 11], false), // 3
    new_point(400, 200, [1], false), // 4

    new_point(200, 300, [2], false), // 5
    new_point(300, 300, [3, 5, 7], false), // 6
    new_point(400, 300, [6, 4], false), // 7

    new_point(200, 400, [5], false), // 8
    new_point(300, 400, [8, 6, 10], false), // 9
    new_point(400, 400, [9, 7], false), // 10

    new_point(300, 100, [], true), // 11
];
const gravity = 0.2;
const drag = 0.95;
const conn_dist = 100;

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
    if (e.key == " ") {
        step = true;
    }
})

//#endregion

let pause = false;
let step = false;
const main_loop = setInterval(() => {
    if (step) {
        main_func();
        step = false;
        return;
    }
    if (pause) return;
    main_func();
}, 1000/60);
