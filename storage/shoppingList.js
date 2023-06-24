// TODO: Log errors
/* eslint-disable no-useless-catch */

import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * @shoppingList = {
 *   categoryId: {
 *      products:{
 *        sku: {
 *          name,
 *          price,
 *          etc.
 *        }
 *     }
 *   }
 * }
 */
export const getShoppingList = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@shoppingList')
    return jsonValue !== null ? JSON.parse(jsonValue) : {}
  } catch (e) {
    throw e
  }
}

/**
 * @shoppingListCounts = {
 *   [sku]: {
 *      count: 1,
 *      checked: false,
 *   }
 * }
 */
export const getShoppingListCounts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@shoppingListCounts')
    return jsonValue !== null ? JSON.parse(jsonValue) : {}
  } catch (e) {
    throw e
  }
}

export const clearShoppingList = async () => {
  try {
    await AsyncStorage.setItem('@shoppingList', JSON.stringify({}))
    await AsyncStorage.setItem('@shoppingListCounts', JSON.stringify({}))
    return { counts: {}, list: {} }
  } catch (e) {
    throw e
  }
}

export const removeProductFromShoppingList = async (product) =>
  await updateShoppingListCount(product, -1)

export const addProductToShoppingList = async (product) =>
  await updateShoppingListCount(product, 1)

export const updateShoppingListCount = async (product, delta) => {
  try {
    const counts = await getShoppingListCounts()
    const isAlreadyInList = Object.keys(counts).includes(product.sku)
    const existingValue = isAlreadyInList
      ? counts[product.sku]
      : { checked: false, count: 0 }
    const count = existingValue.count + delta
    const newShoppingListCounts = {
      ...counts,
      [product.sku]: { ...existingValue, count }
    }
    await AsyncStorage.setItem(
      '@shoppingListCounts',
      JSON.stringify(newShoppingListCounts)
    )

    const shoppingList = await getShoppingList()

    if (isAlreadyInList && count !== 0) {
      return { counts: newShoppingListCounts, list: shoppingList }
    }

    const newShoppingList = addProductToShoppingListHelper(
      product,
      product.category_hierarchy.slice(
        1,
        Math.min(3, product.category_hierarchy.length)
      ), // Cut off "Product" category
      shoppingList,
      count
    )
    await AsyncStorage.setItem(
      '@shoppingList',
      JSON.stringify(newShoppingList)
    )
    return { counts: newShoppingListCounts, list: newShoppingList }
  } catch (e) {
    throw e
  }
}

const addProductToShoppingListHelper = (
  product,
  categoryHierarchy,
  shoppingList,
  count
) => {
  if (categoryHierarchy.length === 0) {
    const products = shoppingList.products ?? {}
    const productEntry = products[product.sku] ?? {
      item_title: product.item_title,
      price: product.retail_price
    }

    if (count === 0) {
      delete shoppingList.products[product.sku]
      if (Object.keys(shoppingList.products).length === 0) {
        delete shoppingList.products
      }
      return shoppingList
    }
    return {
      ...shoppingList,
      products: {
        ...products,
        [product.sku]: productEntry
      }
    }
  }

  const category = categoryHierarchy.shift()
  const sublist = addProductToShoppingListHelper(
    product,
    categoryHierarchy,
    shoppingList[category.name] ?? {},
    count
  )
  if (Object.keys(sublist).length === 0) {
    delete shoppingList[category.name]
  } else {
    shoppingList[category.name] = sublist
  }
  return shoppingList
}

export const getShoppingListCount = async (sku) => {
  try {
    const shoppingListCounts = await getShoppingListCounts()
    return shoppingListCounts[sku].count
  } catch (e) {
    throw e
  }
}

/**
 * Updates whether a product is checked or not in the shopping list.
 * @param {string} sku: The SKU of the product to update
 * @param {boolean} isChecked: The checked value to update to
 * @returns the updated shopping list counts
 */
export const updateShoppingListProductChecked = async (sku, isChecked) => {
  try {
    const shoppingListCounts = await getShoppingListCounts()
    const newShoppingListCounts = {
      ...shoppingListCounts,
      [sku]: {
        ...shoppingListCounts[sku],
        checked: isChecked
      }
    }
    await AsyncStorage.setItem(
      '@shoppingListCounts',
      JSON.stringify(newShoppingListCounts)
    )
    return newShoppingListCounts
  } catch (e) {
    throw e
  }
}
