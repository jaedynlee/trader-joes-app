import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  Pressable,
} from "react-native";
import { colors } from "../style.js";
import { apiSettings } from "../config.js";
import bakeryProducts from "../api/bakeryProducts.json";
import { getProductsByCategory } from "../client/client";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
  item: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    maxHeight: 100,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  labelWrapper: {
    fontSize: 16,
    alignItems: "center",
  },
  nameLabel: {
    textAlign: "center",
  },
  priceLabel: {
    fontWeight: "bold",
  },
  pricePerLabelWrapper: {
    flexDirection: "row",
    textAlign: "center",
  },
});

const Item = ({ item }) => {
  const uri = `https://www.traderjoes.com${item.primary_image}`;
  const price = item.retail_price;

  let amount = item.sales_uom_description;
  if (item.sales_size && item.sales_size > 1) {
    amount = `${item.sales_size} ${item.sales_uom_description}`;
  }

  return (
    <Pressable
      onPress={() => console.log("press")}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE,
        },
        styles.pressable,
      ]}
    >
      <View style={styles.item}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: uri,
            }}
          />
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.nameLabel}>{item.item_title}</Text>
          <View style={styles.pricePerLabelWrapper}>
            <Text style={styles.priceLabel}>${price}</Text>
            <Text style={styles.label}> / {amount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const SubcategoryGrid = ({ route }) => {
  const { categoryId } = route.params;

  [products, setProducts] = useState([]);

  useEffect(() => {
    if (apiSettings.DISABLE_TJ_API_REQUESTS) {
      console.log("TJ API requests disabled-- using static resource");
      setProducts(bakeryProducts.data.products.items);
      return;
    }

    getProductsByCategory(categoryId).then((response) => {
      setProducts(response.data.products.items);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 1,
            }}
          >
            <Item item={item} />
          </View>
        )}
        numColumns={2}
        keyExtractor={(item) => item.sku}
      />
    </SafeAreaView>
  );
};

export default SubcategoryGrid;
