import * as THREE from 'three'
import * as dat from 'dat.gui'
import { ApsisArguments, Orbit } from './math/orbit'
import { drawOrbit, drawOrbitGeometry } from './graphics/orbit'
import { createGlobe } from './graphics/globe'
import { EARTH_RADIUS } from './constants'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function createScene() {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000)
    camera.position.x = 5 * EARTH_RADIUS

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const controls = new OrbitControls(camera, renderer.domElement)

    const globe = createGlobe()
    scene.add(globe)

    const apsides = new ApsisArguments(
        420,
        412,
        51.6430,
        120.2867,
        67.3643,
        0
    )

    const gui = new dat.GUI()
    gui.add(apsides, 'apoapsis', 100, 5 * EARTH_RADIUS, 10)
    gui.add(apsides, 'periapsis', 100, 5 * EARTH_RADIUS, 10)
    gui.add(apsides, 'inclination', 0, 90, 1)
    gui.add(apsides, 'argPeriapsis', 0, 360, 1)

    const ellipse = drawOrbit(Orbit.fromApsisArguments(apsides))
    let orbitJson = JSON.stringify(Orbit.fromApsisArguments(apsides))

    scene.add(ellipse)

    function animate() {
        requestAnimationFrame(animate)
        controls.update()

        ellipse.geometry = drawOrbitGeometry(Orbit.fromApsisArguments(apsides))
        orbitJson = JSON.stringify(Orbit.fromApsisArguments(apsides))

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
	document.body.appendChild( info );

    return renderer.domElement
}

document.body.appendChild(createScene())

