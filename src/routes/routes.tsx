import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useColorScheme} from 'nativewind';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import HomeScreen from 'screens/home';
import {useAppColorScheme} from 'stores';
import {navigationDarkTheme, navigationTheme, useAppTheme} from 'utils/themes';
import type {RootStackParamList} from 'typings/navigation';

const RootStack = createStackNavigator<RootStackParamList>();

const Routes = () => {
  const appTheme = useAppColorScheme(),
    {colors} = useAppTheme(),
    {setColorScheme} = useColorScheme();

  useEffect(() => {
    setTimeout(() => {
      StatusBar.setBarStyle(
        appTheme === 'dark' ? 'light-content' : 'dark-content',
      );
      Platform.OS === 'android' && StatusBar.setBackgroundColor(colors.card);
    }, 500);
  }, []);

  useEffect(() => {
    setColorScheme(appTheme);
  }, [appTheme]);

  return (
    <NavigationContainer
      theme={appTheme === 'dark' ? navigationDarkTheme : navigationTheme}
      onReady={() => BootSplash.hide({fade: true, duration: 750})}>
      <StatusBar
        backgroundColor={colors.elevation.level2}
        barStyle={appTheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootStack.Navigator>
        <RootStack.Screen
          component={HomeScreen}
          name="Home"
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
