// TODO: Log errors
/* eslint-disable no-useless-catch */

import AsyncStorage from '@react-native-async-storage/async-storage'

export const setLocation = async (clientkey, name) => {
  try {
    const location = { clientkey, name }
    await AsyncStorage.setItem('@location', JSON.stringify(location))
    return location
  } catch (e) {
    throw e
  }
}

export const getLocation = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@location')
    return jsonValue !== null ? JSON.parse(jsonValue) : null
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

export const removeProductFromShoppingList = async (product) =>
  await updateShoppingListCount(product, -1)

export const addProductToShoppingList = async (product) =>
  await updateShoppingListCount(product, 1)

/**
 * @shoppingList = {
 *   categoryId: {
 *      products:{
 *        sku: {
 *          count,
 *          name,
 *          price,
 *          etc.
 *        }
 *     }
 *   }
 * }
 */
export const updateShoppingListCount = async (product, delta) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@shoppingList')
    const shoppingList = jsonValue === null ? {} : JSON.parse(jsonValue)
    const newShoppingList = addProductToShoppingListHelper(
      product,
      product.category_hierarchy.slice(
        1,
        Math.min(3, product.category_hierarchy.length)
      ), // Cut off "Product" category
      shoppingList,
      delta
    )
    await AsyncStorage.setItem(
      '@shoppingList',
      JSON.stringify(newShoppingList)
    )
    return newShoppingList
  } catch (e) {
    throw e
  }
}

const addProductToShoppingListHelper = (
  product,
  categoryHierarchy,
  shoppingList,
  delta
) => {
  if (categoryHierarchy.length === 0) {
    const products = shoppingList.products ?? {}
    const productEntry = products[product.sku] ?? {
      item_title: product.item_title,
      price: product.retail_price,
      count: 0,
      checked: false
    }

    const newCount = productEntry.count + delta
    if (newCount === 0) {
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
        [product.sku]: { ...productEntry, count: newCount }
      }
    }
  }

  const category = categoryHierarchy.shift()
  const sublist = addProductToShoppingListHelper(
    product,
    categoryHierarchy,
    shoppingList[category.name] ?? {},
    delta
  )
  if (Object.keys(sublist).length === 0) {
    delete shoppingList[category.name]
  } else {
    shoppingList[category.name] = sublist
  }
  return shoppingList
}

export const getShoppingList = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@shoppingList')
    return jsonValue !== null ? JSON.parse(jsonValue) : {}
  } catch (e) {
    throw e
  }
}

// GET COUNT OF SINGLE PRODUCT
export const getShoppingListCount = async (product) => {
  try {
    const shoppingList = await getShoppingList()
    return getShoppingListCountHelper(
      product,
      product.category_hierarchy.slice(
        1,
        Math.min(3, product.category_hierarchy.length)
      ), // Cut off "Product" category
      shoppingList
    )
  } catch (e) {
    throw e
  }
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

// GET COUNTS OF ALL PRODUCTS
export const getShoppingListCounts = async () => {
  try {
    const shoppingList = await getShoppingList()
    return getShoppingListCountsHelper(shoppingList)
  } catch (e) {
    throw e
  }
}

const getShoppingListCountsHelper = (shoppingList) => {
  let counts = {}

  for (const [key, value] of Object.entries(shoppingList)) {
    if (key === 'products') {
      for (const [sku, product] of Object.entries(value)) {
        counts[sku] = product.count
      }
    } else {
      counts = { ...counts, ...getShoppingListCountsHelper(value) }
    }
  }

  return { ...counts }
}
