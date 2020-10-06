import React, { useReducer } from "react";
import storesReducer from "./storesReducer";
import StoresContext from "./storesContext";
import { db } from "../../services/database";
import { GET_STORES } from "../types";

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
      const newstore = [];
      (
        await db
          .collection("stores")
          .where("status", "==", "approved")
          .where("hasItems", "==", true)
          .get()
      ).forEach((doc) => {
        if (doc.exists) {
          let st = {
            id: doc.id,
            ...doc.data(),
          };

          newstore.push(st);
        }

        dispatch({ type: GET_STORES, payload: newstore });
      });
    } catch (error) {
      console.log(error);
    }
  };



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
