import { useState, useEffect } from 'react'
import * as Location from 'expo-location';

const useCustomLocation = (restaurantLocation, userLocation) => {

    const [origin, setOrigen] = useState(null)
    const [destination, setDestination] = useState(null)

    useEffect(() => {
        (async () => {

            try {
                let { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const rest = await Location.geocodeAsync(restaurantLocation)
                const user = await Location.geocodeAsync(userLocation)

                const { latitude: lat, longitude: lon } = rest[0]
                const { latitude, longitude } = user[0]
                setOrigen({ latitude, longitude })
                setDestination({ longitude: lon, latitude: lat })
            } catch (error) {
                console.log('Error getting regions', error)
            }

        })();
    }, [restaurantLocation, userLocation])
    return { origin, destination }
}

export default useCustomLocation
