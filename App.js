import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import AllProductsList from "./components/ProductsList/allProductsList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./style";
import ProductDetails from "./components/ProductDetails/productDetails.js";
import FilteredProductsList from "./components/ProductsList/filteredProductsList";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="All Products List"
            component={AllProductsList}
            options={{ title: "All Products" }}
          />
          <Stack.Screen
            name="Filtered Products List"
            component={FilteredProductsList}
            options={({ route }) => ({ title: route.params.name })}
          />
          <Stack.Screen
            name="Product Details"
            component={ProductDetails}
            options={({ route }) => ({ title: route.params.name })}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});
