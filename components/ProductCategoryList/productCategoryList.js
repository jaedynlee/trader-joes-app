import React, { useEffect, useState } from 'react'
import {
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  Pressable,
  ActivityIndicator
} from 'react-native'
import styled from 'styled-components/native'

import { colors } from '../../style.js'
import { getProductCategories } from '../../client/client'
import { BodyText, Header } from '../common/typography'
import SearchBar from './searchBar'
import { getLocation } from '../../storage/location'
import { StoreSelectorModal } from './StoreSelector/storeSelectorModal'
import { SetStoreButton } from './StoreSelector/setStoreButton'
import { CenteredView } from '../common/layout'

const ItemText = styled(BodyText)`
  padding: 10px 20px;
`

const Item = ({ id, title, navigation }) => {
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Filtered Products List', {
          name: title,
          categoryId: id
        })
      }}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? colors.GRAY : colors.WHITE
        }
      ]}
    >
      <ItemText>{title}</ItemText>
    </Pressable>
  )
}

const Container = styled(SafeAreaView)`
  background-color: ${colors.WHITE}
  flex: 1;
  padding-top: ${StatusBar.currentHeight ?? 0}px;
`

const StyledHeader = styled(Header)`
  background-color: ${colors.GRAY};
  padding: 10px;
  padding-left: 20px;
`

export const ProductCategoryList = ({ navigation }) => {
  const [products, setProducts] = useState([])
  const [location, setLocation] = useState()

  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    // On initial screen load, set location from database
    getLocation().then((location) => {
      setLocation(location)
    })
  }, [])

  useEffect(() => {
    // Fetch product list when location is set or changes
    if (!location) {
      return
    }

    getProductCategories().then((response) => {
      const productCategories = response.data.categoryList[0].children
      const sections = productCategories.map((category) => ({
        title: category.name,
        data: category.children.length ? category.children : [category]
      }))
      setProducts(sections)
    })
  }, [location])

  const storeModal = (
    <StoreSelectorModal
      visible={modalVisible}
      setModalVisible={setModalVisible}
      selectedLocation={location}
      setLocation={setLocation}
    />
  )

  if (!location) {
    return (
      <Container>
        {storeModal}
        <CenteredView>
          <SetStoreButton
            setModalVisible={setModalVisible}
            label="Set your store"
          />
        </CenteredView>
      </Container>
    )
  }

  return (
    <Container>
      {storeModal}
      <SectionList
        sections={products}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} navigation={navigation} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <StyledHeader>{title}</StyledHeader>
        )}
        ListEmptyComponent={() => {
          if (!location) {
            return <BodyText>Please set a store to view products.</BodyText>
          }
          return (
            <CenteredView>
              <ActivityIndicator size="large" animating={true} />
            </CenteredView>
          )
        }}
        ListHeaderComponent={() => (
          <View style={{ padding: 10 }}>
            <SetStoreButton
              accessibilityLabel={!!location && location.name}
              setModalVisible={setModalVisible}
              label={!!location && location.name}
            />
            <SearchBar
              placeholder="Search all products"
              onEndEditing={(text) =>
                text &&
                navigation.navigate('Filtered Products List', {
                  name: `Results for "${text.trim()}"`,
                  searchTerm: text.trim(),
                  storeCode: location.clientkey
                })
              }
            />
          </View>
        )}
      />
    </Container>
  )
}
