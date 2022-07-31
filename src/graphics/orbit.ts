import * as THREE from "three";
import { EARTH_RADIUS } from "../constants";
import { Orbit } from "../math/orbit";

export function createOrbit(orbit: Orbit) {
    const orbitObject = new THREE.Object3D()

    orbitObject.add(createOrbitLine(orbit))
    orbitObject.add(createAscendingNode(orbit))

    return orbitObject
}

function createOrbitLine(orbit: Orbit) {
    const orbitWithArg = new THREE.Object3D()

    const geometry = createOrbitGeometry(orbit)
    const material = new THREE.LineBasicMaterial({ color: 0xffffff })

    const line =  new THREE.Line(geometry, material)

    line.rotateY(orbit.argPeriapsis)

    orbitWithArg.add(line)
    orbitWithArg.add(createArgumentOfPeriapsis(orbit))

    const axis = new THREE.Spherical(1, Math.PI / 2, orbit.ascendingNode)
    orbitWithArg.rotateOnAxis(new THREE.Vector3().setFromSpherical(axis), orbit.inclination)

    return orbitWithArg
}

function createOrbitGeometry(orbit: Orbit): THREE.BufferGeometry {
    const curve = createOrbitCurve(orbit)

    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50))

    geometry.rotateX(Math.PI / 2)
    geometry.rotateY(Math.PI / 2)

    return geometry
}

function createOrbitCurve(orbit: Orbit): THREE.EllipseCurve {
    const curve =  new THREE.EllipseCurve(
        orbit.eccentricity * orbit.semimajorAxis, 0,                            // ax, aY
        orbit.semimajorAxis, Math.sqrt(orbit.apoapsis * orbit.periapsis),       // xRadius, yRadius
        0, 2 * Math.PI,                                                         // aStartAngle, aEndAngle
        false,                                                                  // aClockwise
        0                                                                       // aRotation
    )

    return curve
}

export function createPointsOfInterest(orbit: Orbit) {
    const poi = new THREE.Object3D()

    poi.add(createArgumentOfPeriapsis(orbit))
    poi.add(createAscendingNode(orbit))

    return poi
}

function createArgumentOfPeriapsis(orbit: Orbit) {
    const material = new THREE.LineBasicMaterial({ color: 0xaa0000 })

    const points = []
    points.push(new THREE.Spherical(orbit.periapsis + 0.1 * EARTH_RADIUS, Math.PI / 2, orbit.argPeriapsis))
    points.push(new THREE.Spherical(orbit.periapsis - 0.1 * EARTH_RADIUS, Math.PI / 2, orbit.argPeriapsis))
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3().setFromSpherical(p)))

    return new THREE.Line(geometry, material)
}

function createAscendingNode(orbit: Orbit) {
    const material = new THREE.LineBasicMaterial({ color: 0x0000aa })

    const points = []
    points.push(new THREE.Spherical(orbit.semimajorAxis, Math.PI / 2, orbit.ascendingNode))
    points.push(new THREE.Spherical(orbit.semimajorAxis, Math.PI / -2, orbit.ascendingNode))
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3().setFromSpherical(p)))

    return new THREE.Line(geometry, material)
}