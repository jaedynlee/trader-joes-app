import React from 'react'
import styled from 'styled-components/native'

import { CollapsibleDetails } from '../common/collapsibleDetails.js'
import { BodyText } from '../common/typography.js'

const Container = styled.View`
  padding-top: 20px;
`

const BoldText = styled(BodyText)`
  font-weight: bold;
`

const Ingredients = ({ ingredients, allergens }) => {
  // Ensure ingredients list ends in a period `.`
  if (ingredients.length) {
    const lastIngredient = ingredients.pop()
    const lastCharacter = lastIngredient.ingredient.trim().slice(-1)
    if (lastCharacter !== '.') {
      lastIngredient.ingredient = lastIngredient.ingredient.trim() + '.'
    }
    ingredients.push(lastIngredient)
  }
  return (
    <Container>
      <CollapsibleDetails label="Ingredients">
        <BodyText>
          {ingredients
            .map((i) => i.ingredient.trim())
            .join(', ')
            .trim()}
          <BoldText>
            {allergens &&
              ` ${allergens.map((a) => a.ingredient.trim()).join(' ')}`}
          </BoldText>
        </BodyText>
      </CollapsibleDetails>
    </Container>
  )
}

export default Ingredients
