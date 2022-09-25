import React from "react";
import { View, StyleSheet } from "react-native";
import CollapsibleDetails from "../common/collapsibleDetails.js";
import { BodyText } from "../common/typography.js";

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});

const Ingredients = ({ ingredients, allergens }) => {
  return (
    <View style={styles.container}>
      <CollapsibleDetails label="Ingredients">
        <BodyText>
          {ingredients.map((i) => i.ingredient).join(", ")}
          <BodyText style={{ fontWeight: "bold" }}>
            {" "}
            {allergens && allergens.map((a) => a.ingredient.trim()).join("")}
          </BodyText>
        </BodyText>
      </CollapsibleDetails>
    </View>
  );
};

export default Ingredients;
