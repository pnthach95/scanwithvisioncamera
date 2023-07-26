import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
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
import {useSafeAreaPaddingBottom, useSafeAreaPaddingTop} from 'utils/styles';
import type {ListRenderItem} from 'react-native';
import type {CameraPermissionStatus} from 'react-native-vision-camera';

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
  const devices = useCameraDevices();
  const device = devices.back;
  const bottom = useSafeAreaPaddingBottom();
  const top = useSafeAreaPaddingTop();

  useEffect(() => {
    requestCameraPermission();
  });

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    setCameraPermissionStatus(permission);
  }, []);

  const onPressOpenSettings = () => {
    Linking.openSettings();
  };

  const restart = () => {
    RNRestart.restart();
  };

  const renderItem: ListRenderItem<string> = ({item}) => {
    return (
      <TouchableRipple>
        <View className="flex-row items-center justify-between p-3">
          <Text>{item}</Text>
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
        <Camera isActive device={device} style={StyleSheet.absoluteFill} />
        <View style={top}>
          <IconButton
            icon={
              appColor === 'dark'
                ? 'moon-waxing-crescent'
                : 'white-balance-sunny'
            }
            mode="contained"
            onPress={onSwitchTheme}
          />
        </View>
        <BottomSheet
          ref={sheetRef}
          backgroundComponent={CustomBackground}
          handleComponent={CustomHandle}
          snapPoints={snapPoints}>
          <BottomSheetFlatList
            contentContainerStyle={bottom}
            data={[]}
            ListEmptyComponent={EmptyComponent}
            renderItem={renderItem}
          />
        </BottomSheet>
      </>
    );
  }

  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default HomeScreen;
