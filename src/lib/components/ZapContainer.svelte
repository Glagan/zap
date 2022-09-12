<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { wrappers } from '$lib/stores/wrappers';
	import Notification from '$lib/components/Notification.svelte';
	import { defaultOptions } from '$lib/stores/default';
</script>

{#each $wrappers as wrapper}
	{@const positionNotifications = $notifications.filter(
		(notification) => (notification.options?.position ?? $defaultOptions.position) === wrapper
	)}
	<div class={`zap-wrapper zap-${wrapper}`}>
		{#each positionNotifications as notification (notification.id)}
			<Notification {notification} />
		{/each}
	</div>
{/each}

<style>
	.zap-wrapper {
		position: fixed;
		pointer-events: none;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		z-index: 1080;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.zap-top-right,
	.zap-bottom-right {
		align-items: flex-end;
	}
	.zap-bottom-right {
		justify-content: flex-end;
	}

	.zap-top-left,
	.zap-bottom-left {
		align-items: flex-start;
	}
	.zap-bottom-left {
		justify-content: flex-end;
	}

	.zap-top-center,
	.zap-bottom-center {
		align-items: center;
	}
	.zap-top-center {
		justify-content: flex-start;
	}
	.zap-bottom-center {
		justify-content: flex-end;
	}
</style>
