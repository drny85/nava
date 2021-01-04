import React from 'react'
import { StyleSheet, Text, View , Image, TouchableOpacity} from 'react-native'
import { COLORS, FONTS, SIZES } from '../config'
import moment from 'moment'

const RecentOrderCard = ({order, onPress}) => {
    console.log(order)
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.topView}>
            <Image style={styles.img} resizeMode='cover' source={{uri: order.items[0]?.imageUrl}}   />
            </View>
                
           
            <View style={styles.bottomView}>
                <Text style={{...FONTS.body4, textTransform:'capitalize'}}>{order.restaurant.name}</Text>
                <Text style={{color: COLORS.lightGray, fontSize: 12, textAlign:'center'}}>{moment(order.orderPlaced).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default RecentOrderCard

const styles = StyleSheet.create({
    container: {
        width: SIZES.width / 3,
        height: '100%',
        borderRadius: SIZES.radius * 2,
        elevation: 5,
        shadowColor: COLORS.lightGray,
        shadowRadius: 4,
        
        shadowOpacity: 0.7,
        shadowOffset: {
            width: 5,
            height: 8
        }
        ,
        marginHorizontal: SIZES.padding * 0.3,
    
    },
    img: {
        height: '100%',
        width: '100%',
        borderTopLeftRadius: SIZES.radius, 
        borderTopRightRadius: SIZES.radius 
    },
    bottomView: {
        height: '30%', width: '100%', padding: 5
    },
    topView: {
        height: '70%', borderTopLeftRadius: SIZES.radius, borderTopRightRadius: SIZES.radius,
        backgroundColor: COLORS.card
    }
})
