import React, { useEffect, useState } from 'react'

import { StyleSheet, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { colors } from '../../style.js'
import PriceDetails from './priceDetails.js'
import Ingredients from './ingredients.js'
import { ProductCharacteristics } from './productCharacteristics'
import Story from './story.js'
import { LegalText } from '../common/typography'
import Nutrition from './nutrition.js'
import { getProductBySku } from '../../client/client'
import { ShoppingListButton } from './shoppingListButton.js'
import { getLocation } from '../../storage.js'

const StyledScrollView = styled.ScrollView`
  background-color: ${colors.WHITE};
  flex: 1;
  padding: 10px 24px;
`

const ImageWrapper = styled.View`
  margin-bottom: 10px;
  max-height: 150px;
  width: 100%;
`

const ProductImage = styled.Image`
  height: 100%;
  width: 100%;
`

const Footer = styled.View`
  align-self: center;
  box-shadow: 0px -5px 5px ${colors.LIGHT_GRAY};
  background-color: ${colors.WHITE};
  bottom: 0px;
  display: flex;
  flex-direction: row;
  position: absolute;
  width: 100%;
`

const HorizontalRule = styled.View`
  border-bottom-color: ${colors.DARK_GRAY};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  padding-top: 30px;
  margin-bottom: 10px;
`

const ProductDetails = ({
  route: {
    params: { sku }
  }
}) => {
  const [product, setProduct] = useState(undefined)

  useEffect(() => {
    getLocation().then((location) =>
      getProductBySku(location.clientkey, sku).then((response) =>
        setProduct(response.data.products.items[0])
      )
    )
  }, [])

  if (!product) {
    return (
      <ActivityIndicator
        size="large"
        animating={true}
        style={{ flex: 1, alignSelf: 'center' }}
      />
    )
  }

  return (
    <>
      <StyledScrollView>
        <ImageWrapper>
          <ProductImage
            resizeMode="contain"
            source={{
              uri: `https://www.traderjoes.com${product.primary_image}`
            }}
          />
        </ImageWrapper>
        {product.item_characteristics && (
          <ProductCharacteristics
            characteristics={product.item_characteristics}
          />
        )}
        {product.item_story_marketing && (
          <Story summary={product.item_story_marketing} />
        )}
        {product.ingredients && product.ingredients.length > 0 && (
          <Ingredients
            ingredients={product.ingredients}
            allergens={product.allergens}
          />
        )}
        {product.nutrition && product.nutrition.length > 0 && (
          <Nutrition nutrition={product.nutrition[0]} />
        )}
        <HorizontalRule />
        <LegalText style={{ paddingBottom: 120 }}>
          {
            "NOTE: The details of this item may have changed since posting. Contact your local Trader Joe's for current price and availability."
          }
        </LegalText>
      </StyledScrollView>
      <Footer>
        <PriceDetails product={product} />
        <ShoppingListButton product={product} />
      </Footer>
    </>
  )
}

export default ProductDetails
