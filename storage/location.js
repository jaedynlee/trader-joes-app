// TODO: Log errors
/* eslint-disable no-useless-catch */

import AsyncStorage from '@react-native-async-storage/async-storage'

export const setLocation = async (clientkey, name) => {
  try {
    const location = { clientkey, name }
    await AsyncStorage.setItem('@location', JSON.stringify(location))
    return location
  } catch (e) {
    throw e
  }
}

export const getLocation = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@location')
    return jsonValue !== null ? JSON.parse(jsonValue) : null
  } catch (e) {
    throw e
  }
}
