import React, { useReducer } from 'react'
import storesReducer from './storesReducer';
import StoresContext from './storesContext'
import { db } from '../../services/database';
import { GET_STORES } from '../types';

const StoresState = (props) => {
    const initialState = {
        stores: [],
        loading: true
    }


    const [state, dispatch] = useReducer(storesReducer, initialState);

    const getStores = async () => {
        console.log('getting stores')
        try {

            (await db.collection('stores').where('status', '==', 'approved').get()).forEach(doc => {
                const newstore = [];
                if (doc.exists) {
                    let st = {
                        id: doc.id,
                        ...doc.data()
                    }

                    newstore.push(st)
                }
                dispatch({ type: GET_STORES, payload: newstore })

            })
        } catch (error) {
            console.log(error)

        }
    }

    return (
        <StoresContext.Provider value={{
            stores: state.stores,
            loading: state.loading,
            getStores,
        }}>
            {props.children}
        </StoresContext.Provider>
    )
}




export default StoresState;