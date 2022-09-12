export function copyArray(array: unknown[]): unknown[] {
	return array.map((element) => {
		if (element != null && typeof element === 'object') {
			if (Array.isArray(element)) {
				return copyArray(element);
			} else {
				return deepAssign({}, element);
			}
		}
		return element;
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepAssign(target: Record<string, any>, ...objs: Record<string, any>[]) {
	for (let i = 0, max = objs.length; i < max; i++) {
		for (const k in objs[i]) {
			if (objs[i][k] != null && typeof objs[i][k] == 'object') {
				if (Array.isArray(objs[i][k])) {
					target[k] = copyArray(objs[i][k]);
				} else {
					target[k] = deepAssign(target[k] ? target[k] : {}, objs[i][k]);
				}
			} else {
				target[k] = objs[i][k];
			}
		}
	}
	return target;
}
