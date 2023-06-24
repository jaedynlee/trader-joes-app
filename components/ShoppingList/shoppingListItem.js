import {
  faArrowUpRightFromSquare,
  faCheckSquare,
  faTrash
} from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useContext } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '../../style'
import { BodyText } from '../common/typography'
import { ShoppingListContext } from '../../shoppingListContext'

export const ShoppingListItem = ({ item, navigation }) => {
  const { updateProductChecked, removeProductFromList } =
    useContext(ShoppingListContext)
  const { checked, count, sku } = item

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <Pressable
          onPress={() => updateProductChecked(sku, !checked)}
          style={{ paddingVertical: 10, paddingLeft: 20, paddingRight: 10 }}
        >
          <FontAwesomeIcon
            size={24}
            icon={checked ? faCheckSquare : faSquare}
            color={checked ? colors.DARK_GRAY : undefined}
          />
        </Pressable>
        <BodyText
          style={{ ...styles.productName, ...(checked ? styles.checked : {}) }}
          numberOfLines={2}
        >
          {count > 1 && `[${count}] `}
          {item.name}
        </BodyText>
      </View>
      <BodyText style={{ ...styles.price, ...(checked ? styles.checked : {}) }}>
        {Number(item.price)
          ? `$${(parseFloat(item.price) * count).toFixed(2)}`
          : ''}
        {sku.startsWith('custom')
          ? (
          <Pressable
            style={{ paddingLeft: 5, marginBottom: -1 }}
            onPress={() => removeProductFromList(sku)}
          >
            <FontAwesomeIcon icon={faTrash} color={colors.RED} />
          </Pressable>
            )
          : (
          <Pressable
            style={{ paddingLeft: 5, marginBottom: -1 }}
            onPress={() =>
              navigation.navigate('List Product Details', {
                name: item.name,
                sku
              })
            }
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              color={colors.RED}
            />
          </Pressable>
            )}
      </BodyText>
    </View>
  )
}

const styles = StyleSheet.create({
  productName: {
    flex: 1,
    paddingRight: 10
  },
  checked: {
    color: colors.DARK_GRAY
  }
})
