import { combineReducers } from "redux";

import menu from './menu'
import project from './project'
import token from './token'
import tree from './tree'

const rootReducer = combineReducers({
    tree,
    token,
    menu,
    project
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;