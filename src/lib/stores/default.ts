import type { Options } from '$lib/types';
import { writable } from 'svelte/store';

export const defaultOptions = writable<Options>({
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
});
