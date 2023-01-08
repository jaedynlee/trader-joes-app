import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  View,
  ScrollView,
} from "react-native";
import { colors } from "../../style.js";
import PriceDetails from "./priceDetails.js";
import Ingredients from "./ingredients.js";
import ProductCharacteristics from "./productCharacteristics.js";
import Story from "./story.js";
import { Header, LegalText } from "../common/typography";
import Nutrition from "./nutrition.js";
import { getProductBySku } from "../../client/client";
import ShoppingListButton from "./shoppingListButton.js";
import { getLocation } from "../../storage.js";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  paddedContainer: {
    padding: 24,
  },
  imageWrapper: {
    width: "100%",
    maxHeight: 150,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

const ProductDetails = ({ route }) => {
  const { sku } = route.params;

  const [product, setProduct] = useState(undefined);

  useEffect(
    () =>
      getLocation().then((location) =>
        getProductBySku(location.clientkey, sku).then((response) =>
          setProduct(response.data.products.items[0])
        )
      ),
    []
  );

  if (!product) {
    return (
      <ActivityIndicator
        size="large"
        animating={true}
        style={{ flex: 1, alignSelf: "center" }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.paddedContainer}>
          <Header>{product.item_title}</Header>
          <PriceDetails product={product} />
          {product.item_characteristics && (
            <ProductCharacteristics
              characteristics={product.item_characteristics}
            />
          )}
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                uri: `https://www.traderjoes.com${product.primary_image}`,
              }}
            />
          </View>

          {product.item_story_marketing && (
            <Story summary={product.item_story_marketing} />
          )}
          {product.ingredients && product.ingredients.length > 0 && (
            <Ingredients
              ingredients={product.ingredients}
              allergens={product.allergens}
            />
          )}
          {product.nutrition && product.nutrition.length > 0 && (
            <Nutrition nutrition={product.nutrition[0]} />
          )}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              paddingTop: 30,
            }}
          />
          <LegalText style={{ paddingTop: 10, paddingBottom: 60 }}>
            NOTE: The details of this item may have changed since posting.
            Contact your local Trader Joe's for current price and availability.
          </LegalText>
        </View>
      </ScrollView>
      <ShoppingListButton product={product} />
    </SafeAreaView>
  );
};

export default ProductDetails;
