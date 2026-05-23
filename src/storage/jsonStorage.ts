import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getJsonItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const storedValue = await AsyncStorage.getItem(key);

    if (!storedValue) {
      return fallback;
    }

    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
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