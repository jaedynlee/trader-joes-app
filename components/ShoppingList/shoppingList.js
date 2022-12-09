import { useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { colors } from "../../style";
import {
  BodyText,
  Header,
  PrimaryButton,
  SecondaryButton,
  SmallHeader,
} from "../common/typography";
import ShoppingListItem from "./shoppingListItem";
import {
  faArrowUpFromBracket,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { ShoppingListContext } from "../../shoppingListContext";
import { getTotalPrice } from "../../util";

const getShareableProducts = (section) => {
  let ret = "";

  const products = Object.entries(section.products);
  if (products.length > 0) {
    products.forEach(
      ([, item]) => (ret += `${item.count}x ${item.item_title}\n`)
    );
  }
  if (section.subsections) {
    section.subsections.forEach(
      (subsection) => (ret += getShareableProducts(subsection))
    );
  }

  return ret;
};

const getShareableListSections = (listSections) => {
  let ret = "";

  listSections.forEach((section) => {
    ret += `--- ${section.name.toUpperCase()} ---\n`;
    ret += getShareableProducts(section);
  });

  return ret;
};

const shoppingListToSections = (shoppingList) => {
  const sections = [];
  for (const [key, value] of Object.entries(shoppingList)) {
    if (key === "products") {
      continue;
    }

    const item = {};
    item.name = key;
    item.products = value.products ?? {};
    item.subsections = shoppingListToSections(value);

    sections.push(item);
  }

  return sections;
};

const ShoppingListSection = ({ products, subsections, navigation }) => (
  <View>
    {products &&
      Object.entries(products).map(([sku, item]) => (
        <ShoppingListItem
          key={sku}
          sku={sku}
          item={item}
          navigation={navigation}
        />
      ))}
    {subsections &&
      subsections.map((s) => (
        <View key={s.name}>
          <SmallHeader style={styles.subHeader}>{s.name}</SmallHeader>
          <ShoppingListSection
            products={s.products}
            subsections={s.subsections}
            navigation={navigation}
          />
        </View>
      ))}
  </View>
);

const ShoppingList = ({ navigation }) => {
  const { clearList, shoppingList, shoppingListItemCount } =
    useContext(ShoppingListContext);

  if (shoppingListItemCount === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BodyText style={{ textAlign: "center", padding: 20 }}>
          You have not added any items to your shopping list yet. The great news
          is you can start it now!
        </BodyText>
        <PrimaryButton
          name="Browse products"
          onPress={() =>
            navigation.navigate("Products", { screen: "All Products List" })
          }
          style={{
            paddingVertical: 14,
            paddingHorizontal: 20,
          }}
        />
      </View>
    );
  }

  const listSections = shoppingListToSections(shoppingList);
  const totalPrice = getTotalPrice(shoppingList);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: getShareableListSections(listSections),
        title: "Trader Joe's shopping list",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <SecondaryButton
            icon={faTrashCan}
            name="Clear"
            onPress={clearList}
            style={{ flex: 1, margin: 10 }}
          />
          <PrimaryButton
            icon={faArrowUpFromBracket}
            name="Share"
            onPress={onShare}
            style={{ flex: 1, margin: 10, marginLeft: 0 }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Header>Total</Header>
          <Header>${totalPrice.toFixed(2)}</Header>
        </View>
        {listSections.map((s) => (
          <View key={s.name}>
            <Header style={styles.header}>{s.name}</Header>
            <ShoppingListSection
              products={s.products}
              subsections={s.subsections}
              navigation={navigation}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
  subHeader: {
    padding: 10,
    paddingLeft: 20,
    backgroundColor: colors.LIGHT_GRAY,
  },
  header: {
    backgroundColor: colors.GRAY,
    padding: 10,
    paddingLeft: 20,
  },
});

export default ShoppingList;
