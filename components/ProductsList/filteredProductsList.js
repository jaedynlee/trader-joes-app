import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../style.js";
import { getProducts } from "../../client/client";
import { BodyText } from "../common/typography.js";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { getShoppingListCounts } from "../../storage.js";
import Item from "./productItem.js";
import { useIsFocused } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE,
  },
});

const FilteredProductsList = ({ route, navigation }) => {
  const { searchTerm, categoryId, storeCode } = route.params;

  const flatListRef = useRef();

  const isFocused = useIsFocused();
  const [shoppingListCounts, setShoppingListCounts] = useState({});

  const [shouldFetch, setShouldFetch] = useState(true);
  const [fetchedAllPages, setFetchedAllPages] = useState(false);
  const page = useRef(1);
  const totalPages = useRef(undefined);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(categoryId ?? "all-categories");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [characteristic, setCharacteristic] = useState(null);
  const [characteristicOpen, setCharacteristicOpen] = useState(false);
  const [characteristicOptions, setCharacteristicOptions] = useState([]);

  const [funTag, setFunTag] = useState(null);
  const [funTagOpen, setFunTagOpen] = useState(false);
  const [funTagOptions, setFunTagOptions] = useState([]);

  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  // Refetch counts when coming back to the page
  useEffect(() => {
    getShoppingListCounts().then((shoppingListCounts) =>
      setShoppingListCounts(shoppingListCounts)
    );
  }, [isFocused]);

  const setStates = (products) => {
    setProducts(products.items ?? []);
    totalPages.current = products.page_info.total_pages;
    if (products.page_info.total_pages === 1) {
      setFetchedAllPages(true);
    }
    setShouldFetch(false);
    const aggregations = products.aggregations;

    const cateoryAggregation = aggregations.find(
      (a) => a.attribute_code === "category_id"
    );
    cateoryAggregation &&
      setCategoryOptions([
        {
          label: categoryId ? `All ${route.params.name}` : "All Categories",
          value: categoryId ?? "all-categories",
          key: "all-categories",
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
          key: "all-characteristics",
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
          key: "all-tags",
        },
        ...funTagAggregation.options.map((o) =>
          aggregationOptionToDropdownOption(o)
        ),
      ]);

    // Go to beginning of list
    if (products.total_count) {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    // Start at first page when new filter is applied
    page.current = 1;

    getProducts(
      storeCode,
      category === "all-categories" ? undefined : category,
      page.current,
      searchTerm,
      characteristic ? [characteristic] : undefined,
      funTag ? [funTag] : undefined
    ).then((response) => setStates(response.data.products));
  }, [category, characteristic, funTag]);

  useEffect(() => {
    if (!shouldFetch || fetchedAllPages) return;

    if (page.current === totalPages.current) {
      setFetchedAllPages(true);
      return;
    }

    // Fetch the next page
    page.current = page.current + 1;

    getProducts(
      storeCode,
      category === "all" ? undefined : category,
      page.current,
      searchTerm,
      characteristic ? [characteristic] : undefined,
      funTag ? [funTag] : undefined
    ).then((response) =>
      setProducts((oldProducts) => [
        ...oldProducts,
        ...response.data.products.items,
      ])
    );
    setShouldFetch(false);
  }, [shouldFetch]);

  useEffect(() => {
    // If necessary, add blank product to even out the number of elements
    if (products.length % 2 === 0) {
      return;
    }
    setProducts([...products, {}]);
  }, [products]);

  const filters = (
    <View style={{ zIndex: 1000 }}>
      {categoryOptions.length > 1 && (
        <DropDownPicker
          closeAfterSelecting={true}
          placeholder="All Categories"
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {filtersExpanded && filters}
      <FlatList
        ref={flatListRef}
        data={products}
        ListHeaderComponent={() => (
          <Pressable
            style={{ flexDirection: "row", padding: 15 }}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
          >
            <FontAwesomeIcon
              icon={faFilter}
              color={colors.RED}
              style={{ marginRight: 8 }}
            />
            <BodyText style={{ fontWeight: "bold", color: colors.RED }}>
              {filtersExpanded ? "Hide" : "Show"} filters
            </BodyText>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              margin: 1,
            }}
          >
            <Item
              item={item}
              count={shoppingListCounts[item.sku] ?? 0}
              navigation={navigation}
            />
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => `${item.sku}-${index}`}
        onEndReachedThreshold={1}
        onEndReached={() => {
          setShouldFetch(true);
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              marginTop: 240,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                animating={true}
                style={{ flex: 1, alignSelf: "center" }}
              />
            ) : (
              <BodyText style={{ flex: 1, alignSelf: "center" }}>
                Couldn't find any results.
              </BodyText>
            )}
          </View>
        )}
        ListFooterComponent={() => (
          <ActivityIndicator
            size="large"
            animating={products.length && !fetchedAllPages}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default FilteredProductsList;
