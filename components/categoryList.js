import React from "react";
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

const Item = ({ title }) => (
  <Pressable
    onPress={() => console.log("press")}
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

const CategoryList = () => {
  // const categoryListResponse = fetch('https://www.traderjoes.com/api/graphql', {
  //     method: 'POST',
  //     headers: {
  //         'Accept': 'application/json',
  //         'Accept-Language': 'en-US,en;q=0.5',
  //         'Accept-Encoding': 'gzip, deflate, br',
  //         'content-type': 'application/json',
  //         'TE': 'trailers'
  //     },
  //     body: JSON.stringify({
  //         'variables': {},
  //         'query': '{\n  categoryList(filters: {ids: {in: ["2"]}}) {\n    id\n    level\n    name\n    path\n    url_key\n    product_count\n    children {\n      id\n      level\n      name\n      path\n      url_key\n      product_count\n      children {\n        id\n        level\n        name\n        path\n        url_key\n        product_count\n        children {\n          id\n          level\n          name\n          path\n          url_key\n          product_count\n          children {\n            id\n            level\n            name\n            path\n            url_key\n            product_count\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n'
  //     })
  // })
  // .then((response) => response.json())
  // .then((jsonResponse) => {
  //     console.log(jsonResponse)
  //     return jsonResponse
  // });

  const productCategories = categoryList.data.categoryList[0].children;
  const sections = productCategories.map((category) => ({
    title: category.name,
    data: category.children,
  }));
  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <Item title={item.name} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default CategoryList;
