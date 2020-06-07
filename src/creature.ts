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


		this.physics.add.existing(this.torso, {mass: 5});
		this.physics.add.existing(this.leftUpperLeg, {mass: 1});
		this.physics.add.existing(this.leftLowerLeg, {mass: 1});
		this.physics.add.existing(this.rightUpperLeg, {mass: 1});
		this.physics.add.existing(this.rightLowerLeg, {mass: 1});


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
		this.resetObject(this.torso, 0, 4, 0);
		this.resetObject(this.leftUpperLeg, -0.25, 2.5, 0);
		this.resetObject(this.leftLowerLeg, -0.25, 1.5, 0);
		this.resetObject(this.rightUpperLeg, 0.25, 2.5, 0);
		this.resetObject(this.rightLowerLeg, 0.25, 1.5, 0);

	}

	resetObject(object, x, y, z) {

		for (const hinge of this.hinges) {
			hinge.enableAngularMotor(false, 0, 0)

			//setAngularOnly
		}



		object.body.setCollisionFlags(2)

		object.position.set(x,y,z)
		object.rotation.set(0, 0,0)



		object.body.needUpdate = true;


		// this will run only on the next update if body.needUpdate = true
		object.body.once.update(() => {
			object.body.setCollisionFlags(0)
			object.body.setVelocity(0, 0, 0)
			object.body.setAngularVelocity(0, 0, 0)
			object.body.needUpdate = true;
		})

		//this.physics.update(16)
	}

	needUpdate() {
		this.torso.body.needUpdate = true
		this.leftUpperLeg.body.needUpdate = true
		this.leftLowerLeg.body.needUpdate = true
		this.rightUpperLeg.body.needUpdate = true
		this.rightLowerLeg.body.needUpdate = true
	}

}