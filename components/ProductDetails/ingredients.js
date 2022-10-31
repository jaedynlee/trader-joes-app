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
  // Ensure ingredients list ends in a period `.`
  if (ingredients.length) {
    const lastIngredient = ingredients.pop();
    const lastCharacter = lastIngredient.ingredient.trim().slice(-1);
    if (lastCharacter !== ".") {
      lastIngredient.ingredient = lastIngredient.ingredient.trim() + ".";
    }
    ingredients.push(lastIngredient);
  }
  return (
    <View style={styles.container}>
      <CollapsibleDetails label="Ingredients">
        <BodyText>
          {ingredients
            .map((i) => i.ingredient.trim())
            .join(", ")
            .trim()}
          <BodyText style={{ fontWeight: "bold" }}>
            {allergens &&
              ` ${allergens.map((a) => a.ingredient.trim()).join(" ")}`}
          </BodyText>
        </BodyText>
      </CollapsibleDetails>
    </View>
  );
};

export default Ingredients;
