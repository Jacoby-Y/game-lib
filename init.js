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