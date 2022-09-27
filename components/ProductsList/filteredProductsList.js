import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StatusBar,
  Pressable,
} from "react-native";
import { colors } from "../../style.js";
import { apiSettings } from "../../config.js";
import bakeryProducts from "../../api/bakeryProducts.json";
import { getProducts, searchProducts } from "../../client/client";
import { BodyText } from "../common/typography.js";
import DropDownPicker from "react-native-dropdown-picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
  item: {
    width: "100%",
    padding: 10,
    alignItems: "center",
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

const Item = ({ item, navigation }) => {
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
        })
      }
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE,
        },
        styles.pressable,
      ]}
    >
      <View style={styles.item}>
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
          <View style={styles.pricePerLabelWrapper}>
            <BodyText style={styles.priceLabel}>${price}</BodyText>
            <BodyText style={styles.label}> / {amount}</BodyText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const FilteredProductsList = ({ route, navigation }) => {
  const { searchTerm, categoryId } = route.params;

  const [shouldFetch, setShouldFetch] = useState(true);
  const page = useRef(1);
  const totalPages = useRef(undefined);

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState(categoryId);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [characteristic, setCharacteristic] = useState(null);
  const [characteristicOpen, setCharacteristicOpen] = useState(false);
  const [characteristicOptions, setCharacteristicOptions] = useState([]);

  const [funTag, setFunTag] = useState(null);
  const [funTagOpen, setFunTagOpen] = useState(false);
  const [funTagOptions, setFunTagOptions] = useState([]);

  const onCategoryOpen = useCallback(() => {
    setCharacteristicOpen(false);
    setFunTagOpen(false);
  }, []);

  const onCharacteristicOpen = useCallback(() => {
    setCategoryOpen(false);
    setFunTagOpen(false);
  }, []);

  const onFunTagOpen = useCallback(() => {
    setCategoryOpen(false);
    setCharacteristicOpen(false);
  }, []);

  const aggregationOptionToDropdownOption = (o) => ({
    label: o.label,
    value: o.value,
    key: o.label,
  });

  const setStates = (products) => {
    console.log(`resetting products: ${products.items.length}`);
    setProducts(products.items);
    console.log(`Setting total pages to ${products.pageInfo.totalPages}`);
    totalPages.current = products.pageInfo.totalPages;
    console.log("shouldfetch is false");
    setShouldFetch(false);
    const aggregations = products.aggregations;

    const cateoryAggregation = aggregations.find(
      (a) => a.attribute_code === "category_id"
    );
    cateoryAggregation &&
      setCategoryOptions([
        {
          label: `All ${route.params.name}`,
          value: categoryId,
          key: "all",
        },
        ...cateoryAggregation.options.map((o) =>
          aggregationOptionToDropdownOption(o)
        ),
      ]);

    const characteristicAggregation = aggregations.find(
      (a) => a.attribute_code === "item_characteristics"
    );

    characteristicAggregation &&
      setCharacteristicOptions([
        {
          label: `All Characteristics`,
          value: undefined,
          key: "all",
        },
        ...characteristicAggregation.options.map((o) =>
          aggregationOptionToDropdownOption(o)
        ),
      ]);

    const funTagAggregation = aggregations.find(
      (a) => a.attribute_code === "fun_tags"
    );

    funTagAggregation &&
      setFunTagOptions([
        {
          label: `All Tags`,
          value: undefined,
          key: "all",
        },
        ...funTagAggregation.options.map((o) =>
          aggregationOptionToDropdownOption(o)
        ),
      ]);
  };

  useEffect(() => {
    if (apiSettings.DISABLE_TJ_API_REQUESTS) {
      console.log("TJ API requests disabled-- using static resource");
      setStates(bakeryProducts.data.products);
      return;
    }

    // Start at first page when new filter is applied
    page.current = 1;

    if (searchTerm) {
      searchProducts(searchTerm).then((response) =>
        setStates(response.data.products)
      );
    } else {
      getProducts(
        category,
        page.current,
        characteristic ? [characteristic] : undefined,
        funTag ? [funTag] : undefined
      ).then((response) => setStates(response.data.products));
    }
  }, [category, characteristic, funTag]);

  useEffect(() => {
    console.log("shouldFetch changed states");
    if (!shouldFetch || page.current === totalPages.current) {
      console.log("not fetching any more");
      return;
    }

    // Fetch the next page
    page.current = page.current + 1;

    console.log(`fetching page ${page.current}`);
    if (searchTerm) {
      searchProducts(searchTerm).then((response) =>
        setProducts((oldProducts) => [
          ...oldProducts.at,
          ...response.data.products.items,
        ])
      );
    } else {
      getProducts(
        category,
        page.current,
        characteristic ? [characteristic] : undefined,
        funTag ? [funTag] : undefined
      ).then((response) =>
        setProducts((oldProducts) => [
          ...oldProducts,
          ...response.data.products.items,
        ])
      );
    }
    console.log("shouldFetch is false");
    setShouldFetch(false);
  }, [shouldFetch]);

  console.log("RERENDER");
  return (
    <SafeAreaView style={styles.container}>
      {categoryOptions.length > 1 && (
        <DropDownPicker
          closeAfterSelecting={true}
          open={categoryOpen}
          value={category}
          items={categoryOptions}
          setOpen={setCategoryOpen}
          setValue={setCategory}
          setItems={setCategoryOptions}
          onOpen={onCategoryOpen}
          zIndex={3000}
          zIndexInverse={1000}
          labelStyle={{
            fontSize: 16,
          }}
          listItemLabelStyle={{
            fontSize: 16,
          }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
        />
      )}
      {(characteristic || characteristicOptions.length > 1) && (
        <DropDownPicker
          closeAfterSelecting={true}
          placeholder="All Characteristics"
          open={characteristicOpen}
          value={characteristic}
          items={characteristicOptions}
          setOpen={setCharacteristicOpen}
          setValue={setCharacteristic}
          setItems={setCharacteristicOptions}
          onOpen={onCharacteristicOpen}
          zIndex={2000}
          zIndexInverse={2000}
          labelStyle={{
            fontSize: 16,
          }}
          listItemLabelStyle={{
            fontSize: 16,
          }}
          placeholderStyle={{ fontSize: 16 }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
        />
      )}
      {(funTag || funTagOptions.length > 1) && (
        <DropDownPicker
          closeAfterSelecting={true}
          placeholder="All Tags"
          open={funTagOpen}
          value={funTag}
          items={funTagOptions}
          setOpen={setFunTagOpen}
          setValue={setFunTag}
          setItems={setFunTagOptions}
          onOpen={onFunTagOpen}
          zIndex={1000}
          zIndexInverse={3000}
          labelStyle={{
            fontSize: 16,
          }}
          listItemLabelStyle={{
            fontSize: 16,
          }}
          placeholderStyle={{ fontSize: 16 }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1,
          }}
        />
      )}
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 1,
            }}
          >
            <Item item={item} navigation={navigation} />
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => `${item.sku}-${index}`}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          console.log("shouldFetch is true");
          setShouldFetch(true);
        }}
      />
    </SafeAreaView>
  );
};

export default FilteredProductsList;
