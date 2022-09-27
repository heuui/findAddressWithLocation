import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, Dimensions, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [address, setAddress] = useState('');
  const [markerLat, setMarkerLat] = useState(0.0);
  const [markerLong, setMarkerLong] = useState(0.0);
  const [regionLat, setRegionLat] = useState(0.0);
  const [regionLong, setRegionLong] = useState(0.0);
  const [data, setData] = ([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);


  const fetchCoordinates = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=cfh4afLRpNqrdCDwa9cgPvwgTjsOcmHG&location=${address}`)
    .then(response => response.json())
    .then(data => {
      const lat = data.results[0].locations[0].latLng.lat;
      const long = data.results[0].locations[0].latLng.lng;
      setMarkerLat(lat);
      setRegionLat(lat);
      setMarkerLong(long);
      setRegionLong(long);
    })
    .catch(error => {
      console.log(error)
    });
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != 'granted') {
        setErrorMsg('Permission to access location was denied');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setMarkerLat(location.coords.latitude);
        setRegionLat(location.coords.latitude);
        setMarkerLong(location.coords.longitude);
        setRegionLong(location.coords.longitude);
      }
    })();
  }, []);


  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={{
        latitude: regionLat,
        longitude: regionLong,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      }}>
      <Marker coordinate={{
        latitude: markerLat,
        longitude: markerLong}}
        title={address} 
      />
      </MapView>
      <TextInput 
        style={styles.input}
        onChangeText={text => setAddress(text)} value={address}
      />
      <Button 
        title="Show"
        onPress={fetchCoordinates}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  input: {
    marginTop: 20,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
