import React from 'react';
import {View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {onSwitchTheme, useAppColorScheme} from 'stores';

const SettingsScreen = () => {
  const appTheme = useAppColorScheme();

  return (
    <>
      <TouchableRipple onPress={onSwitchTheme}>
        <View className="flex-row justify-between p-3">
          <Text>Theme</Text>
          <Text>{appTheme}</Text>
        </View>
      </TouchableRipple>
    </>
  );
};

export default SettingsScreen;
