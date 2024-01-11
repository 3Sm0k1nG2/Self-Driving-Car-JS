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
 * @returns 
 */
export function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return new Intersection(
                lerp(A.x,B.x,t),
                lerp(A.y,B.y,t),
                t
            );
        }
    }

    return null;
}
