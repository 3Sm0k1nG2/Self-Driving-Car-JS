import Border from "./border.js";
import Controls from "./controls.js";
import Point from "./point.js";
import Polygon from "./polygon.js";
import Sensor from "./sensor.js";
import { getPolygonIntersection } from "./utils.js";
import { CONTROL_TYPE_KEYS, CONTROL_TYPE_DUMMY } from "./consts.js";

class Car {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height
     * @param {CONTROL_TYPE_KEYS | CONTROL_TYPE_DUMMY} controlType
     * @param {number} maxSpeed
     */
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.controls = new Controls(controlType);

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        if(controlType === CONTROL_TYPE_KEYS) {
            this.sensor = new Sensor(this);
        }
        this.polygon = new Polygon();

        this.isCrashed = false;

        this.braking = 0.2;
        this.drag = 0;
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        this.speed = Math.min(this.maxSpeed, Math.max(-this.maxSpeed / 2, this.speed));

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #updatePolygon() {
        const points = this.polygon.points;
        points.length = 0;

        const radius = Math.hypot(this.width, this.height) / 2;

        const angle = Math.atan2(this.width, this.height);

        points.push(
            new Point(
                this.x - Math.sin(this.angle - angle) * radius,
                this.y - Math.cos(this.angle - angle) * radius
            ),
            new Point(
                this.x - Math.sin(this.angle + angle) * radius,
                this.y - Math.cos(this.angle + angle) * radius
            ),
            new Point(
                this.x - Math.sin(Math.PI + this.angle - angle) * radius,
                this.y - Math.cos(Math.PI + this.angle - angle) * radius
            ),
            new Point(
                this.x - Math.sin(Math.PI + this.angle + angle) * radius,
                this.y - Math.cos(Math.PI + this.angle + angle) * radius
            ),
        );
    }

    /** @param {Border[]} borders */
    #assessDamage(borders) {
        for(let border of borders) {
            if(
                getPolygonIntersection(
                    this.polygon,
                    new Polygon([border.p1, border.p2])
                )
            ) {
                this.isCrashed = true;
                return;
            }
        }

        this.isCrashed = false;
    }

    /** @param {Border[]} borders */
    update(borders) {
        if(!this.isCrashed){
            this.#move();
            this.#updatePolygon();
            this.#assessDamage(borders);
        }

        this.sensor?.update(borders);
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx, color) {
        ctx.beginPath();

        ctx.moveTo(this.polygon.points[0].x, this.polygon.points[0].y);
        for(let i = 1; i < this.polygon.points.length; i++){
            ctx.lineTo(this.polygon.points[i].x, this.polygon.points[i].y);
        }
        ctx.lineTo(this.polygon.points[0].x, this.polygon.points[0].y);
        ctx.lineWidth = 1;
        ctx.fillStyle = this.isCrashed ? "gray" : color;
        ctx.strokeStyle = "black"
        ctx.stroke();
        ctx.fill();

        this.sensor?.draw(ctx);
    }
}

export default Car;
