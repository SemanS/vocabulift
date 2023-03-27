type AsyncFunction<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => Promise<infer R>
  ? (...args: A) => Promise<R>
  : never;

export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
): AsyncFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const debouncedFunction = async function (
    this: any,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    const context = this;
    clearTimeout(timeout);

    return new Promise<ReturnType<T>>((resolve) => {
      timeout = setTimeout(async () => {
        resolve(await func.apply(context, args));
      }, wait);
    });
  };

  return debouncedFunction as AsyncFunction<T>;
}
