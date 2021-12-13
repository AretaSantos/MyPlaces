import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function Map({ navigation }) {

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('')
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    })

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('No permission to get location')
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })

        })();
    }, []);

    const findAddress = () => {
        fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=ixMEZGgVl3Hjm8p1thoXMyriG0i1xLHf&location=${address}`)
            .then(response => response.json())
            .then(responseJson =>
                setRegion({
                    ...region,
                    latitude: responseJson.results[0].locations[0].latLng.lat,
                    longitude: responseJson.results[0].locations[0].latLng.lng
                }))
            .catch(error => {
                Alert.alert('Error', error);
            });
    }

    return (
        <View style={styles.container}>
            <Button
                title="My places"
                onPress={() => navigation.navigate('My Places')}
                buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                titleStyle={{ color: 'white' }}
            />
            <MapView style={{ flex: 1 }}
                region={region}>
                <Marker coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude
                }} />
            </MapView>
            <TextInput
                textAlign={'center'}
                placeholder="address"
                onChangeText={address => setAddress(address)} />
            <Button title="find" onPress={findAddress}
                buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                titleStyle={{ color: 'white' }} />
            <StatusBar style="auto" />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
