import Car from "./views/car/car.js";
import { CONTROL_TYPE_DUMMY } from "./views/car/consts.js";
import Road from "./views/car/road.js";
import ColorGenerator from "./colorGenerator.js"

class TrafficGenerator {
    /**
     * @param {Road} road 
     * @param {number} levelHeight 
     * @param {ColorGenerator} colorGenerator 
     */
    constructor(road, levelHeight = 50, colorGenerator) {
        this.road = road;
        this.levelHeight = levelHeight;
        this.colorGenerator = colorGenerator;
    }

    /**
     * @param {number} levelHeight 
     * @param {number} laneIndex 
     * @param {string} color 
     * @returns 
     */
    #generateCar(levelHeight, laneIndex, color = undefined) {
        return new Car(
            this.road.getLaneCenterByIndex(laneIndex),
            levelHeight,
            30,
            50,
            CONTROL_TYPE_DUMMY,
            2,
            color ?? this.colorGenerator?.random() ?? "red"
        )
    }

    /** @param {...[laneHeightLevel: number, laneIndex: number]} args */
    generate(...args) {
        const traffic = [];
        
        for(let i in args) {
            traffic.push(
                this.#generateCar(
                    args[i][0],
                    args[i][1]
                )
            );
        }

        return traffic;
    }

    /** @param {...Array<number>} laneLevel */
    generateSequantically(...laneLevel) {
        const traffic = [];

        for(let levelIndex in laneLevel) {
            for(let laneIndex of laneLevel[levelIndex]) {
                traffic.push(
                    this.#generateCar(
                        (this.levelHeight * 3) * levelIndex * -1,
                        laneIndex
                    )
                );
            }
        }

        return traffic;
    }
}

export default TrafficGenerator;
