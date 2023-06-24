import React from 'react'

export const ShoppingListContext = React.createContext({
  addProductToList: () => {},
  clearList: () => {},
  listLength: 0,
  removeProductFromList: () => {},
  shoppingList: {},
  shoppingListCounts: {},
  shoppingListTotalCount: 0,
  updateProductChecked: () => {}
})
