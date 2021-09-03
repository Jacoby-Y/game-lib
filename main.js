//#region Functions

function drawRotated(x, y, angle) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(angle-Math.PI/2);
    ctx.fillStyle = "green";
    ctx.fillRect(-25, -25, 50, 50);
    ctx.fillRect(-5, 0, 10, 50);
}
const main_func = ()=>{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    update_entities();
}
//#endregion

//#region Constants / Variables
// const player = new Entity({ 
//     vector: new Vector2(100, 100),
//     transform: new Transform(0, 1,1),
//     graphic: new Graphic(this, 
//     function (vect, trans) {
//         ctx.fillRect(vect.x, vect.x, 50, 50)
//     }),
//     update() {
//         this.graphic.draw();
//     }
// });

const player = new Entity()
    .bind(new Vector2(100, 100))
    .bind(new Transform(0, 1,1))
    .bind(new Graphic((vect, transform)=>{
        ctx.fillRect(-25, -25, 50, 50);
        ctx.fillRect(-15, 15, 80, 20);
    }))
    .bind({
        update(self) {
            self.graphic.draw();
            self.vector.move_with_angle(5, controller.angle());
            self.transform.rotation = get_angle(self.vector, mouse.pos);
        }
    });


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
}
document.addEventListener("keydown", (e)=>{
    controller_keydown(e.key);
    switch (e.key) {
        case "p":
            pause = !pause;
            break;
        case "o":
            pause = true;
            step = true;
            break;
        case " ":
    }
});
document.addEventListener("keyup", (e)=>{
    controller_keyup(e.key);
});
document.addEventListener("keypress", (e)=>{
    
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

