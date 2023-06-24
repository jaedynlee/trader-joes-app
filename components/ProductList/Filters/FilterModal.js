import React from 'react'

import { Modal } from '../../common/Modal'
import { DropDown } from './DropDown'

export const FilterModal = ({
  setModalVisible,
  visible,
  categoryPickerProps,
  characteristicPickerProps,
  funTagPickerProps
}) => {
  return (
    <Modal
      title="Filter results"
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      onSave={() => setModalVisible(false)}
      content={
        <>
          <DropDown
            label="Category"
            pickerProps={categoryPickerProps}
            zIndex={3000}
            zIndexInverse={1000}
          />
          <DropDown
            label="Characteristic"
            pickerProps={characteristicPickerProps}
            zIndex={2000}
            zIndexInverse={2000}
          />
          <DropDown
            label="Tag"
            pickerProps={{ ...funTagPickerProps, placeholder: 'All Tags' }}
            zIndex={1000}
            zIndexInverse={3000}
          />
        </>
      }
    />
  )
}
