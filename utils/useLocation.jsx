import { useState, useEffect } from 'react'
import * as Location from 'expo-location';
import { add } from 'react-native-reanimated';


const useLocation = (refresh) => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {

            try {
                let { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let { coords } = await Location.getCurrentPositionAsync({})
                const { longitude, latitude } = coords

                let address = await Location.reverseGeocodeAsync({ longitude, latitude })

                setLocation(address);
            } catch (error) {
                console.log(error)
            }


        })();
    }, [refresh, add]);

    return [location, errorMsg]





}

export default useLocation