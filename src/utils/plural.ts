// "1 note", "5 notes".
export const pluralize = (n: number, one: string, many: string = `${one}s`): string =>
  n === 1 ? one : many;

export const notesLabel = (n: number) => `${n} ${pluralize(n, "note")}`;
