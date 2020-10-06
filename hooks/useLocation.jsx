import { useEffect, useState } from 'react'
import * as Location from 'expo-location';

const zipCodes = ['10452', '10451', '10453', '10456', '10457']
export const useLocation = () => {

    const [address, setAddress] = useState(null)
    const [isloading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                }

                const location = await Location.getCurrentPositionAsync({})
                const { latitude, longitude } = location.coords
                const myAddress = await Location.reverseGeocodeAsync({ latitude, longitude })
                setLoading(false)
                setAddress(myAddress[0])

            } catch (error) {
                console.log(error)
                setLoading(false)
                setAddress(null)
            }

        })();
    }, []);


    return { isloading, address }
}