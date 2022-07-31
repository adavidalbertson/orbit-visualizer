import * as THREE from "three";
import { Orbit } from "../math/orbit";

export function drawOrbit(orbit: Orbit): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> {
    const geometry = drawOrbitGeometry(orbit)
    const material = new THREE.LineBasicMaterial({ color: 0xffffff })

    return new THREE.Line(geometry, material)
}

export function drawOrbitGeometry(orbit: Orbit): THREE.BufferGeometry {
    const curve = drawOrbitCurve(orbit)

    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50))

    geometry.rotateX(orbit.inclination + (Math.PI / 2))
    geometry.rotateY(orbit.argPeriapsis + (Math.PI / 2))

    return geometry
}

export function drawOrbitCurve(orbit: Orbit): THREE.EllipseCurve {
    return new THREE.EllipseCurve(
        orbit.eccentricity * orbit.semimajorAxis, 0,                            // ax, aY
        orbit.semimajorAxis, Math.sqrt(orbit.apoapsis * orbit.periapsis),       // xRadius, yRadius
        0, 2 * Math.PI,                                                         // aStartAngle, aEndAngle
        false,                                                                  // aClockwise
        0                                                                       // aRotation
    )
}