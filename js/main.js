import Car from "./views/car/car.js";
import { CONTROL_TYPE_AI, CONTROL_TYPE_DUMMY, CONTROL_TYPE_KEYS } from "./views/car/consts.js";
import Road from "./views/car/road.js";
import Visualizer from "./views/network/visualizer.js";

/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

/** @type {HTMLCanvasElement} */
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9, 4);
const car = new Car(road.getLaneCenterByIndex(Math.floor(road.laneCount/2)), 100, 30, 50, CONTROL_TYPE_AI);
const traffic = [
    new Car(road.getLaneCenterByIndex(Math.floor(road.laneCount/2)), -100, 30, 50, CONTROL_TYPE_DUMMY, 1)
];

const visualizer = new Visualizer();

updateTick();

/** @param {DOMHighResTimeStamp} time */
function animate(time){
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.reset();

    carContext.save();
    carContext.translate(0, -car.y + carCanvas.height*0.7);

    road.draw(carContext);
    traffic.forEach(v => v.draw(carContext, 'red'));
    car.draw(carContext, 'blue');

    carContext.restore();

    networkContext.lineDashOffset = -time*0.01;
    visualizer.drawNetwork(networkContext, car.brain);
}

/** @param {DOMHighResTimeStamp} time */
function updateTick(time) {
    car.update([...road.borders, ...traffic.map(v => v.polygon.borders).reduce((prev, curr) => [...prev, ...curr])]);
    traffic.forEach(v => v.update([...road.borders]));

    animate(time);

    requestAnimationFrame(updateTick);
}
