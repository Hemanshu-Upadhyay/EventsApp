import VIForegroundService from '@voximplant/react-native-foreground-service';
import {Platform, View, Button} from 'react-native';

const ForegroundService = () => {
  const startForegroundService = async () => {
    if (Platform.OS === 'android') {
      try {
        await VIForegroundService.startService({
          channelId: 'com.viforegroundservice.channelId',
          id: 3456,
          title: 'Example',
          text: 'Foreground service is running',
          icon: 'ic_notification',
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopForegroundService = async () => {
    if (Platform.OS === 'android') {
      try {
        await VIForegroundService.stopService();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <View>
      <Button
        title="Start Foreground Service"
        onPress={startForegroundService}
      />
      <Button title="Stop Foreground Service" onPress={stopForegroundService} />
    </View>
  );
};

export default ForegroundService;
