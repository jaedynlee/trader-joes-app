import React, { useState } from 'react'
import {
  LayoutAnimation,
  Platform,
  Pressable,
  UIManager,
  View
} from 'react-native'
import { Header } from '../common/typography.js'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faChevronDown,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const CollapsibleDetails = ({ label, children }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <View>
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          setExpanded(!expanded)
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Header>{label}</Header>
          {expanded
            ? (
            <FontAwesomeIcon
              icon={faChevronDown}
              size={20}
              style={{ paddingLeft: 30 }}
            />
              )
            : (
            <FontAwesomeIcon
              icon={faChevronRight}
              size={20}
              style={{ paddingLeft: 30 }}
            />
              )}
        </View>
      </Pressable>
      {expanded && children}
    </View>
  )
}

export default CollapsibleDetails
