import { Observable, Subscriber, fromEvent, of } from 'rxjs';
import { delay, mergeMap, scan } from 'rxjs/operators';

class MySwitchMapSubscriber extends Subscriber<any> {
	innerSubscription: any;

	constructor(sub: Subscriber<any>, private fn: any) {
		super(sub);
		this.fn = fn;
	}

	_next(value: any): void {
		console.log(`outer ${value}`);
		const o$ = this.fn(value);

		// removing this, turn this class into a mergemap
		if (this.innerSubscription) {
			// this will cancel previous inner values called,
			// and only shows the last inner value that was called.
			this.innerSubscription.unsubscribe();
		}

		this.innerSubscription = o$.subscribe({
			next: (value: any) => {
				console.log(`inner ${value}`);
				this.destination.next && this.destination.next(value);
			},
		});
	}
}

const mySwitchMap = (fn: any) => (source: Observable<any>) =>
	source.lift({
		call(sub, source) {
			source.subscribe(new MySwitchMapSubscriber(sub, fn));
		},
	});

const observable$ = fromEvent(document, 'click').pipe(
	scan((i) => i + 1, 0),
	// mergeMap((value) => of(value).pipe(delay(500)))
	mySwitchMap((value: any) => of(value).pipe(delay(500)))
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
