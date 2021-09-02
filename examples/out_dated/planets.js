const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const size = window.innerHeight-4;

(function(){
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    const scale = window.devicePixelRatio; 
    canvas.width = Math.floor(size * scale);
    canvas.height = Math.floor(size * scale);
    ctx.scale(scale, scale);
})()

const mouse = {
    down: false,
    pos: {
        x: null,
        y: null,
    }
}

const attractors = [
    {
        pos: {
            x: canvas.width/2,
            y: canvas.height/2,
        },
        vect: {
            x: 0,
            y: 0
        },
        mass: 5000,
        size: 0,
        color: "red"
    },
    // {
    //     pos: {
    //         x: canvas.width/2,
    //         y: canvas.height/2,
    //     },
    //     vect: {
    //         x: 0,
    //         y: 0
    //     },
    //     mass: 10000,
    //     size: 20,
    //     color: "red"
    // },
    {
        pos: {
            x: canvas.width/4,
            y: canvas.height/2,
        },
        vect: {
            x: 0,
            y: 5
        },
        mass: 10,
        size: 10,
        color: "green"
    },
    {
        pos: {
            x: canvas.width/4*3,
            y: canvas.height/2,
        },
        vect: {
            x: 0,
            y: -5
        },
        mass: 10,
        size: 10,
        color: "green"
    }
]


ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 150, 100);

// canvas.onmouseenter = e => 
// canvas.onmouseleave = e => 

canvas.onmousedown = (e) => {
    const x = e.layerX;
    const y = e.layerY;
}
canvas.onmousemove = function(e) {
    const x = e.layerX;
    const y = e.layerY;
    mouse.pos = {x: x, y: y};
    attractors[0].pos = mouse.pos;
}
document.addEventListener("keyup", (e)=>{
    if (e.key == "ArrowDown") {
        attractors[0].mass += 100
        console.log(`New mass: ${attractors[0].mass}`);
    }
    if (e.key == "ArrowUp") {
        attractors[0].mass -= 100
        console.log(`New mass: ${attractors[0].mass}`);
    }
})

const new_circ = (x, y, radius, color)=>{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

const main_func = ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < attractors.length; i++) {
        const body1 = attractors[i];
        for (let j = 0; j < attractors.length; j++) {
            if (i == j) continue;
            const body2 = attractors[j];
            const x_diff = body2.pos.x-body1.pos.x;
            const y_diff = body2.pos.y-body1.pos.y;
            const dist = Math.sqrt(x_diff*x_diff + y_diff*y_diff);
            const angle = Math.atan2(y_diff, x_diff);
            const mult = body1.mass*body2.mass/(dist*dist);

            const x = Math.cos(angle) * mult;
            const y = Math.sin(angle) * mult;

            body1.vect.x += x/body1.mass;
            body1.vect.y += y/body1.mass;
            // if (i == 1) ctx.strokeText(`${Math.round(x)}, ${Math.round(y)}`, 10, 50);
        }
        body1.pos.x += body1.vect.x;
        body1.pos.y += body1.vect.y;

        new_circ(body1.pos.x, body1.pos.y, body1.size, body1.color);
        // ctx.strokeText(`${Math.round(x)}, ${Math.round(y)}`, 10, 50);
        // body1.path.lineTo(body1.pos.x, body1.pos.y);
        // ctx.strokeStyle = "grey";
        // ctx.stroke(body1.path);
    }
}

let tan_i = 0;

setInterval(() => {
    if (mouse.pos.x == null || mouse.pos.y == null) return;
    attractors[0].pos = mouse.pos;
    main_func();

}, 1000/30);