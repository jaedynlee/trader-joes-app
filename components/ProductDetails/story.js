import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../../style.js'
import { BodyText } from '../common/typography'

const styles = StyleSheet.create({
  container: {
    paddingTop: 10
  },
  tertiaryButton: {
    color: colors.RED,
    textDecorationLine: 'underline'
  }
})

const ProductSummary = ({ summary }) => {
  const [expanded, setExpanded] = useState(false)

  const summaryClean = summary
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

  return (
    <View style={styles.container}>
      <BodyText numberOfLines={expanded ? Number.MAX_SAFE_INTEGER : 7}>
        {summaryClean}
      </BodyText>
      <BodyText
        onPress={() => setExpanded(!expanded)}
        style={styles.tertiaryButton}
      >
        Show {expanded ? 'Less' : 'More'}
      </BodyText>
    </View>
  )
}

export default ProductSummary
