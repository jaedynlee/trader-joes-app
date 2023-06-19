import DropDownPicker from 'react-native-dropdown-picker'
import React from 'react'

import { SmallHeader } from '../../common/typography'

export const DropDown = ({ label, pickerProps, zIndex, zIndexInverse }) => {
  if (pickerProps.items.length <= 1) {
    return null
  }

  return (
    <>
      <SmallHeader style={{ marginTop: 30 }}>{label}</SmallHeader>
      <DropDownPicker
        closeAfterSelecting={true}
        {...pickerProps}
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        labelStyle={{
          fontSize: 16
        }}
        listItemLabelStyle={{
          fontSize: 16
        }}
      />
    </>
  )
}
