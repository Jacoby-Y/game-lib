const draw_circ = (x, y, radius, color, fill=true)=>{
    if (fill) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke(); 
    }
}
const draw_circ2 = (pos, radius, color, fill=true)=>{
    if (fill) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(pos.x, pos.x, radius, 0, 2 * Math.PI);
        ctx.stroke(); 
    }
}
const draw_line = (x1, y1, x2, y2, color="black", width=1)=>{
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
const draw_line2 = (pos1, pos2, color="black", width=1)=>{
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.stroke();
}
const distance = (x1, y1, x2, y2)=>{
    const dx = x2-x1;
    const dy = y2-y1;
    return Math.sqrt(dx*dx + dy*dy);
}
const distance2 = (p1, p2)=>{
    const dx = p2.x-p1.x;
    const dy = p2.y-p1.y;
    return Math.sqrt(dx*dx + dy*dy);
}
const difference = (p1, p2)=>{
    const dx = p2.x-p1.x;
    const dy = p2.y-p1.y;
    return {
        x: dx,
        y: dy
    }
}
const get_angle = (p1, p2)=>{
    const d = difference(p1, p2);
    return Math.atan2(d.y, d.x);
}
const run_shader = (func, divisor)=>{
    const data = {};
    for (let py = 0; py < canvas.height/divisor; py++) {
        for (let px = 0; px < canvas.width/divisor; px++) {
            const x = px * divisor;
            const y = py * divisor;
            func(x,y, divisor, data);
        }
    }
}
const random_range = (min, max)=>{
    return Math.random() * (max - min) + min;
}
const draw_text = (x,y, text, font="30px arial", style="black", align="center")=>{
    if (font == null)
        font = "30px arial";
    ctx.fillStyle = style;
    ctx.textAlign = align;
    ctx.font = font;
    ctx.fillText(text, x,y);
}
const closest_in_list = (point, list)=>{
    let closest = Infinity;
    let closest_obj = {};
    for (let i = 0; i < list.length; i++) {
        let l = list[i];
        if (l.transform != undefined) {
            l = l.transform;
        } else if (l.pos != undefined) {
            l = l.pos;
        }
        const dist = distance2(point, l);
        if (dist < closest) {
            closest = dist;
            closest_obj = list[i];
        }
    }
    return { dist: closest, obj: closest_obj};
}
const controller_keydown = (key)=>{
    switch (key) {
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
}
const controller_keyup = (key)=>{
    switch (key) {
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
}
const get_entity_with_id = (id)=>{
    for (let i = 0; i < entities.length; i++) {
        const e = entities[i];
        if (e.id == id) {
            return e;
        }
    }
    return null;
}
const update_entities = ()=>{
    for (let i = 0; i < entities.length; i++) {
        const e = entities[i];
        if (typeof e.update == "function")
            e.update(e);
    }
}
class Emitter {
    constructor(tpe=30, direction=1, arc_range=[0,1], origin=new Vector2(100,100), vect_range=[new Vector2(-1,-1), new Vector2(1,1)], speed_range=[1,2], life_span=60, drag=1, on_destroy=()=>{}) {
        /** Array of particles in this emitter ~~
         * Particle[]
        */
        this.parts = [];

        /** Emitter lifespan in ticks ~~
         * int
        */
        this.ticks = 0;

        /** Ticks Per Second ~~
         * int
        */
         this.tpe = tpe;

        /** General direction of particle's movement ~~ 
         * Radian
        */
        this.direction = direction;

        /** Range of directions for particles ~~ 
         * (Radian, Radian)
        */
        this.arc_range = arc_range;

        /** origin of emitter ~~ 
         * Vector2
        */
        this.origin = origin;

        /** Range area from origin ~~ 
         * (Vector2, Vector2)
        */
        this.vect_range = vect_range;

        /** Range of speed for particles ~~ 
         * (int, int)
        */
        this.speed_range = speed_range;

        /** How long the particle with live in ticks ~~ 
         * int
        */
        this.life_span = life_span;

        /** How much the particle speed will drag ~~
         * float
        */
        this.drag = drag;

        this.on_destroy = on_destroy;
    }
    step() {
        this.ticks++;

        if (this.ticks % this.tpe == 0) {
            this.emit();
        }
        const new_parts = [];
        for (let i = 0; i < this.parts.length; i++) {
            const part = this.parts[i];
            part.step();
            if (part.ticks < this.life_span && !part.destroy)
                new_parts.push(part);
            else {
                part.on_destroy();
            }
                
        }
        this.parts = new_parts;
    }
    emit() {
        const pos = {
            x: this.origin.x + random_range(this.vect_range[0].x, this.vect_range[1].x), 
            y: this.origin.y + random_range(this.vect_range[0].y, this.vect_range[1].y)
        };
        const vect = {
            x: Math.cos(this.direction+random_range(this.arc_range[0], this.arc_range[1])) * random_range(this.speed_range[0], this.speed_range[1]),
            y: Math.sin(this.direction+random_range(this.arc_range[0], this.arc_range[1])) * random_range(this.speed_range[0], this.speed_range[1])
        }
        const part = new Particle(pos, vect, this.drag);
        part.on_destroy = this.on_destroy;
        this.parts.push(part);
    }
}
class Particle {
    constructor(pos, vect, drag) {
        this.pos = pos;
        this.vect = vect;
        this.drag = drag;
        this.ticks = 0;
        this.destroy = false;
        this.on_destroy = ()=>{};
    }
    step() {
        this.move();
        this.draw();
        this.ticks++;
    }
    move() {
        this.pos.x += this.vect.x;
        this.pos.y += this.vect.y;
        this.vect.x *= this.drag;
        this.vect.y *= this.drag;
    }
    draw() {
        draw_circ2(this.pos, 10, ctx.fillStyle);
    }
}

//> Components
class Entity {
    constructor() {
        entities.push(this);
    }
    bind(obj) {
        if (obj.$ != undefined && typeof obj.$ == "function") {
            const prop = obj.$();
            if (prop == "graphic") {
                obj.vector = this.vector;
                obj.transform = this.transform;
            }
            this[prop] = obj;
        } else if (typeof obj == "object") {
            Object.assign(this, obj);
        }
        
        return this;
    }
}

class Vector2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    get_dir() {
        return Math.atan2(x,y);
    }
    move_to(pos, step) {
        const angle = get_angle(this, pos);
        this.x += Math.cos(angle)*step;
        this.y += Math.sin(angle)*step;
    }
    move_with_angle(len, angle) {
        if (angle == null) return;
        this.x += Math.cos(angle)*len;
        this.y += Math.sin(angle)*len;
    }
    translate(x,y) {
        this.x += x;
        this.y += y;
    }
    $(){ return "vector" }
}
class Transform {
    constructor(rotation, scale_x, scale_y) {
        this.rotation = rotation;
        this.scale_x = scale_x;
        this.scale_y = scale_y;
    }
    rotate(angle) {
        this.rotation += angle;
    }
    scale(x,y) {
        this.scale_x += x;
        this.scale_y += y;
    }
    $(){ return "transform" }
}
class Physics {
    constructor(vx=0, vy=0, gravity=1, drag=0.95, vector=null) {
        this.vx = vx;
        this.vy = vy;
        this.gravity = gravity;
        this.drag = drag;
        this.vector = vector;
    }
    add_force(x,y) {
        this.vx += x;
        this.vy += y;
        return this;
    }
    step(do_drag=false, do_gravity=true) {
        if (this.vector == null) return;
        this.vector.x += this.vx;
        this.vector.y += this.vy;
        if (do_gravity) this.vy += this.gravity;
        if (do_drag) {
            this.vx *= this.drag;
            this.vy *= this.drag;
        }
        return this;
    }
    $(){ return "physics" }
}
class Graphic {
    constructor(on_draw=(vect, transform)=>{}) {
        this.vector = null;
        this.transform = null;
        this.on_draw = on_draw;
    }
    draw(){
        if (this.vector == null || this.transform == null) return;
        ctx.setTransform(1, 0, 0, 1, this.vector.x, this.vector.y);
        ctx.rotate(this.transform.rotation);
        this.on_draw(this.vector, this.transform);
    }
    $(){ return "graphic" }
}
class BoxCollider {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.vector = null;
    }
    $() { return "box_collider"; }
}