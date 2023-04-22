import React, { useState } from 'react'
import styled from 'styled-components/native'

import { colors } from '../../style'
import { BodyText } from '../common/typography'

const Wrapper = styled.View`
  padding-top: 10px;
`

const ShowMoreButton = styled(BodyText)`
  color: ${colors.RED};
  text-decoration-line: underline;
`

const cleanSummary = (summary) =>
  summary
    .replace(/<p>/g, '')
    .replace(/<strong>/g, '')
    .replace(/<\/strong>/g, '')
    .replace(/<em>/g, '')
    .replace(/<\/em>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&deg;/g, 'º')
    .replace(/<\/p>/g, '\n')
    .replace(/<br \/>/g, '\n')
    .trim()

const ProductSummary = ({ summary }) => {
  const [expanded, setExpanded] = useState(false)

  const summaryClean = cleanSummary(summary)

  return (
    <Wrapper>
      <BodyText numberOfLines={expanded ? Number.MAX_SAFE_INTEGER : 7}>
        {summaryClean}
      </BodyText>
      <ShowMoreButton onPress={() => setExpanded(!expanded)}>
        Show {expanded ? 'Less' : 'More'}
      </ShowMoreButton>
    </Wrapper>
  )
}

export default ProductSummary
