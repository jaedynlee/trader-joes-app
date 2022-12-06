import React from "react";

export const ShoppingListContext = React.createContext({
  addProductToList: () => {},
  clearList: () => {},
  listLength: 0,
  removeProductFromList: () => {},
  shoppingList: {},
  shoppingListItemCount: 0,
});
