import { Observable, Subscriber } from 'rxjs';

class MultiplySubscriber extends Subscriber<number> {
	constructor(sub: Subscriber<number>, private number: number) {
		super(sub);
		this.number = number;
	}
	_next(value: number): void {
		console.log('this.number', this.number);
		console.log('MultiplySubscriber', value);
		this.destination.next && this.destination.next(value * this.number);
	}
}

export const multiply = (number: number) => (source: Observable<number>) => {
	return source.lift({
		call(sub: Subscriber<number>, source: Observable<number>) {
			source.subscribe(new MultiplySubscriber(sub, number));
		},
	});
};
