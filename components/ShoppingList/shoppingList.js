import React, { useContext, useEffect, useState } from 'react'
import {
  faArrowUpFromBracket,
  faPlus,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import { ScrollView, Share, StatusBar, View } from 'react-native'
import styled from 'styled-components/native'

import { colors } from '../../style'
import {
  BodyText,
  Header,
  PrimaryButton,
  SecondaryButton,
  SmallHeader
} from '../common/typography'
import { ShoppingListItem } from './shoppingListItem'
import { ShoppingListContext } from '../../shoppingListContext'
import { getTotalPrice } from '../../util'
import { CenteredView } from '../common/layout'
import { getShareableListSections, shoppingListToSections } from './utils'
import { AddCustomItemModal } from '../common/AddCustomItemModal'

const ADD_BUTTON_HEIGHT = 60
const ADD_BUTTON_MARGIN = 12

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${StatusBar.currentHeight ?? 0}px;
  background-color: ${colors.WHITE};
`

const AddButtonSpacer = styled.View`
  height: ${ADD_BUTTON_HEIGHT + ADD_BUTTON_MARGIN}px;
`

const headerPadding = `
  padding: 10px;
  padding-left: 20px;
`

const SubHeader = styled(SmallHeader)`
  ${headerPadding}
  background-color: ${colors.LIGHT_GRAY};
`

const SectionHeader = styled(Header)`
  ${headerPadding}
  background-color: ${colors.GRAY};
`

const TotalPriceWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px;
`

const ButtonsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`

const ShoppingListSection = ({ section, navigation }) => (
  <View>
    {Object.entries(section).map(([name, value]) => {
      if (name.toLowerCase() === 'products') {
        return value.map((p) => (
          <ShoppingListItem key={p.sku} item={p} navigation={navigation} />
        ))
      }
      return (
        <View key={name}>
          <SubHeader>{name}</SubHeader>
          <ShoppingListSection section={value} navigation={navigation} />
        </View>
      )
    })}
  </View>
)

export const ShoppingList = ({ navigation }) => {
  const { clearList, shoppingListTotalCount, shoppingList } =
    useContext(ShoppingListContext)

  const [modalVisible, setModalVisible] = useState(false)

  const [listSections, setListSections] = useState({})
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setListSections(shoppingListToSections(shoppingList))
    setTotalPrice(getTotalPrice(shoppingList))
  }, [shoppingList])

  if (!shoppingListTotalCount) {
    return (
      <CenteredView>
        <BodyText style={{ textAlign: 'center', padding: 20 }}>
          You have not added any items to your shopping list yet.
        </BodyText>
        <PrimaryButton
          accessbilityLabel="Browse products"
          name="Browse products"
          onPress={() =>
            navigation.navigate('Products', { screen: 'All Products List' })
          }
          style={{
            paddingVertical: 14,
            paddingHorizontal: 20
          }}
        />
      </CenteredView>
    )
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: getShareableListSections(listSections),
        title: "Trader Joe's shopping list"
      })
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
      alert(error.message)
    }
  }

  return (
    <Container>
      <AddCustomItemModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <ScrollView>
        <ButtonsWrapper>
          <SecondaryButton
            accessbilityLabel="Clear list"
            icon={faTrashCan}
            name="Clear"
            onPress={clearList}
            style={{ flex: 1, margin: 10 }}
          />
          <SecondaryButton
            accessbilityLabel="Share list"
            icon={faArrowUpFromBracket}
            name="Share"
            onPress={onShare}
            style={{ flex: 1, margin: 10, marginLeft: 0 }}
          />
        </ButtonsWrapper>
        <TotalPriceWrapper>
          <Header>Estimated Total</Header>
          <Header>${totalPrice.toFixed(2)}</Header>
        </TotalPriceWrapper>
        {Object.entries(listSections).map(([name, s]) => (
          <View key={name}>
            {name.toLowerCase() !== 'products' &&
              (s.products.length > 0 || Object.keys(s).length > 1) && (
                <SectionHeader>{name}</SectionHeader>
            )}
            <ShoppingListSection
              section={s}
              navigation={navigation}
              shoppingList={shoppingList}
            />
          </View>
        ))}
        <AddButtonSpacer />
      </ScrollView>
      <PrimaryButton
        name="New item"
        accessbilityLabel="New item"
        icon={faPlus}
        onPress={() => setModalVisible(true)}
        style={{
          bottom: 0,
          margin: ADD_BUTTON_MARGIN,
          position: 'absolute',
          right: 0,
          paddingVertical: 14,
          paddingHorizontal: 20
        }}
      />
    </Container>
  )
}
