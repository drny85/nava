import { useState, useEffect } from 'react'
import * as Location from 'expo-location';
import { add } from 'react-native-reanimated';


const useLocation = ({ refresh }) => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);



    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let { coords } = await Location.getCurrentPositionAsync({})
            const { latitude, longitude } = coords

            let address = await Location.reverseGeocodeAsync({ longitude, latitude })

            setLocation(address);

        })();
    }, [refresh]);

    return [location, errorMsg]





}

export default useLocation