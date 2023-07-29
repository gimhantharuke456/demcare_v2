import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveInStorage = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const getFromStorage = async (key) => {
  return await AsyncStorage.getItem(key);
};
