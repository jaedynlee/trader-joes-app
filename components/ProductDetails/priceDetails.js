import React from "react";
import { StyleSheet, View } from "react-native";
import { Header, BodyText } from "../common/typography";

const styles = StyleSheet.create({
  amount: {
    fontWeight: "bold",
    textAlign: "right",
  },
  perUnit: {
    fontWeight: "normal",
    fontSize: 18,
  },
});

const PriceDetails = ({ product }) => {
  let amount = product.sales_uom_description.toLowerCase();
  if (product.sales_size && product.sales_size > 1) {
    amount = `${
      product.sales_size
    } ${product.sales_uom_description.toLowerCase()}`;
  }

  return (
    <View>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginVertical: 6,
        }}
      />
      {Number(product.retail_price) ? (
        <Header style={styles.amount}>
          ${product.retail_price}
          <BodyText style={styles.perUnit}>
            {" "}
            {amount === "each" ? amount : `/ ${amount}`}
          </BodyText>
        </Header>
      ) : (
        <BodyText style={{ fontStyle: "italic" }}>Price unavailable.</BodyText>
      )}
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginVertical: 6,
        }}
      />
    </View>
  );
};

export default PriceDetails;
