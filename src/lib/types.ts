export type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type Theme = 'success' | 'info' | 'error' | 'warning' | 'message';

export type Notification = { id: number } & Partial<{
	theme: Theme;
	title: string;
	message: string;
	image: string;
	imageAlt: string;
	buttons: Button[];
	options: Partial<Options>;
}>;

export type NotificationContent = Partial<{
	title: string;
	message: string;
	image: string;
	imageAlt: string;
	buttons: Button[];
}>;

export type InsertAnimation =
	| 'default-insert'
	| 'insert-left'
	| 'insert-right'
	| 'insert-top'
	| 'insert-bottom'
	| 'fadein'
	| 'scalein'
	| 'rotatein';
export type RemoveAnimation = 'fadeout' | 'scaleout' | 'rotateout';

export type AnimationDefinition<T> = {
	name: T;
	duration?: number;
};

export type eventCallback = (notification: Notification) => void;
export type Events = {
	onCreate?: eventCallback;
	onDisplay?: eventCallback;
	onDeath?: eventCallback;
	onClose?: (notification: Notification, fromUser: boolean) => void;
};

export type Type = 'success' | 'info' | 'error' | 'warning' | 'message';
export type Button = {
	type?: Type;
	value?: string;
	onClick?: eventCallback;
};

export interface Content {
	image?: string;
	text?: string;
	title?: string;
	buttons?: Button[];
}

export interface TagDescription {
	type: string;
	class: string;
	open: string;
	close: string;
	attributes: { textContent: string | boolean } & { [key: string]: string };
	textContent: string;
}

export interface Options {
	position: Position;
	maxNotifications: number;
	removeAllOnDisplay: boolean;
	pauseOnHover: boolean;
	closeOnClick: boolean;
	closeButton: boolean;
	duration: number;
	sticky: boolean;
	events: Partial<Events>;
	insertAnimation: AnimationDefinition<InsertAnimation>;
	removeAnimation: AnimationDefinition<RemoveAnimation>;
}
