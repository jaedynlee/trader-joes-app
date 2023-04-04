import { StyleSheet } from 'react-native'
import React from 'react'

import { BodyText } from '../common/typography'

const styles = StyleSheet.create({
  label: {
    borderWidth: 1,
    borderRadius: 18,
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    marginBottom: 6
  }
})

const Tag = ({ label }) => {
  return <BodyText style={styles.label}>{label}</BodyText>
}

export default Tag
