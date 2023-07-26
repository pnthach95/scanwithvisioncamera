import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import type {SavedBarcode} from 'typings/commons';

type MMKVType = {
  barcodes: SavedBarcode[];
};

const MMKV = new MMKVLoader()
  .withInstanceID('9r7ohsZuNbs')
  .withEncryption()
  .initialize();

export const useStorage = <T extends keyof MMKVType>(
  key: T,
  defaultValue?: MMKVType[T],
) => useMMKVStorage<MMKVType[T]>(key, MMKV, defaultValue);
