import { Fa, sizes, colors, pulls, dirs, flips } from './fa';
import { StackFa } from './stack-fa';
const { escape } = require('markdown-it-regexp/lib/utils');

function add2target(seg: string[], fa: Fa) {
	fa.name = seg.shift();
	seg.forEach(tag => {
		switch (tag) {
			case 'border':
			case 'spin':
			case 'fw':
			case 'inverse':
				fa[tag] = true;
				break;
			default:
				if (~colors.indexOf(tag)) {
					fa.color = tag;
				} else if (~sizes.indexOf(tag)) {
					fa.size = tag;
				} else if (~pulls.indexOf(tag)) {
					fa.pull = tag;
				} else if (~dirs.indexOf(+tag)) {
					fa.dir = +tag;
				} else if (tag in flips) {
					fa.flip = tag;
				}
		}
	});
}

export function parse(str: string): StackFa {
	// ban--danger---camera---x
	let raw: string = escape(str);
	let segs = raw.split(/\-{3,}/).filter(seg => seg).map(seg => seg && seg.split('--')).slice(0, 3);

	let stack = new StackFa();
	stack.front = new Fa();
	switch (segs.length) {
		case 3:
			segs[2].forEach(tag => {
				if (tag === 'x') {
					stack.xfb = true;
				}
			});
		case 2:
			stack.back = new Fa();
			add2target(segs[1], stack.front);
		case 1:
			add2target(segs[0], stack.back || stack.front);
			return stack;
	}
	stack = new StackFa();
	stack.raw = raw;
	return stack;
}

export function format(src: string): string {
	return parse(src).text();
}
