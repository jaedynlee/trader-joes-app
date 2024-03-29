import React from 'react'
import styled from 'styled-components/native'

import { Tag } from '../common/tag'

const TagsWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

export const ProductCharacteristics = ({ characteristics }) => (
  <TagsWrapper>
    {characteristics?.map((c) => (
      <Tag label={c} key={c} />
    ))}
  </TagsWrapper>
)
