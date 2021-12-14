import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';

export default function Map({ navigation, route }) {

    const [address, setAddress] = useState('')
    const [region, setRegion] = useState({
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
    })

    useEffect(() => {
        findMyPlace();
    }, []);

    const findMyPlace = async () => {
        try {
            let place = route.params.myAddress
            let response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=ixMEZGgVl3Hjm8p1thoXMyriG0i1xLHf&location=${place}`)
            let json = await response.json();
            setRegion({
                ...region,
                latitude: json.results[0].locations[0].latLng.lat,
                longitude: json.results[0].locations[0].latLng.lng
            })
        } catch (e) {
            console.log('Error');
        }

    };

    const findAddress = () => {
        fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=ixMEZGgVl3Hjm8p1thoXMyriG0i1xLHf&location=${address}`)
            .then(response => response.json())
            .then(responseJson =>
                setRegion({
                    ...region,
                    latitude: responseJson.results[0].locations[0].latLng.lat,
                    longitude: responseJson.results[0].locations[0].latLng.lng
                })
            )

            .catch(error => {
                Alert.alert('Error', error);
            }
            );
        setAddress('');
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
                <Marker
                    coordinate={{
                        latitude: region.latitude,
                        longitude: region.longitude
                    }}
                />
            </MapView>
            <TextInput
                textAlign={'center'}
                placeholder="address"
                onChangeText={address => setAddress(address)} />
            <Button title="find address" onPress={findAddress}
                icon={{
                    name: "arrow-right",
                    size: 15,
                    color: "white"
                }}
                buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)' }}
                titleStyle={{ color: 'white' }} />
            <Button title="show my place" onPress={findMyPlace}
                icon={{
                    name: "arrow-right",
                    size: 15,
                    color: "white"
                }}
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
