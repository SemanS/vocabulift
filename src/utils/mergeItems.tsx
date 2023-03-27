export function mergeObjects<T, U>(
  primaryArray: T[],
  secondaryArray: U[],
  matchFn: (primaryItem: T, secondaryItem: U) => boolean,
  mergeFn: (primaryItem: T, secondaryItem: U) => T
): T[] {
  return primaryArray.map((primaryItem) => {
    const secondaryItem = secondaryArray.find((item) =>
      matchFn(primaryItem, item)
    );

    if (secondaryItem) {
      return mergeFn(primaryItem, secondaryItem);
    } else {
      return primaryItem;
    }
  });
}
