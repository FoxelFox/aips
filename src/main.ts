import {AmmoPhysics, ExtendedObject3D, PhysicsLoader} from "@enable3d/ammo-physics/dist";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Scene, Color, PerspectiveCamera, WebGLRenderer, HemisphereLight, AmbientLight, DirectionalLight, BoxBufferGeometry, MeshLambertMaterial, Mesh, SphereBufferGeometry, Clock } from "three";
import {Ai} from "./ai";
console.log('hello world')

const MainScene = () => {
	const scene = new Scene()
	scene.background = new Color(0xf0f0f0)

	// camera
	const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(10, 10, 20)

	// renderer
	const renderer = new WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	// dpr
	const DPR = window.devicePixelRatio
	renderer.setPixelRatio(Math.min(2, DPR))

	// orbit controls
	const controls = new OrbitControls(camera, renderer.domElement)

	// light
	scene.add(new HemisphereLight(0xffffbb, 0x080820, 1))
	scene.add(new AmbientLight(0x666666))
	const light = new DirectionalLight(0xdfebff, 1)
	light.position.set(50, 200, 100)
	light.position.multiplyScalar(1.3)

	// physics
	const physics = new AmmoPhysics(scene)
	physics.debug.enable()
	physics.debug.mode(4097)

	// extract the object factory from physics
	// the factory will make/add object without physics
	const { factory } = physics

	// static ground
	physics.add.ground({ width: 20, height: 20 }, {basic: {color: '#566573'}})


	const torso = factory.add.box({width: 1, height: 2, depth: 0.5, y: 4}, {basic: {color: '#BF8069'}})

	const leftUpperLeg = factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.25, y: 2.5}, {basic: {color: '#D9933D'}})
	const leftLowerLeg = factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.25, y: 1.5}, {basic: {color: '#D99E32'}})

	const rightUpperLeg = factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.25, y: 2.5}, {basic: {color: '#D9933D'}})
	const rightLowerLeg = factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.25, y: 1.5}, {basic: {color: '#D99E32'}})

	physics.add.existing(torso);
	physics.add.existing(leftUpperLeg);
	physics.add.existing(leftLowerLeg);
	physics.add.existing(rightUpperLeg);
	physics.add.existing(rightLowerLeg);

	const hinges = [];

	hinges.push(physics.add.constraints.hinge(
		torso.body,
		leftUpperLeg.body, {
			pivotA: {
				x: -0.25,
				y: -1.1
			},
			pivotB: {
				x: 0.0,
				y: 0.6
			},
			axisA: {
				x: 1
			},
			axisB: {
				x: 1
			}
		}
	));

	hinges.push(physics.add.constraints.hinge(
		leftUpperLeg.body,
		leftLowerLeg.body, {
			pivotA: {
				y: -0.6
			},
			pivotB: {
				y: 0.6
			},
			axisA: {
				x: 1
			},
			axisB: {
				x: 1
			}
		}
	));

	hinges.push(physics.add.constraints.hinge(
		torso.body,
		rightUpperLeg.body, {
			pivotA: {
				x: 0.25,
				y: -1.1
			},
			pivotB: {
				x: 0.0,
				y: 0.6
			},
			axisA: {
				x: 1
			},
			axisB: {
				x: 1
			}
		}
	));

	hinges.push(physics.add.constraints.hinge(
		rightUpperLeg.body,
		rightLowerLeg.body, {
			pivotA: {
				y: -0.6
			},
			pivotB: {
				y: 0.6
			},
			axisA: {
				x: 1
			},
			axisB: {
				x: 1
			}
		}
	));

	const ai = new Ai(new Array(hinges.length), new Array(hinges.length));

	const clock = new Clock()

	const animate = () => {
		physics.update(clock.getDelta() * 1000)
		physics.updateDebugger()
		renderer.render(scene, camera)

		ai.input[0] = leftUpperLeg.rotation.x;
		ai.input[1] = rightUpperLeg.rotation.x;
		ai.input[2] = rightLowerLeg.rotation.x;
		ai.input[3] = leftLowerLeg.rotation.x;

		//hinges[0].enableAngularMotor(true, 5, 5)

		ai.update();

		let i = 0;
		for (const hinge of hinges) {
			hinge.enableAngularMotor(true, ai.output[i], 5)
			i++;
		}



		console.log()


		requestAnimationFrame(animate)
	}
	requestAnimationFrame(animate)
}
PhysicsLoader('lib', () => MainScene())