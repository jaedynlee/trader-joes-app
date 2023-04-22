import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'

import { getNearbyStores } from '../../../client/client'
import { colors } from '../../../style'
import { BodyText, Link } from '../../common/typography'
import SearchBar from '../searchBar'
import { CenteredView } from '../../common/layout'
import { StoreDetails } from './storeDetails'

const ModalView = styled.View`
  height: 100%;
  width: 100%;
  background-color: ${colors.WHITE};
  padding: 20px;
  align-items: center;
`

const StyledFlatList = styled.FlatList`
  padding: 5px;
  width: 100%;
`

export const StoreSelectorModal = ({
  visible,
  setModalVisible,
  selectedLocation,
  setLocation
}) => {
  const text = useRef()
  const [results, setResults] = useState([])
  const [errorMessage, setErrorMessage] = useState()

  const getResults = (newText) => {
    text.current = newText.trim()
    if (!newText.trim()) {
      return
    }
    getNearbyStores(newText.trim()).then((response) => {
      if (response.collection) {
        setErrorMessage(undefined)
        setResults(response.collection)
      } else {
        setErrorMessage(
          "Couldn't locate any stores near there! Please try again with a different ZIP code."
        )
        setResults([])
      }
    })
  }

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
          <Pressable
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              alignItems: 'center'
            }}
            onPress={() => setModalVisible(false)}
          >
            <FontAwesomeIcon icon={faXmark} size={16} color={colors.RED} />
            <Link
              accessibilityLabel="Close store selection view"
              style={[{ paddingLeft: 3 }]}
            >
              Close
            </Link>
          </Pressable>
          <StyledFlatList
            ListHeaderComponent={() => (
              <SearchBar
                initialText={text.current}
                placeholder="Enter ZIP or City, State"
                onEndEditing={getResults}
                hideClearButton={true}
              />
            )}
            data={results}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth
                }}
              />
            )}
            ListEmptyComponent={() => (
              <CenteredView>
                <BodyText>{errorMessage}</BodyText>
              </CenteredView>
            )}
            renderItem={(i) => (
              <StoreDetails
                store={i.item}
                selectedLocation={selectedLocation}
                onSelectLocation={(location) => {
                  setLocation(location)
                  setModalVisible(false)
                }}
              />
            )}
          />
        </ModalView>
      </CenteredView>
    </Modal>
  )
}
