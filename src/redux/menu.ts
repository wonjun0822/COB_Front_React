import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MainMenu = {
    Idx: number,
    MenuType: string,
    MenuName: string,
    MenuIcon: string
};

export type SubMenu = {
    Idx: Number,
    MenuIdx: Number,
    Path: string,
    Url: string,
    SubMenuName: string
}

export type menuState = {
    mainMenu: MainMenu[],
    subMenu: SubMenu[]
};

const initialState: menuState = {
    mainMenu: [],
    subMenu: []
};

export const menu = createSlice({
    name: 'menu',
    initialState: initialState,
    reducers: {
        setMainMenu: (state, action: PayloadAction<MainMenu[]>) => {
            state.mainMenu = action.payload;
        },
        setSubMenu: (state, action: PayloadAction<SubMenu[]>) => {
            state.subMenu = action.payload
        }
    }
})

export const { setMainMenu, setSubMenu } = menu.actions;

export default menu.reducer;