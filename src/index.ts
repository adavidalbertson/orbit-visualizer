import * as THREE from 'three'
import * as dat from 'dat.gui'
import { ApsisArguments, Orbit } from './math/orbit'
import { createOrbit } from './graphics/orbit'
import { createGlobe } from './graphics/globe'
import { EARTH_RADIUS } from './constants'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function createScene() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
    camera.position.x = 3 * EARTH_RADIUS

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const controls = new OrbitControls(camera, renderer.domElement)

    const globe = createGlobe()
    scene.add(globe)

    const ISS = new ApsisArguments(
        420,
        412,
        51.6430,
        120.2867,
        67.3643,
        0
    )

    const zeroArgs = new ApsisArguments(
        3000,
        500,
        0,
        90,
        0,
        0
    )

    const apsides = ISS

    const gui = new dat.GUI()
    gui.add(apsides, 'apoapsis', 100, 3 * EARTH_RADIUS, 10)
    gui.add(apsides, 'periapsis', 100, 3 * EARTH_RADIUS, 10)
    gui.add(apsides, 'inclination', 0, 90, 1)
    gui.add(apsides, 'ascendingNode', 0, 360, 1)
    gui.add(apsides, 'argPeriapsis', 0, 360, 1)

    let orbit = Orbit.fromApsisArguments(apsides)
    let orbitJson = JSON.stringify(orbit)

    const ellipse = createOrbit(orbit)

    scene.add(ellipse)

    function animate() {
        requestAnimationFrame(animate)
        controls.update()

        orbit = Orbit.fromApsisArguments(apsides)

        ellipse.clear()
        ellipse.add(createOrbit(orbit))
        orbitJson = JSON.stringify(orbit)

        renderer.render(scene, camera)
    }

    animate()

    const info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '30px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	info.style.fontWeight = 'bold';
	info.style.backgroundColor = 'transparent';
	info.style.zIndex = '1';
	info.style.fontFamily = 'Monospace';
	info.innerHTML = orbitJson;
	// document.body.appendChild( info );

    return renderer.domElement
}

document.body.appendChild(createScene())

