import React, { useContext } from 'react'
import {
  faArrowUpFromBracket,
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
import ShoppingListItem from './shoppingListItem'
import { ShoppingListContext } from '../../shoppingListContext'
import { getTotalPrice } from '../../util'
import { CenteredView } from '../common/layout'
import { getShareableListSections, shoppingListToSections } from './utils'

const Container = styled.SafeAreaView`
  flex: 1;
  padding-top: ${StatusBar.currentHeight ?? 0}px;
  background-color: ${colors.WHITE};
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
  padding: 20px 10px;
`

const ButtonsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`

export const ShoppingListSection = ({ products, subsections, navigation }) => (
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
          <SubHeader>{s.name}</SubHeader>
          <ShoppingListSection
            products={s.products}
            subsections={s.subsections}
            navigation={navigation}
          />
        </View>
      ))}
  </View>
)

export const ShoppingList = ({ navigation }) => {
  const { clearList, shoppingList, shoppingListItemCount } =
    useContext(ShoppingListContext)

  if (shoppingListItemCount === 0) {
    return (
      <CenteredView>
        <BodyText style={{ textAlign: 'center', padding: 20 }}>
          You have not added any items to your shopping list yet.
        </BodyText>
        <PrimaryButton
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

  const listSections = shoppingListToSections(shoppingList)
  const totalPrice = getTotalPrice(shoppingList)

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
      <ScrollView>
        <ButtonsWrapper>
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
        </ButtonsWrapper>
        <TotalPriceWrapper>
          <Header>Total</Header>
          <Header>${totalPrice.toFixed(2)}</Header>
        </TotalPriceWrapper>
        {listSections.map((s) => (
          <View key={s.name}>
            <SectionHeader>{s.name}</SectionHeader>
            <ShoppingListSection
              products={s.products}
              subsections={s.subsections}
              navigation={navigation}
            />
          </View>
        ))}
      </ScrollView>
    </Container>
  )
}
