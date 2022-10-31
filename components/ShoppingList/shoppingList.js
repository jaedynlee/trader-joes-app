import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { clearShoppingList, getShoppingList } from "../../storage";
import { colors } from "../../style";
import {
  BodyText,
  Header,
  PrimaryButton,
  SmallHeader,
} from "../common/typography";
import ShoppingListItem from "./shoppingListItem";

const shoppingListToSections = (shoppingList) => {
  const sections = [];
  for (const [key, value] of Object.entries(shoppingList)) {
    if (key === "products") {
      continue;
    }

    const item = {};
    item.name = key;
    item.products = value.products ?? [];
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
  const isFocused = useIsFocused();
  const [listSections, setListSections] = useState([]);

  useEffect(() => {
    getShoppingList().then((shoppingList) => {
      const sections = shoppingListToSections(shoppingList);
      setListSections(sections);
    });
  }, [isFocused]);

  if (!listSections.length) {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <PrimaryButton
          name="Clear list"
          onPress={() => clearShoppingList().then(() => setListSections([]))}
          style={{ margin: 10, padding: 10 }}
        />
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
