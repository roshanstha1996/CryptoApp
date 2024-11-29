import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';  
import { db } from "../config/FirebaseConfig";
import { collection, addDoc, getDocs } from 'firebase/firestore';

const CryptoDetails = ({ route }) => {
  const { cryptoId } = route.params; // Get the crypto data passed from HomeScreen
  const [details, setDetails] = useState(null); // State for storing crypto details
  const [loading, setLoading] = useState(true); // Loading state to show a spinner while data is fetching

  const BASE_URL = 'https://api.coinlore.net/api'; // Base URL for CoinLore API

  // Function to fetch detailed crypto data using axios
  const fetchCryptoDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ticker/?id=${cryptoId}`);
      // console.log(response.data);
      setDetails(response.data[0]); 
      setLoading(false); 
    } catch (error) {
      console.log("Error fetching crypto details: ", error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCryptoDetails(); // Fetch crypto details when the screen is loaded
  }, [cryptoId]); // Only rerun when the crypto ID changes

  
  const addToFavourites = async () => {

    try {
        const collectionRef = collection(db, 'CryptoDB');
    
        // Check if the crypto already exists in the Firestore collection
        const querySnapshot = await getDocs(collectionRef);
        const existingCrypto = querySnapshot.docs.find(doc => doc.data().name === details.name); // Check by name or symbol
        
        if (existingCrypto) {
          alert('This crypto has already been added to your favorites!!');
          return;
        }

        const cryptoData = {
            name: details.name,
            symbol: details.symbol,
            price: details.price_usd,
            marketCapUSD: details.market_cap_usd,
            rank: details.rank,
            percentChange24H: details.percent_change_24h
        }
        const docRef = await addDoc(collectionRef, cryptoData);

        console.log('Crypto ID: ', docRef.id);
        alert('Added to Favorites!'); 

    } catch (e) {
        console.log('Error adding the crpyto to DB: ', e)
    }
  }

  // Function to handle adding the current crypto to favorites
  const handleAddToFavorites = async () => {
    try {
      await addToFavourites(); 
    } catch (error) {
      console.log("Error adding to favorites:", error);
      alert('Failed to add to Favorites.');
    }
  };

  // Show loading spinner while data is fetching
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="navy" />
        <Text>Loading details...</Text>
      </View>
    );
  }

  // Render crypto details when data is successfully fetched
  return (
    <View style={styles.container}>
      <View style={styles.detailsCard}>
        <Text style={styles.name}>{details.name}</Text>
        <Text style={styles.text}>Symbol: {details.symbol}</Text>
        <Text style={styles.text}>Price (USD): ${details.price_usd}</Text>
        <Text style={styles.text}>Market Cap: ${details.market_cap_usd}</Text>
        <Text style={styles.text}>Rank: {details.rank}</Text>
        <Text style={styles.text}>24h Change: {details.percent_change_24h}%</Text>
      </View>

      {/* Uncomment the below button once handleAddToFavorites is implemented */}
      {/* <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}> */}
      <TouchableOpacity style={styles.button} onPress={handleAddToFavorites}>
        <Text style={styles.buttonText}>Add to Favorites</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CryptoDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    backgroundColor: 'seashell',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'navy',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    color: 'darkslategray',
  },
  button: {
    backgroundColor: 'navy',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
