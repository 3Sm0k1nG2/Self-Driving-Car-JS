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
