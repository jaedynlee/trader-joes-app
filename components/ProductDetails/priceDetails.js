import React from "react";
import { StyleSheet } from "react-native";
import { Header, BodyText } from "../common/typography";

const styles = StyleSheet.create({
  amount: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 24,
  },
  perUnit: {
    fontWeight: "normal",
    fontSize: 18,
  },
});

const PriceDetails = ({ product }) => {
  let amount = product.sales_uom_description;
  if (product.sales_size && product.sales_size > 1) {
    amount = `${product.sales_size} ${product.sales_uom_description}`;
  }

  return Number(product.retail_price) ? (
    <Header style={styles.amount}>
      ${product.retail_price}
      <BodyText style={styles.perUnit}> / {amount}</BodyText>
    </Header>
  ) : (
    <BodyText style={{ paddingTop: 10, fontStyle: "italic" }}>
      Price unavailable.
    </BodyText>
  );
};

export default PriceDetails;
