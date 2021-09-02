//#region Functions

const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    draw_circ2(mouse.pos, 5, "blue");
    if (controller.a) 
        player.transform.add_force(-1, 0);
    if (controller.d) 
        player.transform.add_force(1, 0);
    if (controller.w && player.grounded) {
        player.transform.add_force(0, -20);
        player.grounded = false;
    }
    if (player.grounded)
        player.transform.step_force(true, true);    
    else
        player.transform.step_force(false, true);

    const pos = {
        x: player.transform.x,
        y: player.transform.y,
    }
    if (pos.x < 0) {
        player.transform.x = 0;
        player.transform.add_force(-1*player.transform.vx, 0);
    }
    if (pos.y < 0) {
        player.transform.y = 0;
        player.transform.add_force(0, -1*player.transform.vy);
    }
    if (pos.x+player.width > canvas.width) {
        player.transform.x = canvas.width-player.width;
        player.transform.add_force(-1*player.transform.vx, 0);
    }
    if (pos.y+player.height > canvas.height) {
        player.transform.y = canvas.height-player.height;
        player.transform.add_force(0, -1*player.transform.vy);
        player.grounded = true;
    }
    if (pos.y+player.height < canvas.height-10) {
        player.grounded = false;
    }

    ctx.strokeRect(pos.x, pos.y, player.width, player.height);

    if (!mouse.down) return;

    const angle = get_angle(player.transform, mouse.pos);
    const dist = distance2(player.transform, mouse.pos);

    const ax = player.transform.x + Math.cos(angle)*dist;
    const ay = player.transform.y + Math.sin(angle)*dist;

    const line_origin = {
        x: player.transform.x + player.width/2,
        y: player.transform.y + player.height/2,
    }

    draw_line2(line_origin, {x: ax, y: ay});

    draw_circ(ax, ay, 5, "black");
    

    player.transform.add_force(Math.cos(angle)*3, Math.sin(angle)*3);

}
//#endregion

//#region Constants / Variables


const player = {
    transform: new Transform(100, 100, 0, 0, 1, 0.9),
    width: 20,
    height: 40,
    grounded: false,
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
    console.log(e);
}
canvas.onmousemove = function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    
    mouse.pos = {x: x, y: y};
}
document.addEventListener("keydown", (e)=>{
    switch (e.key) {
        case " ":
            pause = !pause;
            break;
        case "w":
            controller.w = true;
            break;
        case "a":
            controller.a = true;
            break;
        case "s":
            controller.s = true;
            break;
        case "d":
            controller.d = true;
            break;
        default:
            break;
    }
});
document.addEventListener("keyup", (e)=>{
    switch (e.key) {
        case "w":
            controller.w = false;
            break;
        case "a":
            controller.a = false;
            break;
        case "s":
            controller.s = false;
            break;
        case "d":
            controller.d = false;
            break;
        default:
            break;
    }
});

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