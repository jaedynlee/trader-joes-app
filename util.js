export const getTotalPrice = (shoppingList) => {
  const entries = Object.entries(shoppingList)

  let price = 0
  for (const [key, value] of entries) {
    if (key === 'products') {
      price += Object.values(value).reduce(
        (acc, { count, price }) => acc + count * Number(price),
        0
      )
      continue
    }

    price += getTotalPrice(value)
  }

  return price
}

const getShoppingListCountHelper = (
  product,
  categoryHierarchy,
  shoppingList
) => {
  if (categoryHierarchy.length === 0) {
    const products = shoppingList.products ?? {}
    const productEntry = products[product.sku] ?? {}
    return productEntry.count ?? 0
  }

  const category = categoryHierarchy.shift()
  return getShoppingListCountHelper(
    product,
    categoryHierarchy,
    shoppingList[category.name] ?? {}
  )
}

// GET COUNT OF SINGLE PRODUCT
export const getShoppingListCount = (shoppingList, product) =>
  getShoppingListCountHelper(
    product,
    product.category_hierarchy.slice(
      1,
      Math.min(3, product.category_hierarchy.length)
    ), // Cut off "Product" category
    shoppingList
  )

// GET COUNT OF ALL PRODUCTS
export const getShoppingListItemCount = (shoppingList) => {
  const entries = Object.entries(shoppingList)

  let count = 0
  for (const [key, value] of entries) {
    if (key === 'products') {
      count += Object.values(value).reduce((acc, { count }) => acc + count, 0)
      continue
    }

    count += getShoppingListItemCount(value)
  }

  return count
}
