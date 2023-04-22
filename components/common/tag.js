import React from 'react'
import styled from 'styled-components/native'

import { BodyText } from '../common/typography'

const StyledTag = styled(BodyText)`
  border-radius: 16px;
  border-width: 1px;
  font-size: 14px;
  margin: 0px 6px 6px 0px;
  padding: 6px 8px;
  text-align: center;
`

export const Tag = ({ label }) => <StyledTag>{label}</StyledTag>
