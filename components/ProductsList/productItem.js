import React, { useState, memo, useEffect } from "react";
import { StyleSheet, View, Image, StatusBar, Pressable } from "react-native";
import { colors } from "../../style.js";
import { BodyText } from "../common/typography.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { updateShoppingListCount } from "../../storage.js";

const styles = StyleSheet.create({
  item: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    zIndex: 0,
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

const AddRemoveListButton = ({ item, initialCount }) => {
  const [count, setCount] = useState(undefined);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  const updateCount = (delta) => {
    updateShoppingListCount(item, delta).then(() => setCount(count + delta));
  };

  if (count === undefined) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colors.RED,
        position: "absolute",
        top: 0,
        right: 0,
        marginRight: 15,
        zIndex: 1000,
        alignContent: "center",
        justifyContent: "center",
        borderRadius: 5,
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
          <Pressable style={{ padding: 10 }} onPress={() => updateCount(-1)}>
            <FontAwesomeIcon icon={faMinus} color={colors.WHITE} />
          </Pressable>
          <View style={{ paddingHorizontal: 5 }}>
            <BodyText style={{ color: colors.WHITE, fontWeight: "bold" }}>
              {count}
            </BodyText>
          </View>
          <Pressable style={{ padding: 10 }} onPress={() => updateCount(1)}>
            <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
          </Pressable>
        </View>
      ) : (
        <Pressable style={{ padding: 10 }} onPress={() => updateCount(1)}>
          <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
        </Pressable>
      )}
    </View>
  );
};

const Item = ({ item, count, navigation, storeCode }) => {
  const uri = `https://www.traderjoes.com${item.primary_image}`;
  const price = item.retail_price;

  let amount = item.sales_uom_description;
  if (item.sales_size && item.sales_size > 1) {
    amount = `${item.sales_size} ${item.sales_uom_description}`;
  }

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Product Details", {
          name: item.item_title,
          sku: item.sku,
          storeCode: storeCode,
        })
      }
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE,
        },
      ]}
    >
      <View style={styles.item}>
        <AddRemoveListButton item={item} initialCount={count} />
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: uri,
            }}
          />
        </View>
        <View style={styles.labelWrapper}>
          <BodyText style={styles.nameLabel}>{item.item_title}</BodyText>
          {Number(price) ? (
            <View style={styles.pricePerLabelWrapper}>
              <BodyText style={styles.priceLabel}>${price}</BodyText>
              <BodyText style={styles.label}> / {amount}</BodyText>
            </View>
          ) : (
            <BodyText style={{ fontStyle: "italic" }}>
              Price unavailable
            </BodyText>
          )}
        </View>
      </View>
    </Pressable>
  );
};

// Only rerender list item if count has changed
export default memo(Item, (prev, next) => prev.count === next.count);
