import React, { memo, useContext } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { colors } from "../../style.js";
import { BodyText } from "../common/typography.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Image } from "expo-image";

import { ShoppingListContext } from "../../shoppingListContext";
import { BLUR_HASH } from "../common/images.js/constants.js";

const styles = StyleSheet.create({
  item: {
    width: "100%",
    padding: 6,
    borderRadius: 6,
    alignItems: "center",
    zIndex: 0,

    // background color must be set for shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5, // for Android
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

const AddRemoveListButton = ({ item, count }) => {
  const { updateShoppingListCount } = useContext(ShoppingListContext);

  return (
    <View
      style={{
        backgroundColor: colors.RED,
        position: "absolute",
        top: 0,
        right: 0,
        marginRight: 6,
        marginTop: 6,
        zIndex: 1000,
        alignContent: "center",
        justifyContent: "center",
        borderRadius: 6,
      }}
    >
      {count ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Pressable
            style={{ padding: 10 }}
            onPress={() => updateShoppingListCount(item, -1)}
          >
            <FontAwesomeIcon icon={faMinus} color={colors.WHITE} />
          </Pressable>
          <View style={{ paddingHorizontal: 5 }}>
            <BodyText style={{ color: colors.WHITE, fontWeight: "bold" }}>
              {count}
            </BodyText>
          </View>
          <Pressable
            style={{ padding: 10 }}
            onPress={() => updateShoppingListCount(item, 1)}
          >
            <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={{ padding: 10 }}
          onPress={() => updateShoppingListCount(item, 1)}
        >
          <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
        </Pressable>
      )}
    </View>
  );
};

const Item = ({ item, count, navigation }) => {
  if (!item.__typename) {
    return <View></View>;
  }

  const uri = `https://www.traderjoes.com${item.primary_image}`;
  const price = item.retail_price;

  let amount = item.sales_uom_description.toLowerCase();
  if (item.sales_size && item.sales_size > 1) {
    amount = `${item.sales_size} ${item.sales_uom_description.toLowerCase()}`;
  }

  return (
    <View style={{ padding: 4 }}>
      <Pressable
        onPress={() =>
          navigation.navigate("Product Details", {
            name: item.item_title,
            sku: item.sku,
          })
        }
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: pressed ? colors.GRAY : colors.WHITE,
          },
        ]}
      >
        <AddRemoveListButton item={item} count={count} />
        <View style={styles.imageWrapper}>
          <Image
            alt={item.item_title}
            placeholder={BLUR_HASH}
            contentFit="contain"
            source={uri}
            style={styles.image}
          />
        </View>
        <View style={styles.labelWrapper}>
          <BodyText style={styles.nameLabel}>{item.item_title}</BodyText>
          {Number(price) ? (
            <View style={styles.pricePerLabelWrapper}>
              <BodyText style={styles.priceLabel}>${price}</BodyText>
              <BodyText style={styles.label}>
                {" "}
                {amount === "each" ? amount : `/ ${amount}`}
              </BodyText>
            </View>
          ) : (
            <BodyText style={{ fontStyle: "italic" }}>
              Price unavailable
            </BodyText>
          )}
        </View>
      </Pressable>
    </View>
  );
};

// Only rerender list item if count has changed
export default memo(Item, (prev, next) => prev.count === next.count);
