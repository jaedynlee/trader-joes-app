import { useEffect, useState } from "react";
import { BodyText } from "../common/typography";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  addProductToShoppingList,
  getShoppingListCount,
  removeProductFromShoppingList,
} from "../../storage.js";

import { StyleSheet, View, Pressable } from "react-native";
import { colors } from "../../style";

const ShoppingListButton = ({ product }) => {
  const [listCount, setListCount] = useState(undefined);

  useEffect(() => {
    getShoppingListCount(product).then((listCount) => setListCount(listCount));
  }, []);

  const onAddToList = () =>
    addProductToShoppingList(product).then(() => setListCount(listCount + 1));

  const onRemoveFromList = () =>
    removeProductFromShoppingList(product).then(() =>
      setListCount(listCount - 1)
    );

  if (listCount === undefined) {
    return null;
  }

  return listCount ? (
    <View style={[styles.buttonContainer, { justifyContent: "space-between" }]}>
      <Pressable style={styles.plusMinusButton} onPress={onRemoveFromList}>
        <FontAwesomeIcon icon={faMinus} color={colors.WHITE} />
      </Pressable>
      <View style={{ flex: 1, backgroundColor: colors.DARK_RED }}>
        <BodyText style={styles.buttonText}>{listCount}</BodyText>
      </View>
      <Pressable style={styles.plusMinusButton} onPress={onAddToList}>
        <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
      </Pressable>
    </View>
  ) : (
    <Pressable
      onPress={onAddToList}
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
