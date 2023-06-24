export const getTotalPrice = (shoppingList) =>
  Object.values(shoppingList).reduce(
    (acc, { price, count }) => acc + (price ?? 0) * count,
    0
  )
