import Car from "../../views/car/car.js";

class CarAITrainer {
    /** @param {Car[]} cars */
    constructor(cars) {
        this.subjects = cars
    
        this.#addEventListeners();
    }

    #addEventListeners() {
        this.subjects.forEach(
            subject => subject.addEventListener(
                "oncrash",
                this.#onCarCrash.bind(subject, this)
            )
        );
    }
    /** 
     * @this {Car}
     * @param {CarAITrainer} aiTrainer
     */
    #onCarCrash(aiTrainer) {
        aiTrainer.subjects.splice(
            aiTrainer.subjects.findIndex(subject => subject === this),
            1
        );
    }

    /** @param {Car} subject */
    simulateCrash(subject) {
        subject.dispatchEvent('oncrash');
    }
}

export default CarAITrainer;
