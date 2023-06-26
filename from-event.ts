import { Observable, Subscriber, fromEvent, of } from 'rxjs';
import { delay, mergeMap, scan, takeUntil } from 'rxjs/operators';

class MyConcatMapSubscriber extends Subscriber<any> {
	innerSubscription: any;
	buffer: Array<any> = [];

	constructor(sub: Subscriber<any>, private fn: any) {
		super(sub);
		this.fn = fn;
	}

	_next(value: any): void {
		console.log(`outer ${value}`);
		const { isStopped } = this.innerSubscription || { isStopped: true };

		if (!isStopped) {
			this.buffer = [...this.buffer, value];
		} else {
			const o$ = this.fn(value);

			this.innerSubscription = o$.subscribe({
				next: (value: any) => {
					this.destination.next && this.destination.next(value);
				},
				complete: () => {
					console.log(this.buffer);
					if (this.buffer.length) {
						const [first, ...rest] = this.buffer;
						this.buffer = rest;
						this.next(first);
					}
				},
			});
			this.add(this.innerSubscription);
		}
	}
}

const myConcatMap = (fn: any) => (source: Observable<any>) =>
	source.lift({
		call(sub, source) {
			source.subscribe(new MyConcatMapSubscriber(sub, fn));
		},
	});

const observable$ = fromEvent(document, 'click').pipe(
	scan((i) => i + 1, 0),
	// mergeMap((value) => of(value).pipe(delay(500)))
	myConcatMap((value: any) => of(value).pipe(delay(500))),
	takeUntil(fromEvent(document, 'keydown')) // stop concatMap if press a key event
);

const subscriber = {
	next: (value: any) => {
		console.log(value);
	},
	complete: () => {
		console.log('done!');
	},
	error: (value: any) => {
		console.log(value);
	},
};

observable$.subscribe(subscriber);
