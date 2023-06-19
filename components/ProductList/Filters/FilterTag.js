import React from 'react'

import { Tag } from '../../common/tag'

export const FilterTag = ({ label }) => {
  if (!label) return null

  return <Tag label={label} />
}
