import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  View,
  ScrollView,
} from "react-native";
import { colors } from "../../style.js";
import PriceDetails from "./priceDetails.js";
import Ingredients from "./ingredients.js";
import ProductCharacteristics from "./productCharacteristics.js";
import Story from "./story.js";
import { apiSettings } from "../../config.js";
import productDetails from "../../api/product.json";
import { LegalText } from "../common/typography";
import Nutrition from "./nutrition.js";
import { getProductBySku } from "../../client/client";

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
  useEffect(() => {
    if (apiSettings.DISABLE_TJ_API_REQUESTS) {
      console.log("TJ API requests disabled-- using static resource");
      setProduct(productDetails.data.products.items[0]);
      return;
    }

    getProductBySku(sku).then((response) =>
      setProduct(response.data.products.items[0])
    );
  }, []);

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.paddedContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{
                uri: `https://www.traderjoes.com${product.primary_image}`,
              }}
            />
          </View>
          <PriceDetails product={product} />
          {product.item_characteristics && (
            <ProductCharacteristics
              characteristics={product.item_characteristics}
            />
          )}
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
          <LegalText style={{ paddingTop: 10 }}>
            NOTE: Since posting, the details of this item may have changed.
            Contact your local Trader Joe's for current price and availability.
          </LegalText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetails;
