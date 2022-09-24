import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Pressable,
} from "react-native";
import categoryList from "../api/foodCategoryList.json";
import { colors } from "../style.js";
import { apiSettings } from "../config.js";
import { getAllProducts } from "../client/client";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  item: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: colors.GRAY,
    padding: 10,
    paddingLeft: 20,
  },
  title: {
    fontSize: 18,
  },
});

const Item = ({ id, title, navigation }) => {
  return (
    <Pressable
      onPress={() => {
        console.log(`press ${id}`);
        navigation.navigate("Subcategory Grid", {
          name: title,
          categoryId: id,
        });
      }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE,
        },
      ]}
    >
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
};

const CategoryList = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (apiSettings.DISABLE_TJ_API_REQUESTS) {
      console.log("TJ API requests disabled-- using static resource");
      const productCategories = categoryList.data.categoryList[0].children;
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children,
      }));
      setProducts(sections);
      return;
    }

    getAllProducts().then((response) => {
      const productCategories = response.data.categoryList[0].children;
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children,
      }));
      setProducts(sections);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={products}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} navigation={navigation} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default CategoryList;
