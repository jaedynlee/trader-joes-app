import { Linking, Platform, Pressable } from 'react-native'
import { faMapLocationDot, faStore } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'
import styled from 'styled-components/native'

import { setLocation as updateLocationInStorage } from '../../../storage/location'
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

const DetailButtonsView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 0;
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
  const storeButtonLabel = isComingSoon
    ? 'Coming soon!'
    : isSelected
      ? 'My store'
      : 'Set as my store'
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
      <Pressable
        accessibilityLabel="Call store"
        onPress={() => Linking.openURL(`tel:${phone}`)}
      >
        <Link>{phone}</Link>
      </Pressable>
      <DetailButtonsView>
        <BodyText>
          {_distance} {_distanceuom === 'mile' ? 'mi' : _distanceuom}
        </BodyText>
        <Pressable
          accessibilityLabel="View on map"
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
          <Link accessibilityLabel="Store info">
            <FontAwesomeIcon icon={faStore} color={colors.RED} /> Store Info
          </Link>
        </Pressable>
      </DetailButtonsView>
      <SecondaryButton
        accessibilityLabel={storeButtonLabel}
        name={storeButtonLabel}
        disabled={isSelected || isComingSoon}
        onPress={() =>
          updateLocationInStorage(clientkey, name)
            .then(onSelectLocation)
            .catch((e) => console.log(`Failed to set store with error: ${e}`))
        }
      />
    </ItemView>
  )
}
