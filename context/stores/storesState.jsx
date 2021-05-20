import React, { useReducer } from "react";
import storesReducer from "./storesReducer";
import StoresContext from "./storesContext";
import { db } from "../../services/database";
import { GET_STORES, SET_LOADING, SUBMITTING_APPLICATION } from "../types";

const StoresState = (props) => {
  const initialState = {
    stores: [],
    store: null,
    loading: true,
    current: null,
  };

  const [state, dispatch] = useReducer(storesReducer, initialState);

  let storesSub;

  const getStores = async () => {

    try {

      setLoading()

      const snapshot = db.collection('stores').where('status', '==', 'approved').where('hasItems', '==', true).onSnapshot(values => {
        const allStores = [];
        values.forEach(doc => {
          if (doc.exists) {
            const store = { id: doc.id, ...doc.data() }
            allStores.push(store)
          }
        })

        dispatch({ type: GET_STORES, payload: allStores });

      })

      storesSub = snapshot

      return snapshot;


    } catch (error) {
      console.log('Error loading stores', error);
    }
  };

  const newStoreApplication = async (storeInfo) => {
    try {
      dispatch({ type: SUBMITTING_APPLICATION })
      console.log('HHHHHHH')
      const res = await db.collection('stores').where('street', '==', storeInfo.street).where('phone', '==', storeInfo.phone).get();
      const found = res.size > 0;

      if (found) {
        dispatch({ type: STORE_ERROR, payload: 'Application already exists' })
        return
      }

      const store = await db.collection('stores').add(storeInfo)

      //dispatch({ type: STORE_SUCCESS })

      return { success: true, id: store.id }



    } catch (error) {
      console.log(error.message)
      // dispatch({ type: STORE_ERROR, payload: error.message })
      return false
    }


  }

  const setLoading = () => dispatch({ type: SET_LOADING })



  return (
    <StoresContext.Provider
      value={{
        stores: state.stores,
        store: state.store,
        loading: state.loading,
        current: state.current,
        newStoreApplication,

        getStores,
        storesSub,
      }}
    >
      {props.children}
    </StoresContext.Provider>
  );
};

export default StoresState;
