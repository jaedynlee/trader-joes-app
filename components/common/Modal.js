import { Modal as ReactNativeModal } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'

import { colors } from '../../style'
import { CenteredView } from '../common/layout'
import { Header, PrimaryButton, SecondaryButton } from '../common/typography'

const ModalView = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${colors.WHITE};
  padding: 50px 20px;
`

const Buttons = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const ButtonsContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
`

export const Modal = ({ title, visible, onRequestClose, onSave, content }) => {
  return (
    <ReactNativeModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <CenteredView>
        <ModalView>
          <Header style={{ marginTop: 30 }}>{title}</Header>
          {content}
          <ButtonsContainer>
            <Buttons>
              <SecondaryButton
                accessbilityLabel="Cancel"
                name="Cancel"
                onPress={onRequestClose}
                style={{ flex: 1, margin: 10 }}
              />
              <PrimaryButton
                accessbilityLabel="Save"
                name="Save"
                onPress={onSave}
                style={{ flex: 1, margin: 10, marginLeft: 0 }}
              />
            </Buttons>
          </ButtonsContainer>
        </ModalView>
      </CenteredView>
    </ReactNativeModal>
  )
}
