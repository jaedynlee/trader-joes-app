import {
  faArrowUpRightFromSquare,
  faCheckSquare
} from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { memo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '../../style'
import { BodyText } from '../common/typography'

const ShoppingListItem = ({ item, sku, navigation }) => {
  const [checked, setChecked] = useState(item.checked)

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
          onPress={() => setChecked(!checked)}
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
          {item.count > 1 && `[${item.count}] `}
          {item.item_title}
        </BodyText>
      </View>
      <BodyText style={{ ...styles.price, ...(checked ? styles.checked : {}) }}>
        {Number(item.price)
          ? `$${(parseFloat(item.price) * item.count).toFixed(2)}`
          : ''}
        <Pressable
          style={{ paddingLeft: 5, marginBottom: -1 }}
          onPress={() =>
            navigation.navigate('List Product Details', {
              name: item.item_title,
              sku
            })
          }
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} color={colors.RED} />
        </Pressable>
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

export default memo(
  ShoppingListItem,
  (prev, next) => prev.item.count === next.item.count
)
