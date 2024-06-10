import { configureStore } from '@reduxjs/toolkit';
import pageReducer from "./page/pageSlice";


export default configureStore({
    reducer: {
        page: pageReducer
    },
})