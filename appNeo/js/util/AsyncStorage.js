import { AsyncStorage } from 'react-native'

export const STORAGE_KEY_TOKEN = 'id_token';

export async function InsertStorage(item, selectedValue) {
  try {
    await AsyncStorage.setItem(item, selectedValue);
  } catch (error) {
    console.log('AsyncStorage error: ' + error.message);
  }
}

export async function GetStorage(item){
  try {
    const value = await AsyncStorage.getItem(item);
    return value;
  }
  catch (error) {
    console.log('AsyncStorage error: ' + error.message);
    return undefined;
  }
}

export async function UpdateStorage(item, selectedValue){
  try {
    await AsyncStorage.removeItem(item);
    await AsyncStorage.setItem(item, selectedValue);
    return true;
  }
  catch (error) {
    console.log('AsyncStorage error: ' + error.message);
    return false;
  }
}


export async function DeleteStorage(item){
  try {
    await AsyncStorage.removeItem(item);
  }
  catch (error) {
    console.log('AsyncStorage error: ' + error.message);
    return undefined;M
  }
}
