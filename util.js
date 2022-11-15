const getShoppingListCountHelper = (
  product,
  category_hierarchy,
  shoppingList
) => {
  if (category_hierarchy.length === 0) {
    const products = shoppingList.products ?? {};
    const productEntry = products[product.sku] ?? {};
    return productEntry.count ?? 0;
  }

  const category = category_hierarchy.shift();
  return getShoppingListCountHelper(
    product,
    category_hierarchy,
    shoppingList[category.name] ?? {}
  );
};

// GET COUNT OF SINGLE PRODUCT
export const getShoppingListCount = (shoppingList, product) =>
  getShoppingListCountHelper(
    product,
    product.category_hierarchy.slice(
      1,
      Math.min(3, product.category_hierarchy.length)
    ), // Cut off "Product" category
    shoppingList
  );
