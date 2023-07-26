import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ErrorBoundaryScreen from 'screens/errorboundary';
import {useAppColorScheme} from 'stores';
import {appMaterialDark, appMaterialLight} from 'utils/themes';
import Routes from './routes';

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const App = () => {
  const appTheme = useAppColorScheme();

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <PaperProvider
          theme={appTheme === 'dark' ? appMaterialDark : appMaterialLight}>
          <ErrorBoundary FallbackComponent={ErrorBoundaryScreen}>
            <Routes />
            <FlashMessage position="top" />
          </ErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
