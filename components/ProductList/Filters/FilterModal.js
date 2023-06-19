import { Modal } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'

import { colors } from '../../../style'
import { CenteredView } from '../../common/layout'
import { DropDown } from './DropDown'
import { PrimaryButton, Header } from '../../common/typography'

const ModalView = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${colors.WHITE};
  padding: 50px 20px;
`

const ButtonsWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`

export const FilterModal = ({
  setModalVisible,
  visible,
  categoryPickerProps,
  characteristicPickerProps,
  funTagPickerProps
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setModalVisible(false)
      }}
    >
      <CenteredView>
        <ModalView>
          <Header style={{ marginTop: 30 }}>Filter results</Header>
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

          <ButtonsWrapper>
            <PrimaryButton
              accessbilityLabel="Apply filters"
              name="Apply filters"
              onPress={() => setModalVisible(false)}
            />
          </ButtonsWrapper>
        </ModalView>
      </CenteredView>
    </Modal>
  )
}
