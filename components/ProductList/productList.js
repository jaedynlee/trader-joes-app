import React, { useEffect, useState, useRef, useContext } from 'react'
import { View, FlatList, StatusBar, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { getProducts } from '../../client/client'
import {
  BodyText,
  PrimaryButton,
  SecondaryButton
} from '../common/typography.js'
import Item from './productItem.js'
import { Filters } from './Filters/filters.js'
import { useProductFilters } from './hooks/useProductFilters.js'
import { CenteredView } from '../common/layout.js'
import { ShoppingListContext } from '../../shoppingListContext'
import { AddCustomItemModal } from '../common/AddCustomItemModal'

const Container = styled.SafeAreaView`
  padding-top: ${StatusBar.currentHeight ?? 0}px;
`

const EmptyListWrapper = styled(CenteredView)`
  padding: 36px;
`

const StyledActivityIndicator = styled(ActivityIndicator)`
  padding: 20px 0 60px 0;
`

const FilteredProductsList = ({ route, navigation }) => {
  const { shoppingList } = useContext(ShoppingListContext)
  const { searchTerm, categoryId, storeCode } = route.params
  const [loading, setLoading] = useState(false)
  const [isAddCustomItemModalVisible, setIsAddCustomItemModalVisible] =
    useState(false)

  const flatListRef = useRef()

  const [shouldFetch, setShouldFetch] = useState(true)
  const [fetchedAllPages, setFetchedAllPages] = useState(false)
  const page = useRef(1)
  const totalPages = useRef(undefined)

  const [products, setProducts] = useState([])
  const [aggregations, setAggregations] = useState()

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
      if (products.total_count && flatListRef.current) {
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

  const filterable =
    !!categoryFilter.items.length ||
    !!characteristicFilter.items.length ||
    !!funTagFilter.items.length

  return (
    <Container>
      <AddCustomItemModal
        visible={isAddCustomItemModalVisible}
        setModalVisible={setIsAddCustomItemModalVisible}
        initialItemName={searchTerm}
      />
      {filterable && (
        <Filters
          categoryPickerProps={categoryFilter}
          characteristicPickerProps={characteristicFilter}
          funTagPickerProps={funTagFilter}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={products}
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
              count={shoppingList[item.sku] ? shoppingList[item.sku].count : 0}
              navigation={navigation}
            />
          </View>
        )}
        numColumns={2}
        keyExtractor={(item, index) => `${item.sku}-${index}`}
        onEndReachedThreshold={1}
        onEndReached={() => setShouldFetch(true)}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        ListEmptyComponent={() => (
          <EmptyListWrapper>
            {loading
              ? (
              <ActivityIndicator size="large" animating={true} />
                )
              : (
              <>
                <BodyText>{`No results found for "${searchTerm}".`}</BodyText>

                <BodyText style={{ paddingTop: 10 }}>
                  Please try a different search term or add this item to your
                  shopping list manually.
                </BodyText>
                <PrimaryButton
                  accessibilityLabel="Add to list"
                  name="Add to list"
                  onPress={() => setIsAddCustomItemModalVisible(true)}
                  style={{ marginTop: 20 }}
                />
                <SecondaryButton
                  accessibilityLabel="Back to all products"
                  style={{ marginTop: 20 }}
                  name="Back to all products"
                  onPress={() =>
                    navigation.navigate('Products', {
                      screen: 'All Products List'
                    })
                  }
                />
              </>
                )}
          </EmptyListWrapper>
        )}
        ListFooterComponent={() =>
          fetchedAllPages
            ? (
            <View style={{ marginBottom: 60 }}></View>
              )
            : (
            <StyledActivityIndicator
              size="large"
              animating={products.length > 0 && !fetchedAllPages}
            />
              )
        }
      />
    </Container>
  )
}

export default FilteredProductsList
