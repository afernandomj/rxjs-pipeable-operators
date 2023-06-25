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

const double = (source: Observable<any>) =>
	source.lift({
		call(sub: Subscriber<number>, source: Observable<number>) {
			source.subscribe(new DoubleSubscriber(sub));
		},
	});

observables$.pipe(double).subscribe(subscriber);
