export const getTotalPrice = (shoppingList, shoppingListCounts) => {
  const entries = Object.entries(shoppingList)

  let price = 0
  for (const [key, value] of entries) {
    if (key === 'products') {
      price += Object.entries(value).reduce((acc, [sku, { price }]) => {
        const count = shoppingListCounts[sku]
          ? shoppingListCounts[sku].count
          : 0
        return acc + count * Number(price)
      }, 0)
      continue
    }

    price += getTotalPrice(value, shoppingListCounts)
  }

  return price
}
