import React, { useRef } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import { Transition, Transitioning } from 'react-native-reanimated'
import { FONTS, COLORS, SIZES } from '../config'


const Toogler = ({ onPressLeft, onPressRight, leftCondition, rightCondition, contentBackgroundColor, condition, height, width }) => {

    const ref = useRef()

    const transition = (<Transition.Together>

        <Transition.Change />
    </Transition.Together>)

    return (

        <Transitioning.View transition={transition} ref={ref} style={[styles.container, { height: height ? height : 40, width: width ? width : SIZES.width * 0.6 }]}>
            <View style={{
                position: 'absolute', backgroundColor: contentBackgroundColor ? contentBackgroundColor : COLORS.secondary, bottom: 0, top: 0,
                left: leftCondition === condition ? 0 : null,
                right: rightCondition === condition ? 0 : null,
                width: '50%', overflow: 'hidden', zIndex: 10, justifyContent: 'center', alignItems: 'center',
                borderTopRightRadius: rightCondition === condition ? 25 : 0,
                borderBottomRightRadius: rightCondition === condition ? 25 : 0,
                borderTopLeftRadius: leftCondition === condition ? 25 : 0, borderBottomLeftRadius: leftCondition === condition ? 25 : 0
            }}>
                <Text style={{ ...FONTS.h3, textTransform: 'capitalize', color: COLORS.white }}>{condition === 'pickup' ? 'pick up' : condition}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                ref.current.animateNextTransition()
                onPressLeft()
            }} style={{ alignItems: 'center', justifyContent: 'center', width: '50%', height: '100%', backgroundColor: COLORS.white, borderBottomLeftRadius: 25, borderTopLeftRadius: 25 }}>
                <Text style={leftCondition === condition ? { ...FONTS.h3, textTransform: 'capitalize' } : { ...FONTS.body3, textTransform: 'capitalize' }}>{leftCondition}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                ref.current.animateNextTransition()
                onPressRight()
            }} style={{ alignItems: 'center', justifyContent: 'center', width: '50%', height: '100%', backgroundColor: COLORS.white, borderBottomRightRadius: 25, borderTopRightRadius: 25 }}>
                <Text style={rightCondition === condition ? { ...FONTS.h3, textTransform: 'capitalize' } : { ...FONTS.body3, textTransform: 'capitalize' }}>{rightCondition === 'pickup' ? 'pick up' : rightCondition}</Text>
            </TouchableOpacity>
        </Transitioning.View>
    )
}

export default Toogler

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        flexDirection: 'row',

        marginVertical: 10,
        borderWidth: 0.3,
        borderRadius: 25,
        borderColor: COLORS.lightGray
    }
})


