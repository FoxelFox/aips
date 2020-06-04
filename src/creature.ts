import {AmmoPhysics} from "@enable3d/ammo-physics/dist";
import Factories from '@enable3d/common/dist/factories';
import {Scene} from "three";

export class Creature {

	torso
	leftUpperLeg
	leftLowerLeg
	rightUpperLeg
	rightLowerLeg
	hinges = [];

	constructor(
		private factory: Factories,
		private physics: AmmoPhysics,
		private scene: Scene
	) {
		this.createBody();
	}

	createBody() {
		this.torso = this.factory.add.box({width: 1, height: 2, depth: 0.5, y: 4}, {lambert: {color: '#BF8069'}})

		this.leftUpperLeg = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.25, y: 2.5}, {lambert: {color: '#D9933D'}})
		this.leftLowerLeg = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.25, y: 1.5}, {lambert: {color: '#D99E32'}})

		this.rightUpperLeg = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.25, y: 2.5}, {lambert: {color: '#D9933D'}})
		this.rightLowerLeg = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.25, y: 1.5}, {lambert: {color: '#D99E32'}})


		this.physics.add.existing(this.torso);
		this.physics.add.existing(this.leftUpperLeg);
		this.physics.add.existing(this.leftLowerLeg);
		this.physics.add.existing(this.rightUpperLeg);
		this.physics.add.existing(this.rightLowerLeg);



		this.hinges.push(this.physics.add.constraints.hinge(
			this.torso.body,
			this.leftUpperLeg.body, {
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

		this.hinges.push(this.physics.add.constraints.hinge(
			this.leftUpperLeg.body,
			this.leftLowerLeg.body, {
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

		this.hinges.push(this.physics.add.constraints.hinge(
			this.torso.body,
			this.rightUpperLeg.body, {
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

		this.hinges.push(this.physics.add.constraints.hinge(
			this.rightUpperLeg.body,
			this.rightLowerLeg.body, {
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
	}

	reset() {
		for (const hinge of this.hinges) {
			this.scene.remove(hinge)
			this.physics.destroy(hinge);
		}

		this.hinges = []

		this.scene.remove(this.torso);
		this.scene.remove(this.leftLowerLeg);
		this.scene.remove(this.leftUpperLeg);
		this.scene.remove(this.rightUpperLeg);
		this.scene.remove(this.rightLowerLeg);
		this.physics.destroy(this.torso);
		this.physics.destroy(this.leftUpperLeg);
		this.physics.destroy(this.leftLowerLeg);
		this.physics.destroy(this.rightUpperLeg);
		this.physics.destroy(this.rightLowerLeg);

		this.createBody();
	}
}