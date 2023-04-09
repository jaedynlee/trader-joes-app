import React from 'react'
import styled from 'styled-components/native'

import { Header, BodyText } from '../common/typography'

const Amount = styled(Header)`
  font-weight: bold;
  text-align: right;
`

const PerUnit = styled(BodyText)`
  font-weight: normal;
  font-size: 14px;
`

const PriceUnavailable = styled(BodyText)`
  font-style: italic;
`

const Wrapper = styled.View`
  padding: 24px;
`

const PriceDetails = ({ product }) => {
  let amount = product.sales_uom_description.toLowerCase()
  if (product.sales_size && product.sales_size > 1) {
    amount = `${
      product.sales_size
    } ${product.sales_uom_description.toLowerCase()}`
  }

  return (
    <Wrapper>
      {Number(product.retail_price)
        ? (
        <Amount>
          ${product.retail_price}
          <PerUnit>
            {' '}
            {amount === 'each' ? amount : `/ ${amount}`}
          </PerUnit>
        </Amount>
          )
        : (
        <PriceUnavailable>Price unavailable.</PriceUnavailable>
          )}
    </Wrapper>
  )
}

export default PriceDetails
