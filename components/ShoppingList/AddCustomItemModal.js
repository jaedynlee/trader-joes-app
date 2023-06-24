import { TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DropDownPicker from 'react-native-dropdown-picker'

import { CATEGORY_NAMES } from './constants'
import { Modal } from '../common/Modal'
import { ShoppingListContext } from '../../shoppingListContext'
import { SmallHeader } from '../common/typography'

export const AddCustomItemModal = ({ visible, setModalVisible }) => {
  const { updateShoppingListCount } = useContext(ShoppingListContext)
  const [itemName, setItemName] = useState()
  const [categoryName, setCategoryName] = useState()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const addProductToList = (product) => updateShoppingListCount(product, 1)

  return (
    <Modal
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      onSave={() => {
        // TODO make sure something is selected
        addProductToList({
          sku: `custom-${uuidv4()}`,
          item_title: itemName,
          category_hierarchy: [{ name: 'Products' }, { name: categoryName }]
        })
        setModalVisible(false)
      }}
      title="Add custom item"
      content={
        <>
          <SmallHeader style={{ marginTop: 30 }}>Name</SmallHeader>
          <TextInput
            onChangeText={setItemName}
            value={itemName}
            style={{ borderBottomWidth: 1, paddingTop: 10, fontSize: 16 }}
          />
          <SmallHeader style={{ marginTop: 30 }}>Category</SmallHeader>
          <DropDownPicker
            label="Category"
            onClose={() => setDropdownOpen(false)}
            onOpen={() => setDropdownOpen(true)}
            open={dropdownOpen}
            setValue={setCategoryName}
            value={categoryName}
            zIndex={3000}
            zIndexInverse={1000}
            items={CATEGORY_NAMES.map((name) => ({
              label: name,
              value: name,
              key: name
            }))}
          />
        </>
      }
    />
  )
}
