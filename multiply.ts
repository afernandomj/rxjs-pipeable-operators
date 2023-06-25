import { map } from 'rxjs/operators';

export const multiply = (number: number) =>
	map((value: number) => value * number);
