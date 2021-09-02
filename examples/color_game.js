//#region Functions

const draw_bars = ()=>{
    ctx.fillStyle = "lime";
    ctx.fillRect(20, 20, tower.health/100*150, 30);
    ctx.strokeStyle = "black";
    ctx.strokeRect(20, 20, 150, 30);

    ctx.fillStyle = "aqua";
    ctx.fillRect(190, 20, tower.energy/100*150, 30);
    ctx.strokeStyle = "black";
    ctx.strokeRect(190, 20, 150, 30);
}
const draw_tower = ()=>{
    draw_circ2(tower.pos, 20, tower.color);
    draw_circ2(tower.pos, 20, "black", false);
}
const update_enemies = ()=>{
    const new_enemies = [];
    for (let i = 0; i < enemy_manager.enemies.length; i++) {
        const en = enemy_manager.enemies[i];
        const dist = distance2(en.transform, tower.pos);
        if (dist <= 40) {
            en.destroy = true;
            tower.hit(en.color);
        }
        if (!en.destroy) {
            new_enemies.push(en);
            en.transform.step_force();
            draw_circ2(en.transform, 20, en.color);
        } else {
            tower.energy++;
            if (tower.energy >= 100) tower.energy = 100;
        }
    }
    enemy_manager.enemies = new_enemies;
}
const update_bullets = ()=>{
    const new_bullets = [];
    for (let i = 0; i < tower.bullets.length; i++) {
        const b = tower.bullets[i];
        b.transform.step_force(false, false);
        draw_circ2(b.transform, 5, "black");
        const closest = closest_in_list(b.transform, enemy_manager.enemies);
        if (closest.dist <= 20) {
            closest.obj.destroy = true;
            b.destroy = true;
        }
        if (distance2(b.transform, tower.pos) > canvas.width)
            b.destroy = true;

        if (!b.destroy)
            new_bullets.push(b);
    }
    tower.bullets = new_bullets;
}
const main_func = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    if (tower.lost) {
        draw_text(canvas.width/2, canvas.height/2, `You lost with a score of ${tower.score}`);
        return;
    }


    update_bullets();
    update_enemies();
    draw_tower();
    draw_bars();
    draw_text(20, 90, `Score: ${tower.score}`, null, "black", "left");
    
    enemy_manager.step();
}
//#endregion

//#region Constants / Variables
const mouse = {
    down: false,
    pos: {
        x: 0,
        y: 0,
    }
}
const controller = {
    w: false,
    a: false,
    s: false,
    d: false,
}
const colors = {
    0: "red",
    1: "blue",
    2: "green",
    red: "red",
    blue: "blue",
    green: "green",
}
const tower = {
    pos: {
        x: canvas.width/2,
        y: canvas.height/2,
    },
    energy: 0,
    bullets: [],
    color: colors[Math.floor(random_range(0,3))],
    health: 100,
    score: 0,
    lost: false,
    hit(color) {
        if (color == this.color) {
            this.score++;
            this.color = colors[Math.floor(random_range(0,3))];
            this.energy += 20;
            if (this.energy >= 100) {
                this.energy = 100;
            }
        } else {
            this.health -= 10;
            this.color = colors[Math.floor(random_range(0,3))];
        }
        if (this.health <= 0) {
            this.lost = true;
        }
    }
}
const enemy_manager = {
    enemies: [],
    enemy_per_tick: 120,
    ticks: 0,
    min_dist: distance2(tower.pos, {x: 0, y: 0})+30,
    step() {
        this.ticks++;
        if (this.ticks >= this.enemy_per_tick) {
            this.new_enemy();
            this.ticks = 0;
            this.enemy_per_tick = Math.ceil(this.enemy_per_tick * .98);
        }
    },
    new_enemy() {
        const spawn_angle = random_range(0, Math.PI*2);
        const pos = {x: (Math.cos(spawn_angle)+1)*this.min_dist, y: (Math.sin(spawn_angle)+1)*this.min_dist};
        const angle = get_angle(pos, tower.pos);
        const rand_speed = random_range(1, 2);
        const new_en = {
            transform: new Transform(pos.x, pos.y, Math.cos(angle)*rand_speed, Math.sin(angle)*rand_speed, 0, 1),
            color: colors[Math.floor(random_range(0,3))],
            destroy: false,
        };
        this.enemies.push(new_en);

        draw_circ2(pos, 10, "purple");
    }
    
}
//#endregion

//#region Canvas Events
canvas.onmousedown = (e) => {
    mouse.down = true;
    const x = e.layerX;
    const y = e.layerY;

    const angle = get_angle(tower.pos, mouse.pos);

    const ax = Math.cos(angle)*8;
    const ay = Math.sin(angle)*8;

    tower.bullets.push({
        transform: new Transform(tower.pos.x, tower.pos.y, ax, ay, 0, 1)
    });
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
    switch (e.key) {
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
document.addEventListener("keypress", (e)=>{
    switch (e.key) {
        case "p":
            pause = !pause;
            break;
        case " ":
            if (tower.energy >= 100) {
                tower.energy = 0;
                for (let i = 0; i < 6.2; i+=0.1) {
                    const ax = Math.cos(i)*8;
                    const ay = Math.sin(i)*8;

                    tower.bullets.push({
                        transform: new Transform(tower.pos.x, tower.pos.y, ax, ay, 0, 1)
                    });
                }
            }
    }
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