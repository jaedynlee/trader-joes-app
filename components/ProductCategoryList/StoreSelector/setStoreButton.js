import React from 'react'
import styled from 'styled-components/native'

import { colors } from '../../../style'
import { Link } from '../../common/typography'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

const SetStoreButtonWrapper = styled.Pressable`
  flex-direction: row;
  margin-bottom: 10px;
`

export const SetStoreButton = ({ setModalVisible, label }) => (
  <SetStoreButtonWrapper
    accessibilityLabel="Set store location"
    onPress={() => setModalVisible(true)}
  >
    <FontAwesomeIcon icon={faLocationDot} color={colors.RED} />
    <Link> {label}</Link>
  </SetStoreButtonWrapper>
)
