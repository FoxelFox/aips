import {AmmoPhysics} from "@enable3d/ammo-physics/dist";
import Factories from '@enable3d/common/dist/factories';
import {Scene} from "three";

export class Creature {

	torso
	leftUpperLeg
	leftLowerLeg
	rightUpperLeg
	rightLowerLeg
	rightUpperArm
	rightLowerArm
	leftUpperArm
	leftLowerArm
	head
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


		this.rightUpperArm = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.75, y: 4.5}, {lambert: {color: '#D9933D'}})
		this.rightLowerArm = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: 0.75, y: 3.5}, {lambert: {color: '#D9933D'}})

		this.leftUpperArm = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.75, y: 4.5}, {lambert: {color: '#D9933D'}})
		this.leftLowerArm = this.factory.add.box({width: 0.25, height: 1, depth: 0.25, x: -0.75, y: 3.5}, {lambert: {color: '#D9933D'}})

		this.head = this.factory.add.box({width: 0.5, height: 0.5, depth: 0.5, x: 0, y: 5.3}, {lambert: {color: '#D9933D'}})


		this.physics.add.existing(this.torso, {mass: 50});
		this.physics.add.existing(this.leftUpperLeg, {mass: 10});
		this.physics.add.existing(this.leftLowerLeg, {mass: 10});
		this.physics.add.existing(this.rightUpperLeg, {mass: 10});
		this.physics.add.existing(this.rightLowerLeg, {mass: 10});

		this.physics.add.existing(this.rightUpperArm, {mass: 5});
		this.physics.add.existing(this.rightLowerArm, {mass: 5});

		this.physics.add.existing(this.leftUpperArm, {mass: 5});
		this.physics.add.existing(this.leftLowerArm, {mass: 5});
		this.physics.add.existing(this.head, {mass: 5});


		this.rightLowerLeg.body.setFriction(100);
		this.leftLowerLeg.body.setFriction(100);
		this.rightLowerArm.body.setFriction(100);
		this.leftLowerArm.body.setFriction(100);


		this.hinges.push(this.physics.add.constraints.hinge(
			this.torso.body,
			this.leftUpperLeg.body, {
				pivotA: {
					x: -0.25,
					y: -1.1
				},
				pivotB: {
					x: 0.0,
					y: 0.55
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
					y: -0.55
				},
				pivotB: {
					y: 0.55
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
					y: 0.55
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
					y: -0.55
				},
				pivotB: {
					y: 0.55
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
			this.rightUpperArm.body, {
				pivotA: {
					x: 0.75,
					y: 0.75
				},
				pivotB: {
					x: 0.0,
					y: 0.25
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
			this.rightUpperArm.body,
			this.rightLowerArm.body, {
				pivotA: {
					x: 0.0,
					y: -0.55
				},
				pivotB: {
					x: 0.0,
					y: 0.55
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
			this.leftUpperArm.body, {
				pivotA: {
					x: -0.75,
					y: 0.75
				},
				pivotB: {
					x: 0.0,
					y: 0.25
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
			this.leftUpperArm.body,
			this.leftLowerArm.body, {
				pivotA: {
					x: 0,
					y: -0.55
				},
				pivotB: {
					x: 0.0,
					y: 0.55
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
			this.head.body, {
				pivotA: {
					x: 0,
					y: 1.3
				},
				pivotB: {
					x: 0.0,
					y: 0
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


		this.resetObject(this.rightUpperArm, 0.75, 4.5, 0);
		this.resetObject(this.rightLowerArm, 0.75, 3.5, 0);
		this.resetObject(this.leftUpperArm, -0.75, 4.5, 0);
		this.resetObject(this.leftLowerArm, -0.75, 3.5, 0);

		this.resetObject(this.head, 0, 5.1, 0);


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


}