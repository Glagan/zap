import { writable } from 'svelte/store';
import type { Position } from '$lib/types.js';

export const wrappers = (() => {
	const wrappers: Position[] = [];
	const { subscribe, set, update } = writable<Position[]>(wrappers);

	return {
		subscribe,
		set,
		update,
		make: async (position: Position) => {
			if (wrappers.indexOf(position) < 0) {
				wrappers.push(position);
				set(wrappers);
			}
		}
	};
})();
export default wrappers;
