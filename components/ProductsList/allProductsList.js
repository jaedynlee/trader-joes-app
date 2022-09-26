import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Pressable,
} from "react-native";
import categoryList from "../../api/foodCategoryList.json";
import { colors } from "../../style.js";
import { apiSettings } from "../../config.js";
import { getAllProducts } from "../../client/client";
import { BodyText, Header } from "../common/typography";
import SearchBar from "./searchBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
  item: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  header: {
    backgroundColor: colors.GRAY,
    padding: 10,
    paddingLeft: 20,
  },
});

const Item = ({ id, title, navigation }) => {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Filtered Products List", {
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
        <BodyText>{title}</BodyText>
      </View>
    </Pressable>
  );
};

const AllProductsList = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (apiSettings.DISABLE_TJ_API_REQUESTS) {
      console.log("TJ API requests disabled-- using static resource");
      const productCategories = categoryList.data.categoryList[0].children;
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children.length ? category.children : [category],
      }));
      setProducts(sections);
      return;
    }

    getAllProducts().then((response) => {
      const productCategories = response.data.categoryList[0].children;
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children.length ? category.children : [category],
      }));
      setProducts(sections);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar navigation={navigation} />
      <SectionList
        sections={products}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} navigation={navigation} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Header style={styles.header}>{title}</Header>
        )}
      />
    </SafeAreaView>
  );
};

export default AllProductsList;
