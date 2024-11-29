import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import CryptoDetails from './CryptoDetails';
import FavouriteList from './FavouriteList';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CryptoDetails" component={CryptoDetails} />
            <Stack.Screen name="MyExchange" component={FavouriteList} />
        </Stack.Navigator>
    );
};

export default HomeStack;
