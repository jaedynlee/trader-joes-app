import { useContext } from "react";
import { BodyText } from "../common/typography";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

import { StyleSheet, View, Pressable } from "react-native";
import { colors } from "../../style";
import { ShoppingListContext } from "../../shoppingListContext";
import { getShoppingListCount } from "../../util";

const ShoppingListButton = ({ product }) => {
  const { addProductToList, removeProductFromList, shoppingList } =
    useContext(ShoppingListContext);

  const listCount = getShoppingListCount(shoppingList, product);

  return listCount ? (
    <View style={[styles.buttonContainer, { justifyContent: "space-between" }]}>
      <Pressable
        style={styles.plusMinusButton}
        onPress={() => removeProductFromList(product)}
      >
        <FontAwesomeIcon icon={faMinus} color={colors.WHITE} />
      </Pressable>
      <View style={{ flex: 1, backgroundColor: colors.DARK_RED }}>
        <BodyText style={styles.buttonText}>{listCount}</BodyText>
      </View>
      <Pressable
        style={styles.plusMinusButton}
        onPress={() => addProductToList(product)}
      >
        <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
      </Pressable>
    </View>
  ) : (
    <Pressable
      onPress={() => addProductToList(product)}
      style={[styles.buttonContainer, { textAlign: "center" }]}
    >
      <BodyText style={styles.buttonText}>Add to list</BodyText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    height: 50,
    width: "70%",
    alignSelf: "center",
    marginBottom: 20,
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.RED,
    borderRadius: 10,
    alignContent: "center",
  },
  plusMinusButton: {
    height: 50,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    textAlign: "center",
    color: colors.WHITE,
    fontWeight: "bold",
    padding: 15,
    textAlign: "center",
  },
});

export default ShoppingListButton;
