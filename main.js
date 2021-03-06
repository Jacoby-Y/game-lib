//#region Functions
const main_func = ()=>{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);

    run_update_functions();
    update_entities();
    event_manager.step_jobs();
}
//#endregion

const player = new Entity()
    .bind(new Vector2(canvas.width/2, canvas.height/2))
    .bind(new Transform(0, 1,1))
    .bind(new Graphic((self)=>{
        ctx.fillRect(-25,-25, 50,50);
    }))
    .bind({
        update(self) {
            self.transform.rotation = get_angle(self.vector, mouse.pos);
            self.graphic.draw(self);
        }
    })

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

let pause = true;
let step = true;
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