import AsyncStorage from "@react-native-async-storage/async-storage";

export const setLocation = async (clientkey, name) => {
  try {
    await AsyncStorage.setItem(
      "@location",
      JSON.stringify({ clientkey: clientkey, name: name })
    );
  } catch (e) {
    throw e;
  }
};

export const getLocation = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@location");
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw e;
  }
};
