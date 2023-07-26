import React from 'react';
import {View} from 'react-native';
import {Button, Text, useTheme} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {ErrorBoundaryProps} from 'react-native-error-boundary';

const ErrorBoundaryScreen: ErrorBoundaryProps['FallbackComponent'] = ({
  error,
}) => {
  const {colors} = useTheme();

  const restart = () => {
    RNRestart.restart();
  };

  return (
    <View
      className="flex-1 items-center justify-center space-y-3 p-3"
      style={{backgroundColor: colors.background}}>
      <Icon color={colors.error} name="error" size={100} />
      <Text className="text-center text-lg font-bold">Unexpected error</Text>
      <Text>{error.toString()}</Text>
      <Button mode="contained" onPress={restart}>
        Reopen app
      </Button>
    </View>
  );
};

export default ErrorBoundaryScreen;
