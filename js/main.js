import Car from "./car.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.height = window.innerHeight;
canvas.width = 200;

const context = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(context);

updateTick();

function animate(){
    canvas.height = window.innerHeight;

    context.reset();

    car.draw(context);
}

function updateTick() {
    car.update();

    animate();

    requestAnimationFrame(updateTick);
}
