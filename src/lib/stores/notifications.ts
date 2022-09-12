import { get, writable } from 'svelte/store';
import type { Notification, NotificationContent, Options, Theme } from '$lib/types';
import { defaultOptions } from './default';
import { wrappers } from './wrappers';
import { deepAssign } from '$lib/utils/deepAssign';

export const notifications = (() => {
	const notifications: Notification[] = [];
	const { subscribe, set, update } = writable<Notification[]>(notifications);

	const create = (
		theme: Theme,
		content: NotificationContent,
		options?: Partial<Options>
	): Notification => {
		// Set the insert and remove animations
		if (!options) {
			options = deepAssign({}, get(defaultOptions));
		} else {
			options = deepAssign({}, get(defaultOptions), options);
		}

		if (!options.insertAnimation) {
			options.insertAnimation = { ...get(defaultOptions).insertAnimation };
		}

		if (options.insertAnimation.name == 'default-insert') {
			switch (options.position) {
				case 'top-left':
				case 'bottom-left':
					options.insertAnimation.name = 'insert-left';
					break;
				case 'top-right':
				case 'bottom-right':
					options.insertAnimation.name = 'insert-right';
					break;
				// case 'top-center':
				// 	options.insertAnimation.name = 'insert-top';
				// 	break;
				case 'bottom-center':
					options.insertAnimation.name = 'insert-bottom';
					break;
			}
		}

		if (!options.removeAnimation) {
			options.removeAnimation = { ...get(defaultOptions).removeAnimation };
		}

		/// @ts-expect-error Edge case
		if (options.insertAnimation.name == options.removeAnimation.name) {
			if (options.insertAnimation.name == 'fadeout') {
				options.removeAnimation.name = 'rotateout';
			} else {
				options.removeAnimation.name = 'fadeout';
			}
		}

		const notification = {
			id: Date.now(),
			theme,
			...content,
			options
		} as Notification;

		wrappers.make(notification.options?.position ?? get(defaultOptions).position);
		notifications.push(notification);
		set(notifications);
		return notification;
	};

	const push = (notification: Omit<Notification, 'id'>) => {
		wrappers.make(notification.options?.position ?? get(defaultOptions).position);
		notifications.push({ id: Date.now(), ...notification });
		set(notifications);
		return notification;
	};

	return {
		subscribe,
		set,
		update,
		success(content: NotificationContent, options?: Partial<Options>): Notification {
			return create('success', content, options);
		},
		info(content: NotificationContent, options?: Partial<Options>): Notification {
			return create('info', content, options);
		},
		error(content: NotificationContent, options?: Partial<Options>): Notification {
			return create('error', content, options);
		},
		warning(content: NotificationContent, options?: Partial<Options>): Notification {
			return create('warning', content, options);
		},
		message(content: NotificationContent, options?: Partial<Options>): Notification {
			return create('message', content, options);
		},
		create,
		push,
		remove(which: number) {
			const index = notifications.findIndex((notification) => notification.id == which);
			if (index >= 0) {
				notifications.splice(index, 1);
				set(notifications);
			}
		}
	};
})();
