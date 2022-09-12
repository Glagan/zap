<script lang="ts">
	import notifications from '$lib/stores/notifications';
	import deepAssign from '$lib/utils/deepAssign';
	import type { Notification, AnimationDefinition, Button, Theme, Options } from '$lib/types';
	import '../zap.css';

	export let notification: Notification;
	const options: Options = notification.options!;

	let inserting = true;
	let retire = false;
	let showProgressBar = !options.sticky;
	let doExtinguish = false;

	function repaint() {
		notification = notification;
	}

	function onAnimation(event: AnimationEvent) {
		if (event.animationName == options.removeAnimation.name) {
			destroy(false);
		} else if (event.animationName == options.insertAnimation.name) {
			inserting = false;
			if (showProgressBar) {
				// Set the time before removing the notification
				if (document.hasFocus()) {
					doExtinguish = true;
				} else {
					// Start the extinguish animation only when the page is focused
					const addFocusExtinguish = () => {
						doExtinguish = true;
						document.removeEventListener('focus', addFocusExtinguish);
					};
					document.addEventListener('focus', addFocusExtinguish);
				}
			}
		} else if (event.animationName == 'shorten') {
			retire = true;
			if (options.events?.onDeath) {
				(async () => {
					await options.events.onDeath(notification);
					repaint();
				})();
			} else {
				disableButtons();
				close();
			}
		}
	}

	export function destroy(fromUser = false) {
		notifications.remove(notification.id);
		if (options.events?.onClose) {
			options.events.onClose(notification, fromUser);
		}
	}

	let closing = false;
	let addRemoveClass = false;
	export function close() {
		// Add the fadeout animation
		closing = true;
		addRemoveClass = true;
	}

	// Pause and reset fadeout on hover

	function onHover() {
		if (closing) {
			addRemoveClass = false;
		}
		// Reset notification duration when hovering
		if (!inserting && !options.sticky && options.pauseOnHover) {
			doExtinguish = false;
		}
	}

	function onLeave() {
		if (closing) {
			addRemoveClass = true;
		}
		if (!inserting && !options.sticky && options.pauseOnHover) {
			doExtinguish = true;
		}
	}

	let buttonsDisabled = false;
	export function disableButtons() {
		buttonsDisabled = true;
	}
	export function removeButtons() {
		notification.buttons = [];
	}

	notification.disableButtons = disableButtons;
	notification.removeButtons = removeButtons;
	notification.close = close;
	notification.destroy = destroy;
	notification.repaint = repaint;

	if (options.events?.onCreate) {
		options.events.onCreate(notification);
	}
</script>

<div
	class={`zap-notification zap-${notification.theme} zap-${options.position}`}
	class:zap-insert={inserting}
	class:zap-remove={addRemoveClass}
	class:zap-close-on-click={options.closeOnClick}
	style={inserting
		? `animation-name: ${options.insertAnimation.name}; animation-duration: ${options.insertAnimation.duration}ms`
		: addRemoveClass
		? `animation-name: ${options.removeAnimation.name}; animation-duration: ${options.removeAnimation.duration}ms`
		: undefined}
	title={options.closeOnClick ? 'Click to close.' : undefined}
	on:animationend={onAnimation}
	on:click={options.closeOnClick ? destroy.bind(null, true) : undefined}
	on:mouseenter={onHover}
	on:mouseleave={onLeave}
	{...$$restProps}
>
	{#if notification.title}
		<h1 title={notification.title}>
			{notification.title}
			{#if options.closeOnClick}
				<span title="Click to close." class="zap-close zap-close-title">❌</span>
			{/if}
		</h1>
	{/if}
	{#if !notification.title && options.closeOnClick}
		<span title="Click to close." class="zap-close" on:click={destroy.bind(null, false)}>❌</span>
	{/if}
	{#if notification.image || notification.message}
		<div class="zap-content">
			{#if notification.image}
				<img src={notification.image} alt={notification.imageAlt} />
			{/if}
			{#if notification.message}
				<div class="zap-text">{notification.message}</div>
			{/if}
		</div>
	{/if}
	{#if notification.buttons && notification.buttons.length > 0}
		<div class="zap-buttons">
			{#each notification.buttons as button}
				<button
					class={`zap-button zap-${button.type}`}
					disabled={buttonsDisabled}
					on:click={button.onClick ? button.onClick.bind(null, notification) : undefined}
				>
					{button.value}
				</button>
			{/each}
		</div>
	{/if}
	{#if showProgressBar}
		<span
			class="zap-lifespan"
			class:zap-extinguish={doExtinguish}
			class:zap-retire={retire}
			style={`animation-duration: ${options.duration}ms`}
		/>
	{/if}
</div>
