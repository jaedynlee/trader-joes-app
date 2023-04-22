import { Linking, Platform, Pressable, View } from 'react-native'
import { faMapLocationDot, faStore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import styled from 'styled-components/native'

import { setLocation as updateLocationInStorage } from '../../../storage'
import { colors } from '../../../style'
import {
  BodyText,
  Link,
  SecondaryButton,
  SmallHeader
} from '../../common/typography'

const ItemView = styled.View`
  padding: 12px 0px;
`

export const StoreDetails = ({ store, selectedLocation, onSelectLocation }) => {
  const {
    clientkey,
    name,
    address1,
    address2,
    city,
    state,
    postalcode,
    phone,
    _distance,
    _distanceuom,
    comingsoon,
    latitude,
    longitude
  } = store

  const isSelected = selectedLocation?.clientkey === clientkey
  const isComingSoon = comingsoon === 'Yes'
  return (
    <ItemView>
      <SmallHeader>{name}</SmallHeader>
      <BodyText>
        {address1}
        {address2 ? ` ${address2}` : ''}
      </BodyText>
      <BodyText>
        {city}, {state} {postalcode}
      </BodyText>
      <Pressable onPress={() => Linking.openURL(`tel:${phone}`)}>
        <Link>{phone}</Link>
      </Pressable>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 8
        }}
      >
        <BodyText>
          {_distance} {_distanceuom === 'mile' ? 'mi' : _distanceuom}
        </BodyText>
        <Pressable
          onPress={() => {
            const domain = Platform.OS === 'ios' ? 'apple' : 'android'
            Linking.openURL(
              `http://maps.${domain}.com/maps?q=${latitude},${longitude}`
            )
          }}
        >
          <Link>
            <FontAwesomeIcon icon={faMapLocationDot} color={colors.RED} /> Map
          </Link>
        </Pressable>
        <Pressable
          onPress={() =>
            Linking.openURL(
              `https://locations.traderjoes.com/${state}/${city}/${clientkey}`
            )
          }
        >
          <Link>
            <FontAwesomeIcon icon={faStore} color={colors.RED} /> Store Info
          </Link>
        </Pressable>
      </View>
      <SecondaryButton
        name={
          isComingSoon
            ? 'Coming soon!'
            : isSelected
              ? 'My store'
              : 'Set as my store'
        }
        disabled={isSelected || isComingSoon}
        onPress={() =>
          updateLocationInStorage(clientkey, name)
            .then(onSelectLocation)
            .catch((e) => console.log(`Failed to set store with error: ${e}`))
        }
        style={[{ marginTop: 10 }]}
      />
    </ItemView>
  )
}
