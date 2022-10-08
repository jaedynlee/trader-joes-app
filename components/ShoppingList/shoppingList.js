import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { clearShoppingList, getShoppingList } from "../../storage";
import { colors } from "../../style";
import { Header, PrimaryButton, SmallHeader } from "../common/typography";
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
          <SmallHeader style={styles.header}>{s.name}</SmallHeader>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <PrimaryButton
          name="Clear list"
          disabled={!listSections.length}
          onPress={() => clearShoppingList().then(() => setListSections([]))}
          style={{ margin: 10, padding: 10 }}
        />
        {listSections.map((s) => (
          <View key={s.name}>
            <Header style={styles.shadedHeader}>{s.name}</Header>
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
  header: {
    padding: 10,
    paddingLeft: 20,
  },
  shadedHeader: {
    backgroundColor: colors.GRAY,
    padding: 10,
    paddingLeft: 20,
  },
});

export default ShoppingList;
