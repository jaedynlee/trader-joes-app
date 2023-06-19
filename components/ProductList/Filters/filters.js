import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components/native'

import { colors } from '../../../style.js'
import { BodyText } from '../../common/typography.js'
import { FilterTag } from './FilterTag.js'
import { FilterModal } from './FilterModal.js'

const FilterBar = styled.View`
  zindex: 1000;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 10px 15px;
  align-items: center;
`

const FilterButtonText = styled(BodyText)`
 font-weight: bold;
 color: ${colors.RED}
 padding-right: 15px;
`

const FilterButtonIcon = styled(FontAwesomeIcon)`
  margin-right: 8px;
`

const FilterButton = styled.Pressable`
  flex-direction: row;
`

export const Filters = ({
  categoryPickerProps,
  characteristicPickerProps,
  funTagPickerProps
}) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <FilterBar>
      <FilterButton onPress={() => setModalVisible(true)}>
        <FilterButtonIcon icon={faFilter} color={colors.RED} />
        <FilterButtonText>Filter results</FilterButtonText>
      </FilterButton>

      <FilterTag label={categoryPickerProps.displayValue} />
      <FilterTag label={characteristicPickerProps.displayValue} />
      <FilterTag label={funTagPickerProps.displayValue} />

      <FilterModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        categoryPickerProps={categoryPickerProps}
        characteristicPickerProps={characteristicPickerProps}
        funTagPickerProps={funTagPickerProps}
      />
    </FilterBar>
  )
}
