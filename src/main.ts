import {AmmoPhysics, ExtendedObject3D, PhysicsLoader} from "@enable3d/ammo-physics/dist";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Scene, Color, PerspectiveCamera, WebGLRenderer, HemisphereLight, AmbientLight, DirectionalLight, BoxBufferGeometry, MeshLambertMaterial, Mesh, SphereBufferGeometry, Clock, Vector3 } from "three";
import {Ai} from "./ai";
import {Population} from "./population";
import {Creature} from "./creature";
import Chart = require("chart.js");

console.log('hello world')

const MainScene = () => {
	const scene = new Scene()
	scene.background = new Color(0xf0f0f0)

	document.getElementsByTagName("body")[0].setAttribute("style", "margin: 0")

	// camera
	const camera = new PerspectiveCamera(50, window.innerWidth / (window.innerHeight /2), 0.1, 1000)
	camera.position.set(10, 10, 10)


	// renderer
	const renderer = new WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight /2)
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement)

	const chartCanvas = document.createElement("canvas");
	const chartCTX = chartCanvas.getContext("2d");
	document.body.appendChild(chartCanvas)

	var chart = new Chart(chartCTX, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: [],
			datasets: [{
				label: 'score',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: []
			}]
		},

		// Configuration options go here
		options: {
			aspectRatio: window.innerWidth / (window.innerHeight /2)
		}
	});


	// dpr
	const DPR = window.devicePixelRatio
	renderer.setPixelRatio(Math.min(2, DPR))

	// orbit controls
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.target = new Vector3(0, 3,0)
	controls.update();

	// light
	scene.add(new HemisphereLight(0xffffbb, 0x080820, 0.5))


	scene.add(new AmbientLight(0x666666))
	const light = new DirectionalLight(0xdfebff, 0.5)
	light.position.set(50, 200, 100)
	light.position.multiplyScalar(1.3)
	light.castShadow = true;
	//light.shadow.bias = 0.00001


	scene.add(light)

	// physics
	const physics = new AmmoPhysics(scene)

	//physics.debug.enable()
	//physics.debug.mode(4097)

	// extract the object factory from physics
	// the factory will make/add object without physics
	const { factory } = physics

	// static ground
	physics.add.ground(
		{ width: 200, height: 200, name: 'ground' },
		{lambert: {color: '#566573'}}
	);


	const creature = new Creature(factory, physics, scene);
	const population = new Population(10, 19 * 3 +2, creature.hinges.length);

	const clock = new Clock();

	const deadline = 5000;
	const delta = 1/60 * 1000;
	let currentCreatureTime = 0;
	let currentSpecies = population.species[0];
	let currentSpeciesIndex = 0;
	let highScore = 0;
	let gen = 0;


	creature.torso.body.on.collision((o, e) => {

		if (o.name === 'ground' && e === 'start') {
			//currentSpecies.reward = -4;
			currentCreatureTime += deadline * 10;
		}
	})


	setInterval(() => {
		//const delta = clock.getDelta() * 1000;

		currentCreatureTime += delta;


		physics.update(delta) // default
		//physics.update(1) // fixed physic steps
		//physics.updateDebugger()


		// update net
		let j = 0;
		currentSpecies.ai.input[j++] = creature.leftUpperLeg.rotation.x;
		currentSpecies.ai.input[j++] = creature.rightUpperLeg.rotation.x;
		currentSpecies.ai.input[j++] = creature.rightLowerLeg.rotation.x;
		currentSpecies.ai.input[j++] = creature.leftLowerLeg.rotation.x;
		currentSpecies.ai.input[j++] = creature.torso.rotation.x;

		currentSpecies.ai.input[j++] = creature.leftUpperLeg.rotation.y;
		currentSpecies.ai.input[j++] = creature.rightUpperLeg.rotation.y;
		currentSpecies.ai.input[j++] = creature.rightLowerLeg.rotation.y;
		currentSpecies.ai.input[j++] = creature.leftLowerLeg.rotation.y;
		currentSpecies.ai.input[j++] = creature.torso.rotation.y;

		currentSpecies.ai.input[j++] = creature.leftUpperLeg.rotation.z;
		currentSpecies.ai.input[j++] = creature.rightUpperLeg.rotation.z;
		currentSpecies.ai.input[j++] = creature.rightLowerLeg.rotation.z;
		currentSpecies.ai.input[j++] = creature.leftLowerLeg.rotation.z;
		currentSpecies.ai.input[j++] = creature.torso.rotation.z;

		currentSpecies.ai.input[j++] = creature.torso.body.velocity.x;
		currentSpecies.ai.input[j++] = creature.torso.body.velocity.y;
		currentSpecies.ai.input[j++] = creature.torso.body.velocity.z;

		currentSpecies.ai.input[j++] = creature.torso.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.torso.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.torso.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.leftUpperLeg.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.leftUpperLeg.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.leftUpperLeg.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.rightUpperLeg.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.rightUpperLeg.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.rightUpperLeg.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.leftLowerLeg.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.leftLowerLeg.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.leftLowerLeg.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.rightLowerLeg.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.rightLowerLeg.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.rightLowerLeg.body.angularVelocity.z;


		currentSpecies.ai.input[j++] = creature.leftUpperArm.rotation.x;
		currentSpecies.ai.input[j++] = creature.rightUpperArm.rotation.x;
		currentSpecies.ai.input[j++] = creature.rightLowerArm.rotation.x;
		currentSpecies.ai.input[j++] = creature.leftLowerArm.rotation.x;

		currentSpecies.ai.input[j++] = creature.leftUpperArm.rotation.y;
		currentSpecies.ai.input[j++] = creature.rightUpperArm.rotation.y;
		currentSpecies.ai.input[j++] = creature.rightLowerArm.rotation.y;
		currentSpecies.ai.input[j++] = creature.leftLowerArm.rotation.y;


		currentSpecies.ai.input[j++] = creature.leftUpperArm.rotation.z;
		currentSpecies.ai.input[j++] = creature.rightUpperArm.rotation.z;
		currentSpecies.ai.input[j++] = creature.rightLowerArm.rotation.z;
		currentSpecies.ai.input[j++] = creature.leftLowerArm.rotation.z;

		currentSpecies.ai.input[j++] = creature.leftUpperArm.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.leftUpperArm.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.leftUpperArm.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.rightUpperArm.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.rightUpperArm.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.rightUpperArm.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.leftLowerArm.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.leftLowerArm.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.leftLowerArm.body.angularVelocity.z;

		currentSpecies.ai.input[j++] = creature.rightLowerArm.body.angularVelocity.x;
		currentSpecies.ai.input[j++] = creature.rightLowerArm.body.angularVelocity.y;
		currentSpecies.ai.input[j++] = creature.rightLowerArm.body.angularVelocity.z;


		currentSpecies.ai.input[j++] = creature.torso.position.y;
		currentSpecies.ai.input[j++] = creature.torso.position.x;

		currentSpecies.ai.update();

		let i = 0;
		for (const hinge of creature.hinges) {
			hinge.enableAngularMotor(true, currentSpecies.ai.output[i], 2)
			//hinge.setAngularOnly(currentSpecies.ai.output[i])
			i++;
		}


		//creature.needUpdate();

		if (currentCreatureTime > deadline + creature.torso.position.z * 10000) {
			// life is ended here
			currentSpecies.reward = creature.torso.position.z;


			currentSpeciesIndex++;

			if (currentSpeciesIndex >= population.species.length) {
				currentSpeciesIndex = 0;
				population.populate();

				if (highScore < population.species[0].reward) {
					highScore = population.species[0].reward;
					console.log(highScore, "HIGHSCORE");
				}

				gen++;
				console.log(population.species[0].reward, "Gen", gen,);

				chart.data.labels.push(gen)
				chart.data.datasets[0].data.push(population.species[0].reward);
				chart.update();



			}

			currentSpecies = population.species[currentSpeciesIndex];
			//currentSpecies.reward = 0;
			currentCreatureTime = 0;
			creature.reset();




		}
	}, delta)

	const animate = () => {

		renderer.render(scene, camera)

		requestAnimationFrame(animate)
	}
	requestAnimationFrame(animate)
}
PhysicsLoader('lib', () => MainScene())