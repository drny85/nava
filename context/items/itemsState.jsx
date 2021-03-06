// @ts-nocheck
import {
  GET_ITEMS,
  SET_LOADING,
  FILTER_ITEMS_BY_CATEGORY,
  CLEAR_ITEMS_FILTERS,
  SEARCH_BY_NAME,
  SET_CURRENT_ITEM,
  CLEAR_CURRENT_ITEM,
} from "../types";
import React, { useReducer } from "react";
import ItemsReducer from "./itemsReducer";
import ItemsContext from "./itemsContext";
import { db } from "../../services/database";

const ItemsState = (props) => {
  const initialState = {
    items: [],
    mostPopular: [],
    current: null,
    filtered: null,
    allItems: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(ItemsReducer, initialState);

  const getItems = async (storeId) => {
    try {

      setLoading();
      const itemsSubcription = db
        .collection("items")
        .doc(storeId)
        .collection('items')
        .where("available", "==", true)
        .onSnapshot((values) => {
          let data = [];
          values.forEach((doc) => {
            if (doc.exists) {
              let d = {
                id: doc.id,
                ...doc.data(),
              };
              data.push(d);
            }
          });
          dispatch({ type: GET_ITEMS, payload: data });
          dispatch({ type: 'MOST_POPULAR' })



        });


      return { res: true, uns: itemsSubcription }
    } catch (error) {
      console.log(error);


      dispatch({ type: GET_ITEMS, payload: [] });
      return false;
    }
  };

  const filterItemsByCategory = (text) => {
    setLoading();
    dispatch({ type: FILTER_ITEMS_BY_CATEGORY, payload: text });
  };

  const clearItemsFilters = () => {
    setLoading();
    dispatch({ type: CLEAR_ITEMS_FILTERS });
  };

  const filterByName = (text) => {
    setLoading();
    dispatch({ type: SEARCH_BY_NAME, payload: text });
  };

  const setCurrent = async (itemId) => {
    try {
      setLoading();
      const item = await db.collection("items").doc(itemId).get();

      dispatch({
        type: SET_CURRENT_ITEM,
        payload: { id: item.id, ...item.data() },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllStoresItems = async () => {

    try {
      setLoading()
      const items = []
      const ids = (await db.collection('stores').get()).docs.map(doc => doc.id)

      await ids.forEach(async id => {
        (await db.collection('items').doc(id).collection('items').get()).docs.map(i => {
          items.push({ id: i.id, ...i.data() })
        })
      })

      dispatch({ type: "ALL_ITEMS", payload: items })
    } catch (error) {
      console.log('Error getting all items', error.message)
    }

  }

  const clearCurrent = () => {
    setLoading();
    console.log("Current cleared");
    dispatch({ type: CLEAR_CURRENT_ITEM });
  };

  const changeAvailability = async (id, value) => {
    try {
      setLoading();
      await db.collection("items").doc(id).update({
        available: value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getMostPopular = () => {

    dispatch({ type: "MOST_POPULAR" })
  }



  // @ts-ignore
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <ItemsContext.Provider
      value={{
        items: state.items,
        current: state.current,
        loading: state.loading,
        filtered: state.filtered,
        allItems: state.allItems,
        mostPopular: state.mostPopular,

        getItems,
        setLoading,
        clearItemsFilters,
        filterItemsByCategory,
        filterByName,
        setCurrent,
        clearCurrent,
        changeAvailability,
        getMostPopular,
        getAllStoresItems

      }}
    >
      {props.children}
    </ItemsContext.Provider>
  );
};

export default ItemsState;
