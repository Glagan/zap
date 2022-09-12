import { get, writable } from 'svelte/store';
import type { Notification, NotificationContent, Options, Theme } from '$lib/types';
import zapOptions from './zapOptions';
import { wrappers } from './wrappers';
import deepAssign from '$lib/utils/deepAssign';

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
			options = deepAssign({}, get(zapOptions));
		} else {
			options = deepAssign({}, get(zapOptions), options);
		}

		if (options.removeAllOnDisplay) {
			notifications.length = 0;
			for (const notification of notifications) {
				notification.destroy();
			}
		} else if (options.maxNotifications && notifications.length > options.maxNotifications) {
			const diff = -(options.maxNotifications - (notifications.length + 1));
			if (diff > 0) {
				for (let i = 0, max = diff; i < max; i++) {
					notifications[i].destroy();
				}
			}
		}

		if (!options.insertAnimation) {
			options.insertAnimation = { ...get(zapOptions).insertAnimation };
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
				case 'top-center':
					options.insertAnimation.name = 'insert-top';
					break;
				case 'bottom-center':
					options.insertAnimation.name = 'insert-bottom';
					break;
			}
		}

		if (!options.removeAnimation) {
			options.removeAnimation = { ...get(zapOptions).removeAnimation };
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

		wrappers.make(notification.options?.position ?? get(zapOptions).position);
		notifications.push(notification);
		set(notifications);
		return notification;
	};

	const push = (notification: Omit<Notification, 'id'>) => {
		wrappers.make(notification.options?.position ?? get(zapOptions).position);
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
		custom(
			classes: string[],
			content: NotificationContent,
			options?: Partial<Options>
		): Notification {
			return create('custom', { classes, ...content }, options);
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
export default notifications;
