import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type tokenState = {
    accessToken: string
}

const initialState: tokenState = {
    accessToken: ''
}

export const token = createSlice({
    name: 'token',
    initialState: initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
    }
})

export const { setAccessToken } = token.actions;

export default token.reducer;