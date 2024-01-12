import Intersection from "./intersection.js";
import Point from "./point.js";

/**
 * Linear interpolation
 * 
 * @param {number} A Left most value
 * @param {number} B Right most value
 * @param {number} t Fraction percentage 
 * @returns 
 */
export function lerp(A, B, t) {
    return A+(B-A)*t;
}

/**
 * @param {Point} A 
 * @param {Point} B 
 * @param {Point} C 
 * @param {Point} D 
 *   
 * Linear Equation  
 * | Ix = Ax+(Bx-Ax)*t = Cx+(Dx-Cx)*u  
 * | Iy = Ay+(By-Ay)*t = Cy+(Dy-Cy)*u
 */
export function getIntersection(A, B, C, D) {
    const tDividend = (D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    const uDividend = (C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y);
    const commonDivisor = (D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);

    if(commonDivisor === 0) {
        return null;
    }

    const t = tDividend / commonDivisor;
    const u = uDividend / commonDivisor;

    if(
        t < 0 
        || t > 1 
        || u < 0 
        || u > 1
    ){
        return null;
    }

    return new Intersection(
        lerp(A.x, B.x, t),
        lerp(A.y, B.y, t),
        t
    );
}
