import { createSlice } from '@reduxjs/toolkit';

export const pageSlice = createSlice({
    name: 'page',
    initialState: {
        variable: true,
    },
    reducers: {
        setVariable: (state, action) => {
            state.variable = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setVariable,
} = pageSlice.actions;

export default pageSlice.reducer;