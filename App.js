import 'react-native-get-random-values'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import styled from 'styled-components/native'

import { colors } from './style'
import ProductDetails from './components/ProductDetails/productDetails.js'
import FilteredProductsList from './components/ProductList/productList'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCarrot, faListCheck } from '@fortawesome/free-solid-svg-icons'
import { ShoppingList } from './components/ShoppingList/shoppingList'
import { ShoppingListContext } from './shoppingListContext'

import {
  clearShoppingList,
  getShoppingList,
  removeProductFromShoppingList,
  updateShoppingListProductChecked,
  updateShoppingListCount as updateShoppingListCountStorage
} from './storage/shoppingList'
import { ProductCategoryList } from './components/ProductCategoryList/productCategoryList'

const StyledSafeAreaView = styled.SafeAreaView`
  background-color: ${colors.WHITE};
  flex: 1;
`

const ProductStack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()

const ProductStackNavigator = () => (
  <ProductStack.Navigator>
    <ProductStack.Screen
      name="All Products List"
      component={ProductCategoryList}
      options={{ title: 'All Products' }}
    />
    <ProductStack.Screen
      name="Filtered Products List"
      component={FilteredProductsList}
      options={({ route }) => ({ title: route.params.name })}
    />
    <ProductStack.Screen
      name="Product Details"
      component={ProductDetails}
      options={({ route }) => ({ title: route.params.name })}
    />
  </ProductStack.Navigator>
)

const ShoppingListStackNavigator = () => (
  <ProductStack.Navigator>
    <ProductStack.Screen
      name="List"
      component={ShoppingList}
      options={{
        unmountOnBlur: true,
        title: 'Shopping List'
      }}
    />
    <ProductStack.Screen
      name="List Product Details"
      component={ProductDetails}
      options={({ route }) => ({ title: route.params.name })}
    />
  </ProductStack.Navigator>
)

const getTotalCount = (shoppingList) =>
  Object.values(shoppingList).reduce((acc, { count }) => acc + count, 0)

export default function App () {
  const [shoppingList, setShoppingList] = useState({})
  const [shoppingListTotalCount, setShoppingListTotalCount] = useState(0)

  const updateShoppingListCount = (product, delta) => {
    updateShoppingListCountStorage(product, delta).then(
      (updatedShoppingList) => {
        setShoppingList(updatedShoppingList)
        setShoppingListTotalCount(getTotalCount(updatedShoppingList))
      }
    )
  }

  const clearList = () => {
    clearShoppingList().then((updatedShoppingList) => {
      setShoppingListTotalCount(0)
      setShoppingList(updatedShoppingList)
    })
  }

  const removeProductFromList = (sku) => {
    removeProductFromShoppingList(sku).then((updatedShoppingList) => {
      setShoppingList(updatedShoppingList)
      setShoppingListTotalCount(getTotalCount(updatedShoppingList))
    })
  }

  const updateProductChecked = (sku, isChecked) =>
    updateShoppingListProductChecked(sku, isChecked).then(setShoppingList)

  useEffect(() => {
    getShoppingList().then((shoppingList) => {
      setShoppingList(shoppingList)
      setShoppingListTotalCount(getTotalCount(shoppingList))
    })
  }, [])

  return (
    <ShoppingListContext.Provider
      value={{
        updateShoppingListCount,
        clearList,
        removeProductFromList,
        shoppingList,
        shoppingListTotalCount,
        updateProductChecked
      }}
    >
      <NavigationContainer>
        <StyledSafeAreaView>
          <StatusBar barStyle="dark-content" />
          <Tab.Navigator>
            <Tab.Screen
              name="Products"
              component={ProductStackNavigator}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon icon={faCarrot} color={color} size={size} />
                )
              }}
            />
            <Tab.Screen
              name="Shopping List"
              component={ShoppingListStackNavigator}
              options={{
                headerShown: false,
                unmountOnBlur: true,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesomeIcon
                    icon={faListCheck}
                    color={color}
                    size={size}
                  />
                ),
                tabBarBadge: shoppingListTotalCount,
                tabBarBadgeStyle: { backgroundColor: colors.RED }
              }}
            />
          </Tab.Navigator>
        </StyledSafeAreaView>
      </NavigationContainer>
    </ShoppingListContext.Provider>
  )
}
