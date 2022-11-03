import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'

import userReducer from './reducer-user'
import menuReducer from './reducer-menu'
import postsReducer from './reducer-posts'
import commentReducer from './reducer-comment'

/*
    Cette page permet de combiner plusieurs reducers
*/

const rootReducer = combineReducers({
    active_user: userReducer,
    menus: menuReducer,
    posts: postsReducer,
    comment: commentReducer
})

const store = configureStore({ reducer : rootReducer })

export default store;