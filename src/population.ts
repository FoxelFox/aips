import {Ai} from "./ai";

export class Population {

	species: { ai: Ai, reward: number }[] = [];


	constructor(public size: number, public inputs: number, public outputs: number) {

		// create random population
		for (let i = 0; i < size; i++) {
			this.species.push({
				ai: new Ai(new Array(inputs), new Array(outputs)),
				reward: 0
			})
		}
	}

	populate() {

		this.species.sort((a, b) => b.reward - a.reward);

		for (let i = 1; i < this.size; i++) {
			this.species[i].ai = new Ai(
				new Array(this.inputs),
				new Array(this.outputs),
				JSON.parse(JSON.stringify(this.species[0].ai.dna))
			);

			this.species[i].ai.mutate(0.1);
		}

	}

}