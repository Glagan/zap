// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepAssign(target: Record<string, any>, ...objs: Record<string, any>[]) {
	for (let i = 0, max = objs.length; i < max; i++) {
		for (const k in objs[i]) {
			if (objs[i][k] != null && typeof objs[i][k] == 'object')
				target[k] = deepAssign(target[k] ? target[k] : {}, objs[i][k]);
			else target[k] = objs[i][k];
		}
	}
	return target;
}
