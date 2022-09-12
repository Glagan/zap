<script lang="ts">
	import { defaultOptions } from '$lib/stores/default';
	import { notifications } from '$lib/stores/notifications';
	import { deepAssign } from '$lib/utils/deepAssign';
	import type { Notification, AnimationDefinition, Button, Theme, Options } from '$lib/types';
	import '../zap.css';

	export let notification: Notification;
	const { theme, title, message, image, imageAlt, buttons } = notification;
	const options: Options = notification.options!;

	let inserting = true;
	let retire = false;
	let showProgressBar = !options.sticky;
	let doExtinguish = false;

	function onAnimation(event: AnimationEvent) {
		if (event.animationName == options.removeAnimation.name) {
			close(false);
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
				/// @ts-expect-error
				options.events.onDeath(this);
			} else {
				disableButtons();
				closeAnimated();
			}
		}
	}

	export function close(fromUser = false) {
		/// @ts-expect-error
		notifications.remove(notification.id);
		if (options.events?.onClose) {
			/// @ts-expect-error
			options.events.onClose(this, fromUser);
		}
	}

	let closing = false;
	let addRemoveClass = false;
	export function closeAnimated() {
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

	let buttonsDisabled = true;
	export function disableButtons() {
		buttonsDisabled = false;
	}
	let showButtons = true;
	export function removeButtons() {
		showButtons = false;
	}

	if (options.events?.onCreate) {
		options.events.onCreate(this);
	}
</script>

<div
	class={`zap-notification zap-${theme} zap-${options.position}`}
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
	on:click={options.closeOnClick ? close.bind(null, true) : undefined}
	on:mouseenter={onHover}
	on:mouseleave={onLeave}
	{...$$restProps}
>
	{#if title}
		<h1 {title}>
			{title}
			{#if options.closeOnClick}
				<span title="Click to close." class="zap-close zap-close-title">❌</span>
			{/if}
		</h1>
	{/if}
	{#if !title && options.closeOnClick}
		<span title="Click to close." class="zap-close" on:click={close.bind(null, false)}>❌</span>
	{/if}
	{#if image || message}
		<div class="zap-content">
			{#if image}
				<img src={image} alt={imageAlt} />
			{/if}
			{#if message}
				<div class="zap-text">{message}</div>
			{/if}
		</div>
	{/if}
	{#if showButtons && buttons && buttons.length > 0}
		<div class="zap-buttons">
			{#each buttons as button}
				<button
					class={`zap-button zap-${button.type}`}
					disabled={buttonsDisabled}
					on:click={button.onClick ?? undefined}
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
			style={`animation-duration: ${options.duration}ms`}
		/>
	{/if}
</div>

<style>
	.zap-notification {
		flex-shrink: 0;
		font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial,
			sans-serif;
		box-shadow: 1px 1px 3px black;
		border-radius: 3px;
		overflow: hidden;
		margin: 1rem;
		cursor: default;
		pointer-events: all;
		min-width: 10rem;
		max-width: 25rem;
		position: relative;
		transition: background-color 0.2s ease-in-out;
	}

	.zap-insert {
		animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
		animation-fill-mode: forwards;
	}

	.zap-close-on-click {
		cursor: pointer;
	}
	.zap-close {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 1rem;
		padding: 0.5rem;
		border-left: 1px solid rgba(0, 0, 0, 0.4);
		border-bottom: 1px solid rgba(0, 0, 0, 0.4);
		border-bottom-left-radius: 3px;
		background: rgba(0, 0, 0, 0.2);
		opacity: 0;
		transition: all 100ms ease-in;
		cursor: pointer;
		user-select: none;
		-moz-user-select: none;
	}
	.zap-notification:hover .zap-close {
		opacity: 1;
	}
	.zap-close:hover {
		background: rgba(0, 0, 0, 0.6);
	}
	.zap-close.zap-close-title {
		display: flex;
		align-items: center;
		bottom: 0;
		border-bottom: 0;
		border-bottom-left-radius: 0;
	}

	.zap-notification > h1 {
		background-color: rgba(0, 0, 0, 0.2);
		border-bottom: 1px solid rgba(0, 0, 0, 0.4);
		overflow: hidden;
		text-overflow: ellipsis;
		position: relative;
	}
	.zap-remove {
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	.zap-lifespan {
		display: block;
		height: 3px;
		width: 100%;
		background-color: #4dd0e1;
		transition: height 0.4s ease-in-out, width 0s linear;
	}
	.zap-extinguish {
		animation-duration: 1000ms;
		animation-name: shorten;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	.zap-lifespan.zap-retire {
		height: 0px;
	}

	.zap-success {
		background-color: #689f38;
		color: white;
	}
	.zap-info {
		background-color: #0288d1;
		color: white;
	}
	.zap-error {
		background-color: #b42f2d;
		color: white;
	}
	.zap-warning {
		background-color: #d87a00;
		color: white;
	}
	.zap-message {
		background-color: #333333;
		color: white;
	}

	.zap-content {
		display: flex;
		flex: 1;
		align-content: space-between;
		align-items: center;
	}
	.zap-content > img {
		max-width: 30%;
		max-height: 20rem;
		flex-shrink: 0;
		display: inline-block;
	}
	.zap-content .zap-text {
		max-width: 100%;
		word-break: break-word;
	}
	.zap-content > img:only-child,
	.zap-content .zap-text:only-child {
		max-width: 100%;
	}
	.zap-notification > h1,
	.zap-content .zap-text {
		padding: 0.5rem;
		margin: 0;
		width: 100%;
	}

	.zap-content .zap-text a {
		color: rgba(255, 255, 255, 0.8);
		transition: all 0.2s ease-in-out;
	}
	.zap-content .zap-text a:hover {
		text-shadow: 1px 0 1px rgba(255, 255, 255, 0.8);
		border-radius: 2px;
	}
	.zap-content .zap-text h1,
	.zap-content .zap-text h2 {
		margin: 0.5rem 0;
	}
	.zap-content .zap-text h1 {
		font-size: 1.2rem;
	}
	.zap-content .zap-text h2 {
		font-size: 1.1rem;
	}
	.zap-content .zap-text img {
		height: auto;
		max-width: 100%;
		margin: 0.1rem 0;
	}
	.zap-bold {
		font-weight: bold;
	}
	.zap-italic {
		font-style: italic;
	}
	.zap-code {
		font-family: SFMono-Regular, Menlo, 'Lucida Console', Monaco, Consolas, 'Liberation Mono',
			'Courier New', monospace;
		padding: 0.1rem 0.2rem;
		background-color: #333333;
		color: #f7f7f7;
		line-height: 1.4;
		border-radius: 2px;
		box-shadow: 0 0 1px #333333;
	}
	.zap-message .zap-code {
		background-color: #4d4d4d;
		box-shadow: 0 0 1px #4d4d4d;
	}
	.zap-separator {
		display: block;
		width: 100%;
		border-bottom: 1px solid white;
		border-radius: 4px;
		height: 2px;
		line-height: 0px;
		margin: 0.75rem 0;
	}

	.zap-buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: stretch;
		align-items: stretch;
		align-content: stretch;
		text-align: center;
		border-top: 1px solid rgba(0, 0, 0, 0.4);
	}
	.zap-button {
		width: 100%;
		padding: 0.5rem;
		border: 0;
		cursor: pointer;
		border-right: 1px solid rgba(0, 0, 0, 0.4);
		transition: all 0.1s ease-in;
		font-size: 1rem;
	}
	.zap-button:hover {
		background: rgba(0, 0, 0, 0.6);
	}
	.zap-button:disabled {
		background: rgba(0, 0, 0, 0.6);
		filter: grayscale(60%);
	}
	.zap-button:last-child {
		border-right: 0;
	}
	.zap-float-right {
		float: right;
	}
</style>
