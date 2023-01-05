import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Tree = {
    id: string,
    parent: string,
    text: string,
    class: string
};

export type treeState = Tree

const initialState: treeState = {
    id: '',
    parent: '',
    text: '',
    class: ''
};

export const tree = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setSelectedTree: (state, action: PayloadAction<Tree>) => {
            state.id = action.payload.id
            state.parent = action.payload.parent
            state.text = action.payload.text
            state.class = action.payload.class
        }
    }
})

export const { setSelectedTree } = tree.actions;

export default tree.reducer;