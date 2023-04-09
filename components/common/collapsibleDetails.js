import React, { useState } from 'react'
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View
} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components/native'

import { Header } from '../common/typography.js'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const HeaderWrapper = styled.View`
  align-items: center;
  flex-direction: row;
`

const StyledIcon = styled(FontAwesomeIcon)`
  padding-left: 30px;
`

export const CollapsibleDetails = ({ label, children }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <View>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setExpanded(!expanded)
        }}
      >
        <HeaderWrapper>
          <Header>{label}</Header>
          {expanded
            ? (
            <StyledIcon
              icon={faChevronDown}
              size={20}
            />
              )
            : (
            <StyledIcon
              icon={faChevronRight}
              size={20}
            />
            )}
        </HeaderWrapper>
      </Pressable>
      {expanded && children}
    </View>
  )
}