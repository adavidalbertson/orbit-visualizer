import * as THREE from 'three'
import { EARTH_RADIUS, greenLine, whiteLine } from '../constants'

export function createGlobe(): THREE.Object3D {
    const globe = new THREE.Object3D()

    globe.add(createSphere())
    globe.add(createAmbientLight())
    globe.add(createDirectionalLight())
    globe.add(createEquator())
    globe.add(createPrimeMeridian())
    globe.add(createPoles())

    return globe
}

function createSphere(): THREE.Mesh {
    const loader = new THREE.TextureLoader();
    const geometry = new THREE.SphereGeometry(EARTH_RADIUS)
    const material = new THREE.MeshPhongMaterial({map: loader.load('../public/2k_earth.jpg')})
    const sphere = new THREE.Mesh(geometry, material)
    sphere.castShadow = true
    sphere.receiveShadow = true
    sphere.rotateY(Math.PI)
    return sphere
}

function createAmbientLight(): THREE.AmbientLight {
    return new THREE.AmbientLight(0x404040, 0.25)
}

function createDirectionalLight(): THREE.DirectionalLight {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75)
    directionalLight.position.set(10, 1, 0)
    directionalLight.target.position.set(-5, -1, 0)
    directionalLight.castShadow = true
    return directionalLight
}

function createEquator(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> {
    const curve = new THREE.EllipseCurve(
        0, 0,
        EARTH_RADIUS * 1.02, EARTH_RADIUS * 1.02,
        0, 2 * Math.PI,
        false,
        0
    )
    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = greenLine
    const ellipse = new THREE.Line(geometry, material)

    ellipse.rotateX(Math.PI / 2)

    return ellipse
}

function createPrimeMeridian(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> {
    const curve = new THREE.EllipseCurve(
        0, 0,
        EARTH_RADIUS * 1.02, EARTH_RADIUS * 1.02,
        0, Math.PI,
        false,
        Math.PI / -2
    )

    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = greenLine
    const ellipse = new THREE.Line(geometry, material)

    ellipse.rotateY(Math.PI / -2)

    return ellipse
}

function createPoles(): THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial> {
    const material = whiteLine

    const points = []
    points.push(new THREE.Vector3(0, -1.2 * EARTH_RADIUS, 0))
    points.push(new THREE.Vector3(0, 1.2 * EARTH_RADIUS, 0))
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    return new THREE.Line(geometry, material)
}
