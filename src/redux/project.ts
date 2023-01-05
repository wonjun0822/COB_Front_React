import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type projectState = {
    code: string
}

const initialState: projectState = {
    code: ''
}

export const project = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setProjectCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload;
        },
    }
})

export const { setProjectCode } = project.actions;

export default project.reducer;