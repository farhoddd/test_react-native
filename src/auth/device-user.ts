import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_USER_KEY = 'mecenate-device-user-id';

let cachedDeviceUserId: string | null = null;

function isValidUuid(value: string | null | undefined) {
  if (!value) {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getWebStorage() {
  if (Platform.OS !== 'web') {
    return null;
  }

  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

async function readStoredDeviceUserId() {
  const webStorage = getWebStorage();

  if (webStorage) {
    return webStorage.getItem(DEVICE_USER_KEY);
  }

  try {
    return await SecureStore.getItemAsync(DEVICE_USER_KEY);
  } catch {
    return null;
  }
}

async function persistDeviceUserId(value: string) {
  const webStorage = getWebStorage();

  if (webStorage) {
    webStorage.setItem(DEVICE_USER_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(DEVICE_USER_KEY, value);
}

export async function bootstrapDeviceUserId() {
  if (isValidUuid(cachedDeviceUserId)) {
    return cachedDeviceUserId;
  }

  const storedValue = await readStoredDeviceUserId();

  if (isValidUuid(storedValue)) {
    cachedDeviceUserId = storedValue;
    return storedValue;
  }

  const nextValue = uuidv4();
  await persistDeviceUserId(nextValue);
  cachedDeviceUserId = nextValue;
  return nextValue;
}

export async function getDeviceUserId() {
  if (isValidUuid(cachedDeviceUserId)) {
    return cachedDeviceUserId;
  }

  const storedValue = await readStoredDeviceUserId();

  if (!isValidUuid(storedValue)) {
    return null;
  }

  cachedDeviceUserId = storedValue;
  return storedValue;
}
