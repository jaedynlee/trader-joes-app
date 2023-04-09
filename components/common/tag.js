import React from 'react'
import styled from 'styled-components/native'

import { BodyText } from '../common/typography'

const StyledTag = styled(BodyText)`
    border-radius: 18px;
    border-width: 1px;
    margin: 0px 6px 6px 0px;
    padding: 8px 12px;
    text-align: center;
`

export const Tag = ({ label }) => <StyledTag>{label}</StyledTag>
