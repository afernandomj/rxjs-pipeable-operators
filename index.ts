import { from, Observable, Subscriber } from 'rxjs';

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

class DoubleSubscriber extends Subscriber<number> {
	_next(value: number): void {
		console.log('DoubleSubscriber', value); // 1, 2, 3, 4, 5
		this.destination.next && this.destination.next(value * 2); // 2, 4, 6, 8, 10
	}
}

observables$
	.pipe((source) => {
		// don't do this for production environments.
		// this is only for educational purposes.
		const o$ = new Observable<number>();
		o$.source = source;
		o$.operator = {
			call(sub, source) {
				source.subscribe(new DoubleSubscriber(sub));
			},
		};
		return o$;
	})
	.subscribe(subscriber);
