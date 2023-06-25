// TODO: Log errors
/* eslint-disable no-useless-catch */

import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * @shoppingList = {
 *   [sku]: {
 *      price: 4.99,
 *      hierarchy: [Food, Snacks]
 *      count: 1,
 *      checked: false,
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

export const clearShoppingList = async () => {
  try {
    await AsyncStorage.setItem('@shoppingList', JSON.stringify({}))
    return {}
  } catch (e) {
    throw e
  }
}

export const removeProductFromShoppingList = async (sku) => {
  try {
    const shoppingList = await getShoppingList()
    delete shoppingList[sku]
    await AsyncStorage.setItem('@shoppingList', JSON.stringify(shoppingList))
    return shoppingList
  } catch (e) {
    throw e
  }
}

export const updateShoppingListCount = async (product, delta) => {
  try {
    const shoppingList = await getShoppingList()
    const isAlreadyInList = Object.keys(shoppingList).includes(product.sku)
    const existingValue = isAlreadyInList
      ? shoppingList[product.sku]
      : {
          checked: false,
          count: 0,
          hierarchy: product.category_hierarchy
            .map(({ name }) => name)
            .slice(1),
          price: product.retail_price,
          name: product.item_title
        }
    const count = existingValue.count + delta
    const updatedShoppingList = { ...shoppingList }
    if (count) {
      updatedShoppingList[product.sku] = { ...existingValue, count }
    } else {
      delete updatedShoppingList[product.sku]
    }
    await AsyncStorage.setItem(
      '@shoppingList',
      JSON.stringify(updatedShoppingList)
    )
    return updatedShoppingList
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
    const shoppingList = await getShoppingList()
    const newShoppingList = {
      ...shoppingList,
      [sku]: {
        ...shoppingList[sku],
        checked: isChecked
      }
    }
    await AsyncStorage.setItem(
      '@shoppingList',
      JSON.stringify(newShoppingList)
    )
    return newShoppingList
  } catch (e) {
    throw e
  }
}
