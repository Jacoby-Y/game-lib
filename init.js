const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const canv_w = canvas.width;
const canv_h = canvas.height;

ctx.save();
// ctx.restore();

const size = window.innerHeight-4;

canvas.style.width = size + "px";
canvas.style.height = size + "px";
const scale = window.devicePixelRatio; 
canvas.width = Math.floor(size * scale);
canvas.height = Math.floor(size * scale);
ctx.scale(scale, scale);

const mouse = {
    down: false,
    on_canvas: false,
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
document.onmousemove = (e)=>{
    if (e.target == canvas) {
        mouse.pos.x = e.offsetX;
        mouse.pos.y = e.offsetY;
        mouse.on_canvas = true;
    } else {
        mouse.on_canvas = false;
    }
}
const entities = [];