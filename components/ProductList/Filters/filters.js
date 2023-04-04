import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import React from 'react'

export const Filters = ({
  expanded,
  categoryPickerProps,
  characteristicPickerProps,
  funTagPickerProps
}) => {
  if (!expanded) return null

  return (
    <View style={{ zIndex: 1000 }}>
      {categoryPickerProps.items.length > 1 && (
        <DropDownPicker
          closeAfterSelecting={true}
          {...categoryPickerProps}
          zIndex={3000}
          zIndexInverse={1000}
          labelStyle={{
            fontSize: 16
          }}
          listItemLabelStyle={{
            fontSize: 16
          }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1
          }}
        />
      )}
      {(characteristicPickerProps.item ||
        characteristicPickerProps.items.length > 1) && (
        <DropDownPicker
          closeAfterSelecting={true}
          {...characteristicPickerProps}
          zIndex={2000}
          zIndexInverse={2000}
          labelStyle={{
            fontSize: 16
          }}
          listItemLabelStyle={{
            fontSize: 16
          }}
          placeholderStyle={{ fontSize: 16 }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1
          }}
        />
      )}
      {(funTagPickerProps.item || funTagPickerProps.items.length > 1) && (
        <DropDownPicker
          closeAfterSelecting={true}
          placeholder="All Tags"
          {...funTagPickerProps}
          zIndex={1000}
          zIndexInverse={3000}
          labelStyle={{
            fontSize: 16
          }}
          listItemLabelStyle={{
            fontSize: 16
          }}
          placeholderStyle={{ fontSize: 16 }}
          style={{
            borderWidth: 0,
            borderBottomWidth: 1
          }}
        />
      )}
    </View>
  )
}
