import { tags } from '$lib/tags';
import type { RecursiveTagString, TagDescription } from '$lib/types';

/**
 * Search the first occurence of the char occurence in text that doesn't have a \ prefix
 */
export function firstUnbreakChar(text: string, char: string, start = 0): number {
	if (start < 0) start = 0;
	let foundPos = -1;
	while (start >= 0) {
		foundPos = text.indexOf(char, start);
		if (foundPos > 0 && text[foundPos - 1] == '\\') {
			start = foundPos + 1;
		} else {
			start = -1;
		}
	}
	return foundPos;
}

/**
 * Search the first shortest occurence of token in the string array string after position start in the current string
 */
export function searchToken(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	string: any,
	token: string,
	start: [number, number]
): [number, number] {
	const found: [number, number] = [start[0], start[1]];
	for (let max = string.length; found[0] < max; found[0]++) {
		if (
			typeof string[found[0]] == 'string' &&
			(found[1] = string[found[0]].indexOf(token, found[1])) > -1
		) {
			return found;
		}
		found[1] = 0;
	}
	return [-1, -1];
}

/**
 * Break a string with a `tag` element at position start until end
 */
export function breakString(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	string: any,
	tag: TagDescription,
	start: [number, number],
	end: [number, number]
): [number, number] {
	const tagLength = { open: tag.open.length, close: tag.close.length };
	if (start[0] != end[0]) {
		const inside: RecursiveTagString = { tag: tag, str: [string[start[0]].substring(start[1])] };
		let c = 0;
		for (let i = start[0] + 1; i < end[0]; i++, c++) {
			inside.str.push(string[i]);
		}
		inside.str.push(string[end[0]].substring(0, end[1]));
		inside.str = [joinString(inside.str)];
		string.splice(start[0] + 1, c, inside);
		end[0] = start[0] + 2;
		string[start[0]] = string[start[0]].substring(0, start[1] - tagLength.open);
		string[end[0]] = string[end[0]].substring(end[1] + tagLength.close);
		return [end[0], 0];
	} else {
		string.splice(
			start[0] + 1,
			0,
			{ tag: tag, str: [string[start[0]].substring(start[1], end[1])] },
			string[start[0]].substring(end[1] + tagLength.close)
		);
		string[start[0]] = string[start[0]].substring(0, start[1] - tagLength.open);
		return [start[0] + 2, 0];
	}
}

/**
 * Recursive string array concatenation
 */
export function joinString(arr: RecursiveTagString[]) {
	const str: string[] = [];
	for (let i = 0, max = arr.length; i < max; i++) {
		const currentString = arr[i];
		if (typeof currentString == 'string') {
			str.push(currentString);
		} else {
			str.push(currentString.tag.open);
			str.push(joinString(currentString.str));
			str.push(currentString.tag.close);
		}
	}
	return str.join('');
}

/**
 * Make the node body by build each of it's childrens
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildNode(string: any, node: HTMLElement): string {
	for (let i = 0; i < string.length; i++) {
		const currentString = string[i];
		if (typeof currentString == 'string') {
			if (currentString.length > 0) {
				node.appendChild(document.createTextNode(currentString));
			}
		} else {
			const tagInfo = currentString.tag;
			const tag = document.createElement(tagInfo.type);
			if (tagInfo.type == 'a' || tagInfo.type == 'button') {
				tag.addEventListener('click', (event: { stopPropagation: () => void }) => {
					event.stopPropagation();
				});
			}
			// Content
			let title;
			let content = joinString(currentString.str);
			if ('title' in tagInfo && tagInfo.title && content.length > 0) {
				if (content.indexOf('!') == 0) {
					content = content.substring(1);
				} else {
					// find |
					const foundTitleBreak = firstUnbreakChar(content, '|');
					content = content.replace('\\|', '|');
					if (foundTitleBreak > -1) {
						title = content.substring(0, foundTitleBreak);
						content = content.substring(foundTitleBreak + 1);
					}
				}
			}
			if (title == undefined) {
				title = content;
			}
			// Set attributes
			if (tagInfo.attributes) {
				const keys = Object.keys(tagInfo.attributes);
				for (let k = 0, max = keys.length; k < max; k++) {
					const attributeValue = tagInfo.attributes[keys[k]]
						.replace('$content', content)
						.replace('$title', title);
					tag.setAttribute(keys[k], attributeValue);
				}
			}
			if (typeof tagInfo.textContent === 'string') {
				tag.textContent = tagInfo.textContent.replace('$content', content).replace('$title', title);
			} else if (tagInfo.textContent != false) {
				textToHtml(string[i].str, tag);
			}
			// Set a class if defined
			if (tagInfo.class) {
				if (Array.isArray(tagInfo.class)) {
					for (let i = 0, max = tagInfo.class.length; i < max; i++) {
						tag.classList.add(tagInfo.class[i]);
					}
				} else {
					tag.className = tagInfo.class;
				}
			}
			node.appendChild(tag);
		}
	}
	return node.innerHTML;
}

/**
 * Transform a text with tags to an html string
 * {open}{content}{close}
 * {open}{!|title|}{content}{close} | is the title/content separator
 */
export default function textToHtml(
	text: string | RecursiveTagString[],
	node = document.createElement('div')
): string | undefined {
	if (text == undefined) return;
	let string;
	if (Array.isArray(text)) {
		string = text;
	} else {
		// Normalize linebreak
		text = (text as string).replace(/(\r?\n|\r)/gm, '\n');
		string = [text];
	}
	// Break string by tokens
	const tokens = Object.keys(tags);
	for (let i = 0, last = tokens.length; i < last; i++) {
		const tag: TagDescription = tags[tokens[i]];
		const tagLength: { open: number; close: number } = {
			open: tag.open.length,
			close: tag.close.length
		};
		let continueAt: [number, number] = [0, 0];
		let openPos: [number, number] = [0, 0];
		let closePos: [number, number] = [0, 0];
		while ((openPos = searchToken(string, tag.open, continueAt))[0] > -1) {
			openPos[1] += tagLength.open;
			if ((closePos = searchToken(string, tag.close, openPos))[0] > -1) {
				continueAt = breakString(string, tag, openPos, closePos);
			} else {
				continueAt = openPos;
			}
		}
	}
	return buildNode(string, node);
}
