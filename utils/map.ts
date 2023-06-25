import { Observable, Subscriber } from 'rxjs';

class MapSubscriber extends Subscriber<number> {
	constructor(sub: Subscriber<number>, private fn: any) {
		super(sub);
		this.fn = fn;
	}
	_next(value: number): void {
		this.destination.next && this.destination.next(this.fn(value));
	}
}

export const map = (fn: any) => (source: Observable<number>) =>
	source.lift({
		call(sub: Subscriber<number>, source: Observable<number>) {
			source.subscribe(new MapSubscriber(sub, fn));
		},
	});
