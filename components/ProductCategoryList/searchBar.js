import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import { Pressable } from 'react-native'
import styled from 'styled-components/native'

import { colors } from '../../style'

const Container = styled.View`
  align-items: center;
  border-radius: 10px;
  border-width: 1px;
  flex-direction: row;
  justify-content: space-between;
`

const StyledTextInput = styled.TextInput`
  font-size: 16px;
  line-height: 20px;
  padding: 15px;
`

const ClearButton = styled(Pressable)`
  padding: 15px;
`

const SearchBar = ({
  initialText,
  placeholder,
  onEndEditing,
  keyboardType
}) => {
  const [text, setText] = React.useState(initialText)

  return (
    <Container>
      <StyledTextInput
        onChangeText={setText}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={colors.DARK_GRAY}
        keyboardType={keyboardType}
        onSubmitEditing={() => onEndEditing(text)}
        returnKeyType="search"
      />
      {text && (
        <ClearButton
          accessibilityLabel="Clear search bar"
          color={colors.RED}
          onPress={() => setText(undefined)}
        >
          <FontAwesomeIcon icon={faXmark} size={20} color={colors.RED} />
        </ClearButton>
      )}
    </Container>
  )
}

export default SearchBar
