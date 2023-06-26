import { pipe } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export const multiply = (number: number) =>
	pipe(
		map((value: number) => value * number),
		filter((value: number) => value < 10)
	);
