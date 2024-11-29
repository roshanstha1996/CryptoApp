import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { getFavorites, removeFavorite, clearFavorites } from '../config/FirebaseConfig';

import { 
    collection, getDocs, deleteDoc, doc, 
    query,
    where} from 'firebase/firestore';
  import { db } from "../config/FirebaseConfig";

const FavouriteList = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [favCryptoList, setfavCryptoList] = useState([]);

    const getFavouriteCryptos = async () => {
        try {
          // reference of the collection
          const collectionRef = collection(db, 'CryptoDB');
    
          // get all the documents from the collection
          const getFavCryptoList = await getDocs(collectionRef);
          const responseFavCryptos = [];
    
          getFavCryptoList.forEach( (doc) => {
            const cryptoDetail = {
              id: doc.id, // document id
              ...doc.data()
            }
            responseFavCryptos.push(cryptoDetail);
          });
    
          setfavCryptoList(responseFavCryptos);
        } catch (e) {
          console.log('Error fetching favourite crytos: ', e);
        }
      }

  
  const deleteFavCrypto = async (data) => {
    try {
      // reference of the specific document
      const deleteCrypto = doc(db, 'CryptoDB', data.id)
      await deleteDoc(deleteCrypto);
      Alert.alert('Deleted', `${data.name} is deleted.`);
      getFavouriteCryptos();
    } catch(e) {
      console.log('Error deleting the crypto: ', e);
    }
  }
    const handleRemove = async (item) => {
        await deleteFavCrypto(item);
    };

    const handleClearFavorites = async () => {
        try {
            // Reference to the CryptoDB collection
            const collectionRef = collection(db, 'CryptoDB');
            const querySnapshot = await getDocs(collectionRef);
    
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref); // Delete the document
            });
    
            Alert.alert('Cleared', 'All favorites have been deleted.');
            
            // Refresh the list of favorite cryptos
            getFavouriteCryptos();
        } catch (error) {
            console.log('Error clearing all favorites: ', error);
        }
    };

    const showCryptoDetails = (item) => {
        navigation.navigate('CryptoDetails', { cryptoId: item.id });
    };

    useEffect(() => {
        getFavouriteCryptos();
    
        console.log("test")
    },[]);

    return (
        <View style={styles.container}>
          {favCryptoList.length === 0 ? (
            <Text style={styles.message}>No currency found</Text>
          ) : (
            <FlatList
              data={favCryptoList}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => showCryptoDetails(item)} // Navigate to CryptoDetails
                  style={styles.cryptoItem}
                >
                  <View style={styles.subView}>
                    <Text style={styles.cryptoName}>{item.name}</Text>
                    <Text style={styles.cryptoSymbol}>Symbol: {item.symbol}</Text>
                  </View>
                  <Button
                    title="Remove"
                    color="red"
                    onPress={() => deleteFavCrypto(item)}
                  />
                </TouchableOpacity>
              )}
            />
          )}
          <Button
            title="Clear Favorites"
            onPress={handleClearFavorites}
            disabled={favCryptoList.length === 0}
            color={favCryptoList.length === 0 ? 'gray' : 'navy'}
          />
        </View>
      );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    message: { textAlign: 'center', fontSize: 16, marginTop: 20 },
    item: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
    title: { fontSize: 18 },
    subView: {
      borderColor: 'red',
      borderWidth: 2,
      paddingVertical: 15,
      borderRadius: 8,
      alignItems: 'center',
    },
});

export default FavouriteList;
