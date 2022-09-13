<script lang="ts">
	import ZapContainer from '$lib/components/ZapContainer.svelte';
	import zap from '$lib/stores/zap';
	import type { NotificationContent, Options, Position, Theme, Type } from '$lib/types';
	import deepAssign from '$lib/utils/deepAssign';
	import '../app.css';

	export const prerender = true;

	let type: Theme = 'success';

	const content: NotificationContent = {
		title: '',
		image: '',
		message: ''
	};

	const options: Partial<Options> = {
		position: 'top-right',
		pauseOnHover: true,
		closeOnClick: true,
		sticky: false,
		insertAnimation: {
			name: 'default-insert',
			duration: 250
		},
		duration: 3000,
		removeAnimation: {
			name: 'fadeout',
			duration: 400
		}
	};
	let insertAnimation = options.insertAnimation!;
	let removeAnimation = options.removeAnimation!;

	const quickButtons: { type: Theme; name: string; bg: string }[] = [
		{ type: 'success', name: 'Success', bg: 'bg-green-600' },
		{ type: 'info', name: 'Info', bg: 'bg-blue-600' },
		{ type: 'error', name: 'Error', bg: 'bg-red-600' },
		{ type: 'warning', name: 'Warning', bg: 'bg-yellow-600' },
		{ type: 'message', name: 'Message', bg: 'bg-gray-800' },
		{ type: 'custom', name: 'Custom', bg: 'bg-indigo-200' }
	];

	let currentExample = 0;
	const examples: { content: NotificationContent; options?: Partial<Options> }[] = [
		{
			content: {
				title: 'Title',
				message: 'Content'
			}
		},
		{
			content: {
				title: 'Multi-line',
				message: 'Can be multi-line !\nLike this.'
			}
		},
		{
			content: {
				title: 'With Style !',
				message:
					'Text can be *styled* **easily**, contain {{links|https://zap.nikurasu.org/}} and even ``code`` !'
			}
		},
		{
			content: {
				message: "This notification doesn't have a title ! Crazy !"
			}
		},
		{
			content: {
				title: 'Headers',
				message: '# First Header\n## *Second* header\n'
			}
		},
		{
			content: {
				title: 'Forest',
				image: 'https://www.publicdomainpictures.net/pictures/100000/velka/forest-1411400424AOk.jpg'
			}
		},
		{
			content: {
				title: 'Custom Tags',
				message:
					'You can also easily __add__ your own style with ``zap.addTag()``.\nSee {{!https://github.com/Glagan/zap#text-tag}} to know how.'
			}
		},
		{
			content: {
				title: 'Image and Separator',
				message:
					'![You can also have other images|https://oauth.net/images/code/javascript.png]\n---\nAnd you can separate content.'
			}
		},
		{
			content: {
				message: 'You have to choose an action to close this notification',
				buttons: [
					{
						value: 'Open',
						type: 'success',
						onClick: () => {
							zap.success(
								{
									title: 'Another One !',
									message: 'You opened another notification without closing the old one.'
								},
								{ position: 'top-left', insertAnimation: { name: 'scalein' } }
							);
						}
					},
					{
						value: 'Close',
						type: 'error',
						onClick: (notification) => {
							zap.message(
								{
									title: 'Closing...',
									message:
										'The other notification will close with a fadeout thanks to ``notification.close()``.'
								},
								{ position: 'bottom-right', insertAnimation: { name: 'rotatein' } }
							);
							notification.close();
						}
					}
				]
			},
			options: { sticky: true, closeOnClick: false }
		},
		{
			content: {
				title: 'Click fast',
				message: 'You have to be fast to click the button on this one.',
				buttons: [
					{
						value: 'Click me',
						type: 'info',
						onClick: (notification) => {
							zap.success(
								{
									title: 'Nice',
									message: 'You did it **:)**'
								},
								{ position: 'top-left' }
							);
							notification.close();
						}
					}
				]
			},
			options: {
				duration: 1000,
				events: {
					onDeath: (notification) => {
						notification.disableButtons();
						notification.theme = 'info';
						if (notification.buttons && notification.buttons.length > 0) {
							notification.buttons[0].value = 'Disabled';
						}
						notification.title = 'Gotta go faster';
						notification.message =
							"Buttons can be **disabled** after the timer expired.\nYou can also choose to hide the notification, or change a lot of it's content.";
					}
				}
			}
		},
		{
			content: {
				title: 'Modify after death',
				message:
					"This notification will be updated after it's *death* with nice buttons.\nLet it die to see it."
			},
			options: {
				closeOnClick: false,
				duration: 2000,
				events: {
					onDeath: (notification) => {
						if (!notification.options) {
							notification.options = {};
						}
						if (!notification.options.events) {
							notification.options.events = {};
						}
						notification.options.events.onDeath = undefined;
						notification.removeButtons();
						notification.theme = 'message';
						if (!notification.buttons) {
							notification.buttons = [];
						}
						notification.buttons.push({
							type: 'error',
							value: 'Close',
							onClick: (notification) => {
								notification.close();
							}
						});
						notification.message = 'You can now click on the button to close this notification.';
					}
				}
			}
		}
	];

	function exampleNotification(type: Theme, position: Position) {
		const example = deepAssign({}, examples[currentExample]!);
		const options: Partial<Options> = example.options ?? {};
		options.position = position;
		if (type == 'custom') {
			zap.custom(['zap-custom'], example.content, options);
		} else {
			zap[type](example.content, options);
		}
		currentExample = ++currentExample % examples.length;
	}

	function submitForm() {
		if (content.title || content.image || content.message) {
			if (type == 'custom') {
				zap[type](['zap-custom'], content, options);
			} else {
				zap[type](content, options);
			}
		} else {
			zap.error({
				title: 'Missing field',
				message: 'You need to set at least a **title**, an **image** or a **message**.'
			});
		}
	}
