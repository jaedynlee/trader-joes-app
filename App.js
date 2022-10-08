import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import AllProductsList from "./components/ProductsList/allProductsList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { colors } from "./style";
import ProductDetails from "./components/ProductDetails/productDetails.js";
import FilteredProductsList from "./components/ProductsList/filteredProductsList";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAppleWhole, faListCheck } from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./components/ShoppingList/shoppingList";

const ProductStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const ProductStackNavigator = () => (
  <ProductStack.Navigator>
    <ProductStack.Screen
      name="All Products List"
      component={AllProductsList}
      options={{ title: "All Products" }}
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
);

const ShoppingListStackNavigator = () => (
  <ProductStack.Navigator>
    <ProductStack.Screen
      name="List"
      component={ShoppingList}
      options={{
        unmountOnBlur: true,
        title: "Shopping List",
      }}
    />
    <ProductStack.Screen
      name="List Product Details"
      component={ProductDetails}
      options={({ route }) => ({ title: route.params.name })}
    />
  </ProductStack.Navigator>
);

export default App = () => (
  <NavigationContainer>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator>
        <Tab.Screen
          name="Products"
          component={ProductStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faAppleWhole} color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Shopping List"
          component={ShoppingListStackNavigator}
          options={{
            headerShown: false,
            unmountOnBlur: true,
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faListCheck} color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});
