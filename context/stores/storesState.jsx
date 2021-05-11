import React, { useReducer } from "react";
import storesReducer from "./storesReducer";
import StoresContext from "./storesContext";
import { db } from "../../services/database";
import { GET_STORES, SET_LOADING } from "../types";

const StoresState = (props) => {
  const initialState = {
    stores: [],
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

  const setLoading = () => dispatch({ type: SET_LOADING })



  return (
    <StoresContext.Provider
      value={{
        stores: state.stores,
        loading: state.loading,
        current: state.current,

        getStores,
        storesSub,
      }}
    >
      {props.children}
    </StoresContext.Provider>
  );
};

export default StoresState;
