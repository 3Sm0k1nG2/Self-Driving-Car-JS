import Car from "./car.js";

/** @type {HTMLCanvasElement} */
const world = document.getElementById('world');
world.height = window.innerHeight;
world.width = 200;

const context = world.getContext("2d");

const car = new Car(100, 100, 30, 50);
car.draw(context);

updateTick();

function animate(){
    world.height = window.innerHeight;

    context.reset();

    car.draw(context);

}

function updateTick() {
    car.update();

    animate();

    requestAnimationFrame(updateTick);
}
