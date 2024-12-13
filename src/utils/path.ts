export type Path = (string | symbol | number)[];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const access = (target: any, path: Path): any => {
  let value = target;

  for (const key of path) {
    value = value[key];
  }

  return value;
};
