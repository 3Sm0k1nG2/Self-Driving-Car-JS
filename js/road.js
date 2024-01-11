import { lerp } from "./utils.js"

class Road {
    /**
     * @param {number} x 
     * @param {number} width 
     * @param {number} laneCount 
     */
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width / 2;
        this.right = x + width / 2;

        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        const leftLaneBorder = {
            p1: {
                x: this.left,
                y: this.top
            },
            p2: {
                x: this.left,
                y: this.bottom
            }
        }
        const rightLaneBorder = {
            p1: {
                x: this.right,
                y: this.top
            },
            p2: {
                x: this.right,
                y: this.bottom
            }
        }
        this.borders = [
            leftLaneBorder,
            rightLaneBorder
        ];
    }

    get laneWidth() {
        return this.width / this.laneCount;
    }

    /** @param {number} laneIndex */
    getLaneCenterByIndex(laneIndex) {
        return this.left + (this.laneWidth / 2) + laneIndex * this.laneWidth; 
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        for(let border of this.borders){
            ctx.beginPath();
            ctx.moveTo(border.p1.x, border.p1.y);
            ctx.lineTo(border.p2.x, border.p2.y);
            ctx.stroke();
        }

        ctx.strokeStyle = "dash white";

        let x = undefined;
        for (let i = 1 ; i < this.laneCount; i++) {
            x = lerp(this.left, this.right, i/this.laneCount);

            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.setLineDash([20])
            ctx.stroke();
        }
    }
}

export default Road;
