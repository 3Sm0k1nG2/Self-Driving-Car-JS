export class Level {
    /**
     * @param {number} inputCount 
     * @param {number} outputCount 
     */
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        
        this.biases = new Array(outputCount);

        this.weights = new Array(inputCount);
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] = new Array(inputCount);
        }

        Level.#randomize(this);
    }

    /** @param {Level} level*/
    static #randomize(level){
        for(let iI = 0; iI < level.inputs.length; iI++){
            for(let oI = 0; oI < level.outputs.length; oI++){
                level.weights[iI][oI] = Math.random()*2 - 1
            }
        }

        for(let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random()*2 - 1;
        }
    }

    /**
     * @param {any[]} inputs 
     * @param {Level} level 
     */
    static feedForward(inputs, level) {
        for(let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = inputs[i];
        }

        let sum;
        for(let oI = 0; oI < level.outputs.length; oI++) {
            sum = 0;
            for(let iI = 0; iI < level.inputs.length; iI++) {
                sum += level.inputs[iI] * level.weights[iI][oI];
            }

            level.outputs[oI] = sum > level.biases[oI] ? 1 : 0;
        }

        return level.outputs;
    }
}

export default Level;
