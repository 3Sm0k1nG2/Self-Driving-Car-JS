import Level from "./level.js"

export class NeuralNetwork {
    /**  @param {number[]} neuronCounts */
    constructor(neuronCounts) {
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i],
                neuronCounts[i+1]
            ));
        }
    }

    /**
     * 
     * @param {any[]} inputs 
     * @param {NeuralNetwork} network 
     */
    static feedForward(inputs, network) {
        let outputs = Level.feedForward(
            inputs, 
            network.levels[0]
        );

        for(let i = 1; i < network.levels.length; i++){
            outputs = Level.feedForward(
                outputs, 
                network.levels[i]
            );
        }

        return outputs;
    }
}

export default NeuralNetwork;
