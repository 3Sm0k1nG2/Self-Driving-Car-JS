import Car from "./car.js";
import { CONTROL_TYPE_AI, CONTROL_TYPE_DUMMY, CONTROL_TYPE_KEYS } from "./consts.js";
import Road from "./road.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.height = window.innerHeight;
canvas.width = 200;

const context = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9, 4);
const car = new Car(road.getLaneCenterByIndex(Math.floor(road.laneCount/2)), 100, 30, 50, CONTROL_TYPE_AI);
const traffic = [
    new Car(road.getLaneCenterByIndex(Math.floor(road.laneCount/2)), -100, 30, 50, CONTROL_TYPE_DUMMY, 1)
];

updateTick();

function animate(){
    canvas.height = window.innerHeight;

    context.reset();

    context.save();
    context.translate(0, -car.y + canvas.height*0.7);

    road.draw(context);
    traffic.forEach(v => v.draw(context, 'red'));
    car.draw(context, 'blue');

    context.restore();
}

function updateTick() {
    car.update([...road.borders, ...traffic.map(v => v.polygon.borders).reduce((prev, curr) => [...prev, ...curr])]);
    traffic.forEach(v => v.update([...road.borders]));

    animate();

    requestAnimationFrame(updateTick);
}
