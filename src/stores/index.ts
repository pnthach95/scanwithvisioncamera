import {produce} from 'immer';
import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {StateStorage} from 'zustand/middleware';

const storage = new MMKVLoader()
  .withInstanceID('Zuultehbs')
  .withEncryption()
  .initialize();

const useAppStore = create<StoreState>()(
  persist(
    _ => ({
      appTheme: Appearance.getColorScheme() || 'light',
    }),
    {
      name: 'scanwithvisioncamera',
      version: 1,
      storage: createJSONStorage(() => storage as unknown as StateStorage),
    },
  ),
);

export const useAppColorScheme = () => useAppStore(s => s.appTheme);

export const onSwitchTheme = () => {
  useAppStore.setState(
    produce<StoreState>(draft => {
      draft.appTheme = draft.appTheme === 'dark' ? 'light' : 'dark';
    }),
  );
};

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = useAppStore.persist.onHydrate(() =>
      setHydrated(false),
    );
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useAppStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
