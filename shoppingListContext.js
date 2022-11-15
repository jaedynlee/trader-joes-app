import React from "react";

export const ShoppingListContext = React.createContext({
  addProductToList: () => {},
  listLength: 0,
  removeProductFromList: () => {},
  shoppingList: {},
});
