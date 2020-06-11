export class Ai {

	constructor (
		public input: number[],
		public output: number[],
		public dna?
	) {

		if (!this.dna) {
			this.dna = [[],[],[],[]];


			// neuron per input
			for (const input of this.input) {
				const neuron = {
					inputs: [],
					output: 0
				}

				let i = 0;
				for (const input2 of this.input) {
					neuron.inputs.push({
						i,
						w: (Math.random() - 0.5)
					})
					i++;
				}



				this.dna[0].push(neuron);
			}

			for (const input of this.input) {
				const neuron = {
					inputs: [],
					output: 0
				}

				let i = 0;
				for (const input2 of this.input) {
					neuron.inputs.push({
						i,
						w: (Math.random() - 0.5)
					})
					i++;
				}



				this.dna[1].push(neuron);
			}

			for (const input of this.input) {
				const neuron = {
					inputs: [],
					output: 0
				}

				let i = 0;
				for (const input2 of this.input) {
					neuron.inputs.push({
						i,
						w: (Math.random() - 0.5)
					})
					i++;
				}



				this.dna[2].push(neuron);
			}

			// neuron per output
			for (const output of this.output) {
				const neuron = {
					inputs: [],
					output: 0
				}

				let i = 0;
				for (const input of this.input) {
					neuron.inputs.push({
						i,
						w: (Math.random() - 0.5)
					})
					i++;
				}



				this.dna[3].push(neuron);
			}
		}

	}


	update() {
		let depth = 0;
		for (const lvl of this.dna) {
			if (depth === 0) {
				// use input
				for (const neuron of lvl) {
					let sum = 0;
					for (const neuronInput of neuron.inputs) {
						sum += this.input[neuronInput.i] * neuronInput.w;
					}

					// use a cool activation function later
					neuron.output = Math.tanh(sum);
				}
			} else {
				let n = 0;
				for (const neuron of lvl) {

					let sum = 0;
					for (const neuronInput of neuron.inputs) {
						sum += this.dna[depth -1][neuronInput.i].output * neuronInput.w;
					}

					// use a cool activation function later
					neuron.output = Math.tanh(sum);

					if (depth === this.dna.length -1) {
						// write neuronOutput to ai output
						this.output[n] = neuron.output * 10;
					}
					n++;
				}
			}
			depth++;
		}
	}

	mutate(rate: number, strength: number) {
		let w = []
		let depth = 0;
		for (const lvl of this.dna) {
			// use input
			for (const neuron of lvl) {

				for (const neuronInput of neuron.inputs) {
					if (Math.random() < rate) {
						neuronInput.w = ((Math.random() - 0.5) + neuronInput.w * (strength - 1)) / strength;
					}

					w.push(neuronInput.w.toFixed(2));
				}
			}
			depth++;
		}
	}
}