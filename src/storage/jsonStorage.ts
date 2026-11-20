import AsyncStorage from '@react-native-async-storage/async-storage';
import { readStoredJson } from './readStoredJson';

export async function getJsonItem<T>(key: string, fallback: T): Promise<T> {
  return readStoredJson(() => AsyncStorage.getItem(key), fallback);
}

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeStorageItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function removeStorageItems(keys: string[]): Promise<void> {
  await AsyncStorage.multiRemove(keys);
}