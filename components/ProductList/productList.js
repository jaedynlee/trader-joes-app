import React, { useEffect, useState, useRef } from 'react'
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Pressable,
  ActivityIndicator
} from 'react-native'
import { colors } from '../../style.js'
import { getProducts } from '../../client/client'
import { BodyText } from '../common/typography.js'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { getShoppingListCounts } from '../../storage.js'
import Item from './productItem.js'
import { useIsFocused } from '@react-navigation/native'
import { Filters } from './Filters/filters.js'
import { useProductFilters } from './hooks/useProductFilters.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.WHITE
  }
})

const FilteredProductsList = ({ route, navigation }) => {
  const { searchTerm, categoryId, storeCode } = route.params
  const [loading, setLoading] = useState(false)

  const flatListRef = useRef()

  const isFocused = useIsFocused()
  const [shoppingListCounts, setShoppingListCounts] = useState({})

  const [shouldFetch, setShouldFetch] = useState(true)
  const [fetchedAllPages, setFetchedAllPages] = useState(false)
  const page = useRef(1)
  const totalPages = useRef(undefined)

  const [products, setProducts] = useState([])
  const [aggregations, setAggregations] = useState()

  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const { categoryFilter, characteristicFilter, funTagFilter } =
    useProductFilters(aggregations, categoryId)

  const fetchProducts = () =>
    getProducts(
      storeCode,
      categoryFilter.value === 'all-categories'
        ? undefined
        : categoryFilter.value,
      page.current,
      searchTerm,
      characteristicFilter.value === 'all-characteristics'
        ? undefined
        : [characteristicFilter.value],
      funTagFilter.value === 'all-tags' ? undefined : [funTagFilter.value]
    )

  // Re-fetch product list when filters change
  useEffect(() => {
    setLoading(true)
    setProducts([])

    // Start at first page when new filter is applied
    page.current = 1

    fetchProducts().then(({ data: { products } }) => {
      setProducts(products.items ?? [])
      totalPages.current = products.page_info.total_pages
      if (products.page_info.total_pages <= 1) {
        setFetchedAllPages(true)
      }
      setShouldFetch(false)
      setAggregations(products.aggregations)

      // Go to beginning of list
      if (products.total_count) {
        flatListRef.current.scrollToIndex({ animated: true, index: 0 })
      }
      setLoading(false)
    })
  }, [categoryFilter.value, characteristicFilter.value, funTagFilter.value])

  // Fetch next page of results if applicable
  useEffect(() => {
    if (!shouldFetch || fetchedAllPages) return

    if (page.current >= totalPages.current) {
      setFetchedAllPages(true)
      return
    }

    page.current = page.current + 1

    setLoading(true)
    fetchProducts().then((response) => {
      setProducts((oldProducts) => [
        ...oldProducts,
        ...response.data.products.items
      ])
      setLoading(false)
    })
    setShouldFetch(false)
  }, [shouldFetch])

  // If necessary, add blank product to even out the number of elements
  useEffect(() => {
    if (products.length % 2 === 0) {
      return
    }
    setProducts([...products, {}])
  }, [products])

  // Refetch counts when coming back to the page
  useEffect(() => {
    getShoppingListCounts().then((shoppingListCounts) =>
      setShoppingListCounts(shoppingListCounts)
    )
  }, [isFocused])

  return (
    <SafeAreaView style={styles.container}>
      <Filters
        categoryPickerProps={categoryFilter}
        characteristicPickerProps={characteristicFilter}
        expanded={filtersExpanded}
        funTagPickerProps={funTagFilter}
      />
      <FlatList
        ref={flatListRef}
        data={products}
        ListHeaderComponent={() => (
          <Pressable
            style={{ flexDirection: 'row', padding: 15 }}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
          >
            <FontAwesomeIcon
              icon={faFilter}
              color={colors.RED}
              style={{ marginRight: 8 }}
            />
            <BodyText style={{ fontWeight: 'bold', color: colors.RED }}>
              {filtersExpanded ? 'Hide' : 'Show'} filters
            </BodyText>
          </Pressable>
        )}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 1
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
          setShouldFetch(true)
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              marginTop: 240,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                animating={true}
                style={{ flex: 1, alignSelf: 'center' }}
              />
            ) : (
              <BodyText style={{ flex: 1, alignSelf: 'center' }}>
                {"Couldn't find any results."}
              </BodyText>
            )}
          </View>
        )}
        ListFooterComponent={() => (
          <ActivityIndicator
            size="large"
            animating={products.length > 0 && !fetchedAllPages}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default FilteredProductsList
