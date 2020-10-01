import { useEffect, useState } from 'react'
import * as Location from 'expo-location';

const zipCodes = ['10452', '10451', '10453', '10456', '10457']
export default useLocation = () => {

    const [canDelivery, setCanDelivery] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                }

                const location = await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Highest })
                const { latitude, longitude } = location.coords
                const myAddress = await Location.reverseGeocodeAsync({ latitude, longitude })
                const { postalCode } = myAddress[0]
                setLoading(false)
                if (zipCodes.includes(postalCode)) {
                    setCanDelivery(true)
                } else {
                    setLoading(false)
                    setCanDelivery(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
                setCanDelivery(false)
            }

        })();
    }, [postalCode]);


    return { loading, canDelivery }
}