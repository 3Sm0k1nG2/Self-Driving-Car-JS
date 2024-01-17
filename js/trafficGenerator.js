import Car from "./views/car/car.js";
import { CONTROL_TYPE_DUMMY } from "./views/car/consts.js";
import Road from "./views/car/road.js";

class TrafficGenerator {
    /**
     * @param {Road} road 
     * @param {number} levelHeight 
     */
    constructor(road, levelHeight = 50) {
        this.road = road;
        this.levelHeight = levelHeight;
    }

    /** @param {...[laneHeightLevel: number, laneIndex: number]} args */
    generate(...args) {
        const traffic = [];

        for(let i in args) {
            traffic.push(
                new Car(
                    this.road.getLaneCenterByIndex(args[i][1]),
                    this.levelHeight * args[i][0],
                    30,
                    50,
                    CONTROL_TYPE_DUMMY,
                    2
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
                        new Car(
                            this.road.getLaneCenterByIndex(laneIndex),
                            (this.levelHeight * 3) * levelIndex * -1,
                            30,
                            50,
                            CONTROL_TYPE_DUMMY,
                            2
                        )
                    );
                }
            }
    
            return traffic;
        }
}

export default TrafficGenerator;
