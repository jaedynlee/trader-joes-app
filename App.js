import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CategoryList from "./components/categoryList";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CategoryList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
