import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, List, StyleSheet } from 'react-native';
import { Input, Button, ListItem, Icon, renderItem } from 'react-native-elements';
import { getDatabase, push, ref, onValue, remove, reference } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from './firebaseConfig';
import { Alert } from 'react-native';
import { userStore } from './UserReducer';


export default function Myplaces({ route, navigation }) {

    useEffect(() => {
        setUid(userStore.getState());
    });

    const app = initializeApp(firebaseConfig);

    const database = getDatabase(app);

    const [uid, setUid] = useState('');
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const placeRef = ref(database, uid + '/places/')
        onValue(placeRef, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
            } else {
                setPlaces(Object.values(data));
            }
        })
    }, [uid]);

    const savePlace = () => {
        if (title && address) {
            push(ref(database, uid + '/places'), {
                'title': title, 'address': address

            });

            setTitle('');
            setAddress('');

        }
        else {
            Alert.alert('Error', 'Type product title and address first')
        }
    }

    const deletePlace = (title) => {

        onValue(ref(database, uid + '/places/'), (snapshot) => {
            snapshot.forEach((childSnap) => {
                if (childSnap.val().title === title) {
                    const deleteRef = ref(database, uid + '/places/' + childSnap.key);
                    console.log(deleteRef);
                    remove(deleteRef);

                }
            })
        })
    }
    /*
    const renderItem = ({ item }) => (
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title>{item.title}</ListItem.Title>
                <ListItem.Subtitle>{item.address}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )*/


    return (
        <View style={styles.container}>
            <Input placeholder='Title'
                label='TITLE'
                onChangeText={title => setTitle(title)}
                value={title} />
            <Input placeholder='Address'
                label='ADDRESS'
                onChangeText={address => setAddress(address)}
                value={address} />
            <Button
                onPress={savePlace}
                title="save"
                buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)', margin: 20 }}
                titleStyle={{ color: 'white' }} />
            {/*<FlatList 
                data={places}
                renderItem={renderItem}
           keyExtractor={(item , index) => index.toString()}/>*/}
            <FlatList
                style={styles.list}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                    <View>
                        <View>
                            <Text style={{ fontSize: 18, marginBottom: 5 }}>{item.title}, {item.address}</Text>
                        </View>
                        <View>
                            <Button
                                buttonStyle={{ backgroundColor: 'rgba(3, 201, 169, 1)', marginBottom: 5 }}
                                icon={{
                                    name: "arrow-right",
                                    size: 15,
                                    color: "white"
                                }}
                                title="show on map"
                                onPress={() => navigation.navigate({
                                    name: 'Map',
                                    params: { address }
                                }
                                )}
                            />
                            <Button
                                icon={
                                    <Icon
                                        name="delete"
                                        size={20}
                                        color="white"
                                    />
                                }
                                buttonStyle={{ backgroundColor: 'rgba(39, 39, 39, 1)', marginBottom: 20 }}
                                size={10}
                                onPress={() => deletePlace(item.title)}
                                title="delete" />
                        </View>
                    </View>
                }
                data={places}
            />
            < StatusBar style="hidden" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
});
