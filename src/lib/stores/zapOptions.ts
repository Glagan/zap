import { writable } from 'svelte/store';
import type { Options } from '$lib/types.js';
import deepAssign from '$lib/utils/deepAssign.js';

export const zapOptions = (() => {
	const options: Options = {
		position: 'top-right',
		maxNotifications: 0,
		removeAllOnDisplay: false,
		pauseOnHover: true,
		closeOnClick: true,
		closeButton: true,
		duration: 3000,
		sticky: false,
		events: {
			onCreate: undefined,
			onDisplay: undefined,
			onDeath: undefined,
			onClose: undefined
		},
		insertAnimation: {
			name: 'default-insert',
			duration: 250
		},
		removeAnimation: {
			name: 'fadeout',
			duration: 400
		}
	};
	const { subscribe, set, update } = writable<Options>(options);

	return {
		subscribe,
		set,
		update,
		setDefault(newOptions: Partial<Options>) {
			deepAssign(options, newOptions);
		}
	};
})();
export default zapOptions;
