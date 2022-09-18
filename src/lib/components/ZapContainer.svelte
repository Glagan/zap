<script lang="ts">
	import notifications from '$lib/stores/zap.js';
	import wrappers from '$lib/stores/wrappers.js';
	import Notification from '$lib/components/Notification.svelte';
	import zapOptions from '$lib/stores/zapOptions.js';
</script>

{#each $wrappers as wrapper}
	{@const positionNotifications = $notifications.filter(
		(notification) => (notification.options?.position ?? $zapOptions.position) === wrapper
	)}
	<div class={`zap-wrapper zap-${wrapper}`}>
		{#each positionNotifications as notification (notification.id)}
			<Notification {notification} />
		{/each}
	</div>
{/each}
