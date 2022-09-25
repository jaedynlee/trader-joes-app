import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CategoryList from "./components/categoryList";
import SubcategoryGrid from "./components/subcategoryGrid";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./style";
import ProductDetails from "./components/ProductDetails/productDetails.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="All Products List"
            component={CategoryList}
            options={{ title: "All Products" }}
          />
          <Stack.Screen
            name="Subcategory Grid"
            component={SubcategoryGrid}
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
