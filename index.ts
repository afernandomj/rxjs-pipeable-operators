import { from } from 'rxjs';

const observables$ = from([1, 2, 3, 4, 5]);

const subscriber = {
	next: (value) => {
		console.log(value);
	},
	complete: () => {
		console.log('done!');
	},
	error: (value) => {
		console.log(value);
	},
};

observables$.subscribe(subscriber);
