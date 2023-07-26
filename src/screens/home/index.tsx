import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {onSwitchTheme, useAppColorScheme} from 'stores';
import {useStorage} from 'stores/localstorage';
import {DATE_FORMAT} from 'utils';
import {useSafeAreaPaddingBottom, useSafeAreaPaddingTop} from 'utils/styles';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import type {ListRenderItem} from 'react-native';
import type {CameraPermissionStatus} from 'react-native-vision-camera';
import type {SavedBarcode} from 'typings/commons';
import type {Barcode} from 'vision-camera-code-scanner';

const EmptyComponent = () => {
  const {colors} = useTheme();
  return (
    <View className="items-center justify-center p-3">
      <Icon color={colors.onBackground} name="qrcode-scan" size={24} />
      <Text>Nothing here</Text>
    </View>
  );
};

const HomeScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['12%', '25%', '50%', '70%'], []);
  const appColor = useAppColorScheme();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const [prevData, setPrevData] = useState<Barcode[]>([]);
  const [savedBarcodes, setSavedBarcodes] = useStorage('barcodes', []);
  const devices = useCameraDevices();
  const device = devices.back;
  const bottom = useSafeAreaPaddingBottom();
  const top = useSafeAreaPaddingTop();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    const pd = prevData.map(p => p.displayValue).sort();
    const bc = barcodes.map(b => b.displayValue).sort();
    if (JSON.stringify(pd) !== JSON.stringify(bc)) {
      setPrevData(barcodes);
    }
  }, [barcodes, prevData]);

  useEffect(() => {
    if (
      prevData.length > 0 &&
      prevData[prevData.length - 1].displayValue !==
        savedBarcodes[0]?.data.displayValue
    ) {
      const list: SavedBarcode[] = [];
      prevData.forEach(b => {
        list.push({data: b, time: dayjs().format(DATE_FORMAT.SERVER.FULL)});
      });
      setSavedBarcodes([...list, ...(savedBarcodes || [])]);
    }
  }, [prevData, savedBarcodes]);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permission);
  }, []);

  const onPressOpenSettings = () => {
    Linking.openSettings();
  };

  const onPressClearAll = () => setSavedBarcodes([]);

  const restart = () => {
    RNRestart.restart();
  };

  const renderItem: ListRenderItem<SavedBarcode> = ({item}) => {
    return (
      <TouchableRipple>
        <View className="p-3">
          <Text>{item.data.displayValue}</Text>
          <Text>{item.time}</Text>
        </View>
      </TouchableRipple>
    );
  };

  if (
    cameraPermissionStatus === 'denied' ||
    cameraPermissionStatus === 'restricted'
  ) {
    return (
      <View className="flex-1 items-center justify-center space-y-3">
        <Text className="text-center" variant="bodyMedium">
          Give permission to access to camera
        </Text>
        <Button mode="contained" onPress={onPressOpenSettings}>
          Open settings
        </Button>
        <Button mode="contained" onPress={restart}>
          Reopen app
        </Button>
      </View>
    );
  }

  if (device) {
    return (
      <>
        <Camera
          isActive
          device={device}
          frameProcessor={frameProcessor}
          frameProcessorFps={50}
          style={StyleSheet.absoluteFill}
        />
        <View className="flex-row justify-between" style={top}>
          <IconButton
            icon={
              appColor === 'dark'
                ? 'moon-waxing-crescent'
                : 'white-balance-sunny'
            }
            mode="contained"
            onPress={onSwitchTheme}
          />
          <IconButton
            icon="trash-can"
            mode="contained"
            onPress={onPressClearAll}
          />
        </View>
        <BottomSheet
          ref={sheetRef}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}
          snapPoints={snapPoints}>
          <BottomSheetFlatList
            contentContainerStyle={bottom}
            data={savedBarcodes}
            ListEmptyComponent={EmptyComponent}
            renderItem={renderItem}
          />
        </BottomSheet>
      </>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      {cameraPermissionStatus === 'authorized' ? (
        <Text variant="headlineMedium">Camera is not available</Text>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default HomeScreen;
