const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const canv_w = canvas.width;
const canv_h = canvas.height;

ctx.save();
// ctx.restore();

const ratio = (window.innerHeight-4)/3;

canvas.style.width = ratio*4 + "px";
canvas.style.height = ratio*3 + "px";
canvas.width = Math.floor(ratio*4);
canvas.height = Math.floor(ratio*3);
ctx.scale(1+(1/3), 1);

const cw = canvas.width;
const ch = canvas.height;

const mouse = {
    down: false,
    on_canvas: false,
    pos: {
        x: 0,
        y: 0,
    }
}
const camera = {
    pos: {x: 0, y: 0},
    translate(x,y) {
        this.pos.x += x;
        this.pos.y += y;
    }
}
const controller = {
    w: false,
    a: false,
    s: false,
    d: false,
    angle() {
        let x = 0;
        let y = 0;
        x += (this.a)? -1 : 0;
        x += (this.d)? 1 : 0;
        y += (this.w)? -1 : 0;
        y += (this.s)? 1 : 0;

        if (x != 0 || y != 0) {
            return Math.atan2(y, x);
        } else {
            return null;
        }
    }
}
const assets = {
    example: "https://via.placeholder.com/350x150"
}
document.onmousemove = (e)=>{
    if (e.target == canvas) {
        mouse.pos.x = e.offsetX;
        mouse.pos.y = e.offsetY;
        mouse.on_canvas = true;
    } else {
        mouse.on_canvas = false;
    }
}
let entities = [];

const event_manager = {
    jobs: [],
    step_jobs() {
        const new_jobs = [];
        for (let i = 0; i < this.jobs.length; i++) {
            const job = this.jobs[i];
            if (job.ticks <= 0) {
                job.run_job();
            } else {
                job.ticks -= 1;
                new_jobs.push(job);
            }
        }
        this.jobs = new_jobs;
    }
}

const update = [];