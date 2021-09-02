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

const player = {
    pos: {
        x: canvas.width/2,
        y: canvas.height/2,
    },
    vect: {
        x: 0,
        y: 0
    }
}

ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 150, 100);

// canvas.onmouseenter = e => 
// canvas.onmouseleave = e => 

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
document.addEventListener("keyup", (e)=>{
    
})

const new_circ = (x, y, radius, color)=>{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const move_to_mouse=()=>{
        const mx = mouse.pos.x;
        const my = mouse.pos.y;

        const x_diff = mx - player.pos.x;
        const y_diff = my - player.pos.y;
        const angle = Math.atan2(y_diff, x_diff);

        const x = Math.cos(angle);
        const y = Math.sin(angle);

        player.vect.x += x;
        player.vect.y += y;
    }
    if (mouse.down)
        move_to_mouse();

    player.pos.x += player.vect.x;
    player.pos.y += player.vect.y;

    player.vect.x *= 0.95;
    player.vect.y *= 0.95;

    new_circ(player.pos.x, player.pos.y, 10, "red");
}

setInterval(() => {
    if (mouse.pos.x == null || mouse.pos.y == null) return;
    main_func();

}, 1000/30);