import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors } from "../../style";
import { BodyText } from "../common/typography";

const ShoppingListItem = ({ item }) => {
  const [checked, setChecked] = useState(item.checked);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 20,
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => setChecked(!checked)}
          style={{ paddingVertical: 10, paddingLeft: 20, paddingRight: 10 }}
        >
          <FontAwesomeIcon
            size={24}
            icon={checked ? faCheckSquare : faSquare}
            color={checked ? colors.DARK_GRAY : undefined}
          />
        </Pressable>
        <BodyText
          style={{ ...styles.productName, ...(checked ? styles.checked : {}) }}
          numberOfLines={2}
        >
          {item.count > 1 && `[${item.count}] `}
          {item.item_title}
        </BodyText>
      </View>
      <BodyText style={{ ...styles.price, ...(checked ? styles.checked : {}) }}>
        ${Number(item.price) * item.count}
      </BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    flex: 1,
    textOverflow: "ellipsis",
    paddingRight: 10,
  },
  price: {},
  checked: {
    color: colors.DARK_GRAY,
  },
});
export default ShoppingListItem;
