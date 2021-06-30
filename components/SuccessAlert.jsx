import React from 'react'
import { StyleSheet, View, Modal } from 'react-native'
import { COLORS, SIZES } from '../config'
import LottieView from 'lottie-react-native'


const SuccessAlert = ({ onFinish, visible }) => {
    return (
        <Modal visible={visible}>
            <View style={styles.view}>
                <View style={styles.innerView}>
                    <LottieView autoPlay source={require('../assets/animations/success.json')} loop={false} onAnimationFinish={onFinish} />
                </View>

            </View>
        </Modal>
    )
}

export default SuccessAlert

const styles = StyleSheet.create({
    view: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
    innerView: { backgroundColor: COLORS.white, height: SIZES.height / 4, width: SIZES.width * 0.8, borderRadius: SIZES.radius * 1.5 }
})
