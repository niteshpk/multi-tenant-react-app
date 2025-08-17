export function hasPerm(userPerms: string[], needed: string | string[]) {
  const req = Array.isArray(needed) ? needed : [needed];
  const set = new Set(userPerms);
  return req.every((p) => set.has(p));
}