</script>

<div class="container mx-auto w-full lg:w-3/5 p-4 pt-0">
	<div class="p-4 flex flex-row flex-nowrap justify-between items-center">
		<div>
			<a
				title="Github Repository"
				target="_blank"
				href="https://github.com/Glagan/zap"
				rel="noreferrer noopener"
			>
				<span class="inline-block w-full text-lg text-gray-400">Glagan</span>
				<span class="text-xl text-gray-200">
					zap
					<img
						class="inline-block align-middle"
						height="16"
						width="16"
						src="/github.png"
						alt="Github Logo"
					/>
				</span>
			</a>
		</div>
		<div class="hidden md:block">
			<a href="https://ko-fi.com/Y8Y32X73U" target="_blank">
				<img
					height="36"
					style="border: 0px; height: 36px"
					src="https://cdn.ko-fi.com/cdn/kofi1.png?v=2"
					alt="Buy Me a Coffee at ko-fi.com"
				/>
			</a>
		</div>
	</div>
	<div>
		<div class="overflow-hidden border-2 border-gray-400 rounded-md bg-gray-600 mb-2">
			<p class="p-2">Click on the buttons to show example notifications.</p>
			<div class="flex justify-around text-center mb-4">
				<div class="corner">
					{#each quickButtons as q}
						<button
							class={`btn ${q.bg}`}
							on:click={exampleNotification.bind(null, q.type, 'top-left')}
						>
							{q.name}
						</button>
					{/each}
				</div>
				<div class="corner">
					{#each quickButtons as q}
						<button
							class={`btn ${q.bg}`}
							on:click={exampleNotification.bind(null, q.type, 'top-right')}
						>
							{q.name}
						</button>
					{/each}
				</div>
			</div>
			<div class="flex justify-around text-center mb-4">
				<div class="corner">
					{#each quickButtons as q}
						<button
							class={`btn ${q.bg}`}
							on:click={exampleNotification.bind(null, q.type, 'bottom-left')}
						>
							{q.name}
						</button>
					{/each}
				</div>
				<div class="corner">
					{#each quickButtons as q}
						<button
							class={`btn ${q.bg}`}
							on:click={exampleNotification.bind(null, q.type, 'bottom-right')}
						>
							{q.name}
						</button>
					{/each}
				</div>
			</div>
		</div>
		<div class="overflow-hidden border-2 border-gray-400 rounded-md bg-gray-600">
			<p class="p-2">Try out all <b>zap</b> parameters !</p>
			<form class="p-2" on:submit|preventDefault={submitForm}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
					<div>
						<label for="type">Type</label>
						<select name="type" id="type" bind:value={type}>
							<option value="success">Success</option>
							<option value="info">Information</option>
							<option value="error">Error</option>
							<option value="warning">Warning</option>
							<option value="message">Message</option>
							<option value="custom">Custom</option>
						</select>
					</div>
					<div>
						<label for="position">Position</label>
						<select name="position" id="position" bind:value={options.position}>
							<option value="top-left">top-left</option>
							<option value="top-center">top-center</option>
							<option value="top-right">top-right (default)</option>
							<option value="bottom-left">bottom-left</option>
							<option value="bottom-center">bottom-center</option>
							<option value="bottom-right">bottom-right</option>
						</select>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
					<div>
						<label for="insertAnimationName">Insert Animation</label>
						<select
							name="insertAnimationName"
							id="insertAnimationName"
							bind:value={insertAnimation.name}
						>
							<option value="default-insert">default-insert (default)</option>
							<option value="insert-left">insert-left</option>
							<option value="insert-top">insert-top</option>
							<option value="insert-right">insert-right</option>
							<option value="insert-bottom">insert-bottom</option>
							<option value="fadein">fadein</option>
							<option value="scalein">scalein</option>
							<option value="rotatein">rotatein</option>
						</select>
					</div>
					<div>
						<label for="insertAnimationDuration">Insert duration (ms)</label>
						<div>
							<input
								class="input"
								type="number"
								name="insertAnimationDuration"
								id="insertAnimationDuration"
								placeholder="Duration (ms)"
								bind:value={insertAnimation.duration}
							/>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 items-center">
					<div>
						<label for="duration">Display duration (ms)</label>
						<div>
							<input
								type="number"
								name="duration"
								id="duration"
								placeholder="Duration (ms)"
								bind:value={options.duration}
							/>
						</div>
					</div>
					<div class="flex justify-center items-center">
						<label for="sticky" class="flex items-center cursor-pointer">
							<div class="px-2">Sticky</div>
							<div class="toggle-wrapper relative">
								<input id="sticky" type="checkbox" class="hidden" bind:checked={options.sticky} />
								<div class="toggle-path" />
								<div class="toggle-circle" />
							</div>
						</label>
					</div>
					<div class="flex justify-center items-center">
						<label for="closeOnClick" class="flex items-center cursor-pointer">
							<div class="px-2">Close on click</div>
							<div class="toggle-wrapper relative">
								<input
									id="closeOnClick"
									type="checkbox"
									class="hidden"
									bind:checked={options.closeOnClick}
								/>
								<div class="toggle-path" />
								<div class="toggle-circle" />
							</div>
						</label>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
					<div>
						<label for="removeAnimationName">Remove Animation</label>
						<select
							name="removeAnimationName"
							id="removeAnimationName"
							bind:value={removeAnimation.name}
						>
							<option value="fadeout">fadeout (default)</option>
							<option value="scaleout">scaleout</option>
							<option value="rotateout">rotateout</option>
						</select>
					</div>
					<div>
						<label for="removeAnimationDuration">Remove duration (ms)</label>
						<div>
							<input
								type="number"
								name="removeAnimationDuration"
								id="removeAnimationDuration"
								placeholder="Duration (ms)"
								bind:value={removeAnimation.duration}
							/>
						</div>
					</div>
				</div>
				<div
					class="py-3 px-5 mb-4 bg-blue-100 text-blue-900 text-sm rounded-md border border-blue-200"
					role="alert"
				>
					<b>Title</b>, <b>Image</b> and <b>Content</b> are all optional, but at least one must be specified.
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
					<div>
						<label for="title">Title</label>
						<input
							type="text"
							name="title"
							id="title"
							placeholder="Title"
							bind:value={content.title}
						/>
					</div>
					<div>
						<label for="image">Image</label>
						<input
							type="text"
							name="image"
							id="image"
							placeholder="Image URL"
							bind:value={content.image}
						/>
					</div>
				</div>
				<div class="mb-4">
					<label for="message">Content</label>
					<textarea
						name="message"
						id="message"
						placeholder="Notification content"
						bind:value={content.message}
					/>
				</div>
				<button type="submit" class="display">Display</button>
			</form>
		</div>
	</div>
</div>
<ZapContainer />
