import React from 'react'

export const ShoppingListContext = React.createContext({
  clearList: () => {},
  removeProductFromList: () => {},
  shoppingList: {},
  shoppingListTotalCount: 0,
  updateProductChecked: () => {},
  updateShoppingListCount: () => {}
})
