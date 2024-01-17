import Car from "./views/car/car.js";
import { CONTROL_TYPE_AI, CONTROL_TYPE_DUMMY, CONTROL_TYPE_KEYS } from "./views/car/consts.js";
import Road from "./views/car/road.js";
import Visualizer from "./views/network/visualizer.js";
import NeuralNetwork from "./ai/neural-network/network.js";
import OfflineStorage from "./offlineStorage.js";
import AIManager from "./AIManager.js";
import NeuralNetworkManager from "./ai/neural-network/neuralNetworkManager.js";
import TrafficGenerator from "./trafficGenerator.js";
import ColorGenerator from "./colorGenerator.js";

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

const aiManager = new AIManager(
    new NeuralNetworkManager(),
    new OfflineStorage(localStorage)
);
console.dir(aiManager);
const carN = 100;
const mutator = 0.25;

const road = new Road(
    carCanvas.width / 2,
    carCanvas.width * 0.9,
    5
);
const cars = generateCars(carN);

const traffic = new TrafficGenerator(
    road,
    cars[0].height,
    // new ColorGenerator()
).generateSequantically(
        [],
        [1, 2, 3],
        [0, 4],
        [1, 3],
        [0, 2, 4],
        [0, 1, 3, 4],
        [0, 4],
        [0, 2, 4],
        [1, 3],
        [0, 4],
        [1, 2, 3],
        [0, 4],
        [0, 1, 2/*, 3*/],
        [1, 2, 3, 4],
        [0, 4],
    );

const visualizer = new Visualizer();

let bestCar = cars[0];
if (aiManager.bestBrain) {
    aiManager.mutateCars(cars, mutator);
}

let previewAll = true;
let pause = false;
if(!localStorage.getItem('autoTrain')) {
    localStorage.setItem('autoTrain', false);
}
let autoTrain = localStorage.getItem('autoTrain') === "true";
init(aiManager);


updateTick();

/** @param {DOMHighResTimeStamp} time */
function updateTick(time) {
    if (!pause) {
        cars.forEach(car => car.update([...road.borders, ...traffic.map(v => v.polygon.borders).reduce((prev, curr) => [...prev, ...curr])], aiManager.neuralNetworkManager));
        traffic.forEach(v => v.update([...road.borders], aiManager.neuralNetworkManager));

        bestCar = aiManager.findBestCar(cars);

        animate(time);
    }

    requestAnimationFrame(updateTick);
}

/** @param {DOMHighResTimeStamp} time */
function animate(time) {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.reset();

    carContext.save();
    carContext.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carContext);
    traffic.forEach(v => v.draw(carContext));
    carContext.globalAlpha = 0.2;
    if (previewAll) {
        cars.forEach(car => car.draw(carContext));
    }
    carContext.globalAlpha = 1;
    bestCar.draw(carContext, true);

    carContext.restore();

    networkContext.lineDashOffset = -time * 0.01;
    visualizer.drawNetwork(networkContext, bestCar.brain);
}

function generateCars(count) {
    const cars = [];

    for (let i = 0; i < count; i++) {
        cars.push(new Car(road.getLaneCenterByIndex(Math.floor(road.laneCount / 2)), 100, 30, 50, CONTROL_TYPE_AI))
    }

    return cars;
}

/** @param {AIManager} aiManager */
function init(aiManager) {
    document.getElementById("saveAction")
        .addEventListener('click', (e) => {
            aiManager.changeBrain(bestCar.brain);
            aiManager.storeBestBrain()
        });
    document.getElementById("clearAction")
        .addEventListener('click', (e) => {
            aiManager.removeBestBrain()
        });
    document.getElementById("previewAction").style.backgroundColor = previewAll ? 'lime' : 'red';
    document.getElementById("previewAction")
        .addEventListener('click', (e) => {
            previewAll = !previewAll;
            e.target.style.backgroundColor = previewAll ? 'lime' : 'red';
        });
    document.getElementById("autoTrainAction").style.backgroundColor = autoTrain ? 'lime' : 'red';
    document.getElementById("autoTrainAction")
        .addEventListener('click', (e) => {
            autoTrain = !autoTrain;
            localStorage.setItem('autoTrain', autoTrain);
            e.target.style.backgroundColor = autoTrain ? 'lime' : 'red';

            location.reload()
        });
    document.addEventListener('click', (e) => {
        pause = !pause;
    })
    document.getElementById('actions')
        .addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault() });

    if(autoTrain){
        setTimeout(() => {aiManager.changeBrain(bestCar.brain); aiManager.storeBestBrain(); location.reload()}, 25 * 1000)
    }
}
