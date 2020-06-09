import {Ai} from "./ai";

export class Population {

	species: { ai: Ai, reward: number }[] = [];
	strength: number = 1;

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



		this.species= this.species.sort((a, b) => b.reward - a.reward);

		for (let i = Math.floor(this.size / 10); i < this.size; i++) {
			this.species[i].ai = new Ai(
				new Array(this.inputs),
				new Array(this.outputs),
				JSON.parse(JSON.stringify(this.species[0 % Math.floor(this.size / 10)].ai.dna))
			);

			this.species[i].ai.mutate(Math.random() * 0.5, this.species[i].reward);
		}

		this.strength += 0.1;

		if (this.strength > 20) {
			this.strength = 20;
		}



	}

}