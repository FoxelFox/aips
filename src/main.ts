import {AmmoPhysics, ExtendedObject3D, PhysicsLoader} from "@enable3d/ammo-physics/dist";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Scene, Color, PerspectiveCamera, WebGLRenderer, HemisphereLight, AmbientLight, DirectionalLight, BoxBufferGeometry, MeshLambertMaterial, Mesh, SphereBufferGeometry, Clock, Vector3, MeshBasicMaterial } from "three";
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
	const renderer = new WebGLRenderer({antialias: true})
	renderer.setSize(window.innerWidth, window.innerHeight /2)
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement)

	const chartCanvas = document.createElement("canvas");
	const chartCTX = chartCanvas.getContext("2d");
	document.body.appendChild(chartCanvas)


	const chartStorage = localStorage.getItem('chart');
	let chartData;

	if (chartStorage) {
		chartData = JSON.parse(chartStorage);
	} else {
		chartData = {
			labels: [],
			data: []
		}
	}

	Chart.defaults.global.elements.point.radius = chartData.labels.length > 50 ? 0 : 3;
	Chart.defaults.global.elements.line.tension = chartData.labels.length > 50 ? 0 : 0.4;

	var chart = new Chart(chartCTX, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: chartData.labels,
			datasets: [{
				label: 'score',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: chartData.data
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
		{ width: 200, height: 200, name: 'ground', y: -0.1},
		{lambert: {color: '#566573'}}
	);

	const geo = new BoxBufferGeometry(200, 0.91, 200, 50, undefined, 50 )
	const mat = new MeshBasicMaterial({wireframe: true, wireframeLinewidth: 4, wireframeLinecap: 'round', wireframeLinejoin: "round", transparent: true, opacity: 0.5, color: 0xFFEEEEEE});
	scene.add(new Mesh(geo, mat));


	const dna = localStorage.getItem('dna');
	const creature = new Creature(factory, physics, scene);
	const population = new Population(10, creature.bodies.length * 12 +3, creature.hinges.length, dna ? JSON.parse(dna) : undefined);

	const clock = new Clock();

	const deadline = 5000;
	const delta = 1/60 * 1000;
	let currentCreatureTime = 0;
	let currentSpecies = population.species[0];
	let currentSpeciesIndex = 0;
	let highScore = 0;
	let gen = chartData.labels.length;
	let accumulatedVelocity = 0;
	let ticks = 0


	creature.torso.body.on.collision((o, e) => {

		if (o.name === 'ground' && e === 'start') {
			//currentSpecies.reward = -4;
			//currentCreatureTime += deadline * 10;
		}
	})


	setInterval(() => {
		//const delta = clock.getDelta() * 1000;

		currentCreatureTime += delta;


		physics.update(delta);


		// update net
		let j = 0;

		for(const body of creature.bodies) {
			currentSpecies.ai.input[j++] = body.position.x;
			currentSpecies.ai.input[j++] = body.position.y;
			currentSpecies.ai.input[j++] = body.position.z;

			currentSpecies.ai.input[j++] = body.rotation.x;
			currentSpecies.ai.input[j++] = body.rotation.y;
			currentSpecies.ai.input[j++] = body.rotation.z;

			currentSpecies.ai.input[j++] = body.velocity.x;
			currentSpecies.ai.input[j++] = body.velocity.y;
			currentSpecies.ai.input[j++] = body.velocity.z;

			currentSpecies.ai.input[j++] = body.angularVelocity.x;
			currentSpecies.ai.input[j++] = body.angularVelocity.y;
			currentSpecies.ai.input[j++] = body.angularVelocity.z;

		}

		currentSpecies.ai.input[j++] = creature.torso.position.y;
		currentSpecies.ai.input[j++] = creature.torso.position.x;
		currentSpecies.ai.input[j++] = currentCreatureTime % 1000;

		currentSpecies.ai.update();

		let i = 0;
		for (const hinge of creature.hinges) {
			hinge.enableAngularMotor(true, currentSpecies.ai.output[i], 5)
			//hinge.setAngularOnly(currentSpecies.ai.output[i])
			i++;
		}

		ticks++;
		accumulatedVelocity += creature.torso.body.velocity.z

		if (currentCreatureTime > deadline + creature.torso.position.z * 1000) {
			// life is ended here
			currentSpecies.reward = accumulatedVelocity / ticks + (creature.head.body.position.y - 4);

			currentSpeciesIndex++;

			if (currentSpeciesIndex >= population.species.length) {
				currentSpeciesIndex = 0;
				population.populate();

				if (highScore < population.species[0].reward) {
					highScore = population.species[0].reward;
					console.log(highScore, "HIGHSCORE");
				}

				gen++;
				console.log(population.species[0].reward, "Gen", gen);


				chartData.labels.push(gen)
				chartData.data.push(population.species[0].reward);


				localStorage.setItem('chart', JSON.stringify(chartData));
				localStorage.setItem('dna', JSON.stringify(population.species[0].ai.dna));


				chart.update();



			}

			currentSpecies = population.species[currentSpeciesIndex];

			//currentSpecies.reward = 0;
			currentCreatureTime = 0;
			ticks = 0;
			accumulatedVelocity = 0;
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