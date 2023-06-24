import React, { useContext } from 'react'
import { BodyText } from '../common/typography'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { colors } from '../../style'
import { ShoppingListContext } from '../../shoppingListContext'

const addRemoveButton = `
  padding: 16px;
  align-content: center;
  background-color: ${colors.RED};
`

const AddButton = styled.Pressable`
  ${addRemoveButton}
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
`

const RemoveButton = styled.Pressable`
  ${addRemoveButton}
  border-bottom-left-radius: 10px;
  border-top-left-radius: 10px;
`

const AddToListButton = styled.Pressable`
  background-color: ${colors.RED};
  border-radius: 10px;
  width: 100%;
`

const ButtonWrapper = styled.View`
  text-align: center;
  align-content: center;
  align-self: center;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  margin-right: 24px;
  width: 70%;
`

const ButtonText = styled(BodyText)`
  text-align: center;
  color: ${colors.WHITE};
  font-weight: bold;
  padding: 15px;
`

export const ShoppingListButton = ({ product }) => {
  const { addProductToList, removeProductFromList, shoppingListCounts } =
    useContext(ShoppingListContext)

  const listCount = shoppingListCounts[product.sku]
    ? shoppingListCounts[product.sku].count
    : 0
  const button = listCount
    ? (
    <>
      <RemoveButton
        accessibilityLabel="Remove one from list"
        onPress={() => removeProductFromList(product)}
      >
        <FontAwesomeIcon icon={faMinus} color={colors.WHITE} />
      </RemoveButton>
      <View style={{ flex: 1, backgroundColor: colors.DARK_RED }}>
        <ButtonText>{listCount}</ButtonText>
      </View>
      <AddButton
        accessibilityLabel="Add one to list"
        onPress={() => addProductToList(product)}
      >
        <FontAwesomeIcon icon={faPlus} color={colors.WHITE} />
      </AddButton>
    </>
      )
    : (
    <AddToListButton
      accessibilityLabel="Add to list"
      onPress={() => addProductToList(product)}
    >
      <ButtonText>Add to list</ButtonText>
    </AddToListButton>
      )

  return <ButtonWrapper>{button}</ButtonWrapper>
}
