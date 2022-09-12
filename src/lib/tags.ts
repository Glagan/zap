import type { TagDescription } from '$lib/types';

export const tags: Record<string, TagDescription> = {
	code: {
		type: 'code',
		class: 'zap-code',
		open: '``',
		close: '``',
		textContent: '$content'
	},
	header2: {
		type: 'h2',
		class: 'zap-header',
		open: '## ',
		close: '\n'
	},
	header1: {
		type: 'h1',
		class: 'zap-header',
		open: '# ',
		close: '\n'
	},
	image: {
		type: 'img',
		title: true,
		attributes: {
			src: '$content',
			title: '$title'
		},
		textContent: false,
		open: '![',
		close: ']'
	},
	link: {
		type: 'a',
		title: true,
		attributes: {
			href: '$content',
			target: 'blank',
			title: '$title'
		},
		textContent: '$title',
		open: '{{',
		close: '}}'
	},
	color: {
		type: 'span',
		title: true,
		attributes: { class: '$title' },
		textContent: '$content',
		open: '__',
		close: '__'
	},
	bold: {
		type: 'span',
		class: 'zap-bold',
		open: '**',
		close: '**'
	},
	floatRight: {
		type: 'span',
		class: 'zap-float-right',
		open: '>*>',
		close: '<'
	},
	italic: {
		type: 'span',
		class: 'zap-italic',
		open: '*',
		close: '*'
	},
	separator: {
		type: 'div',
		class: 'zap-separator',
		textContent: false,
		open: '\n---\n',
		close: ''
	},
	linejump: {
		type: 'br',
		textContent: false,
		open: '\n',
		close: ''
	}
};

export function addTag(name: string, tag: TagDescription) {
	tags[name] = tag;
}
