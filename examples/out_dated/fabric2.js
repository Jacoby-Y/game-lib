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

const new_connection = (x,y, vx,vy, conn)=>{
    return {
        pos: {
            x: x,
            y: y,
        }, 
        vect: {
            x: vx,
            y: vy,
        },
        conn: conn
    }
}

const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    const connect = (obj1, obj2)=>{
        const rest_a = get_angle(obj1.pos, obj2.pos);

        const rest = { x: obj1.pos.x + Math.cos(rest_a)*conn_dist, y: obj1.pos.y + Math.sin(rest_a)*conn_dist };
        
        draw_line2(obj1.pos, obj2.pos);
    
        const to_rest_a = get_angle(obj2.pos, rest);
        const to_rest_d = distance2(obj2.pos, rest);
        
        const to_rest = { x: obj2.pos.x + Math.cos(to_rest_a)*to_rest_d, y: obj2.pos.y + Math.sin(to_rest_a)*to_rest_d };
    
        // draw_circ2(to_rest, 3, "purple");
    
        const obj_dist = distance2(obj2.pos, obj1.pos);
        if (obj_dist > conn_dist) {
            obj2.vect.x += ((obj_dist/100)*Math.cos(to_rest_a)/2);
            obj2.vect.y += ((obj_dist/100)*Math.sin(to_rest_a)/2);
            draw_line2(obj2.pos, to_rest, "blue", 2);
        }
        obj2.vect.y += gravity;
    
        obj2.pos.x += obj2.vect.x;
        obj2.pos.y += obj2.vect.y;
    
        obj2.vect.y *= drag;
        obj2.vect.x *= drag;
    
        // draw_line(obj2.pos.x, obj2.pos.y, obj2.pos.x+ obj2.vect.x*10, obj2.pos.y+ obj2.vect.y*10, "green", 4);
    }

    for (let i = 0; i < conns.length; i++) {
        const conn = conns[i];
        for (let j = 0; j < conn.conn.length; j++) {
            const conn2 = conn.conn[j];
            if (typeof conn2 == "number")
                connect(conns[conn2], conn);
            else 
                connect(conn2, conn);
            draw_circ2(conn.pos, 10, "red");
        }
    }

    draw_circ2(anchor.pos, 10, "maroon");
    draw_circ2(anchor2.pos, 10, "maroon");
    // draw_circ2(point.pos, 10, "red");
    // draw_circ2(follow.pos, 10, "red");

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
const gravity = 0.4;
const drag = 0.98;
const conn_dist = 100;

const anchor = {
    pos: {
        x: canvas.width/2-100,
        y: 100
    }
}
const anchor2 = {
    pos: {
        x: canvas.width/2+100,
        y: 100
    }
}
const point = {
    pos: {
        x: 400,
        y: 100,
    },
    vect: {
        x: 0,
        y: 0
    }
}
const follow = {
    pos: {
        x: 500,
        y: 100,
    },
    vect: {
        x: 0,
        y: 0
    }
}
const conns = [
    new_connection(canvas.width/2-100, 100, 0,0, [anchor]),
    new_connection(canvas.width/2-200, 200, 0,0, [0]),
    new_connection(canvas.width/2-300, 300, 0,0, [1]),
]

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

    if (mouse.down) {
        anchor.pos = mouse.pos;
    }
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
    if (step) {
        main_func();
        step = false;
        return;
    }
    if (pause) return;
    main_func();
}, 1000/60);
