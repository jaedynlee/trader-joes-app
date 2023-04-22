import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Button, Pressable } from 'react-native'
import React from 'react'
import styled from 'styled-components/native'

import { colors } from '../../style'

// TEXT
export const BodyText = styled.Text`
  font-size: 16px;
`

export const LegalText = styled.Text`
  font-size: 12px;
`

export const Link = styled(BodyText)`
  color: ${colors.RED};
`

// HEADER
export const SmallHeader = styled(BodyText)`
  font-weight: bold;
`

export const Header = styled.Text`
  font-size: 20px;
  font-weight: bold;
`

// BUTTON
export const TertiaryButton = (props) => (
  <Button {...props} style={{ ...props.style }} color={colors.RED}>
    {props.children}
  </Button>
)

const ButtonBase = (props) => (
  <Pressable
    {...props}
    style={[
      {
        ...props.style,
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10
      },
      props.disabled && props.disabledProps
    ]}
  >
    {props.icon
      ? (
      <FontAwesomeIcon
        icon={props.icon}
        style={{ ...props.iconProps, marginRight: 8 }}
      />
        )
      : null}
    <BodyText
      style={{
        ...props.labelProps,
        ...(props.disabled ? props.disabledLabelProps : {})
      }}
    >
      {props.name}
    </BodyText>
  </Pressable>
)

export const SecondaryButton = (props) => (
  <ButtonBase
    {...props}
    disabledLabelProps={{ color: colors.DARK_GRAY }}
    disabledProps={{ borderColor: colors.DARK_GRAY }}
    iconProps={{ color: colors.RED }}
    labelProps={{ textAlign: 'center', color: colors.RED, fontWeight: 'bold' }}
    style={{
      ...props.style,
      backgroundColor: colors.WHITE,
      borderColor: colors.RED,
      borderWidth: 2
    }}
  />
)

export const PrimaryButton = (props) => (
  <ButtonBase
    {...props}
    disabledProps={{ backgroundColor: colors.DARK_GRAY }}
    iconProps={{ color: colors.WHITE }}
    labelProps={{
      textAlign: 'center',
      color: colors.WHITE,
      fontWeight: 'bold'
    }}
    style={{
      ...props.style,
      backgroundColor: colors.RED
    }}
  />
)
