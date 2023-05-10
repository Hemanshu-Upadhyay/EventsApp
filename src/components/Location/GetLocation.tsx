import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

const getLocation = () => {
  const [location, setLocation] = useState<GeolocationResponse | null>(null);

  const handleGetLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  return (
    <View>
      <Button title="Get Location" onPress={handleGetLocation} />
      {location ? (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default getLocation;
