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

  const getStores = async () => {
    console.log("getting stores");
    try {

      setLoading()

      const query = await db
        .collection("stores")
        .where("status", "==", "approved")
        .where("hasItems", "==", true)
        .get()


      const allStores = query.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
      })

      console.log(allStores)
      dispatch({ type: GET_STORES, payload: allStores });

    } catch (error) {
      console.log(error);
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
      }}
    >
      {props.children}
    </StoresContext.Provider>
  );
};

export default StoresState;
