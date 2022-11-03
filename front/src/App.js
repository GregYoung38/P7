import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Waiting from './Wait';
import Header from './components/basics/Header';
import Authentication from './components/accounts/Authentication';
import Posts from './components/posts/Posts';
import Profile from './components/accounts/Profile';
import Footer from './components/basics/Footer';

export default function App() {  
    const dispatch = useDispatch();
    const { active_user } = useSelector((state) => state);

    useEffect( () => {        
        dispatch({ type: 'REFRESH_COOKIE' })    /* [info] Mise à jour du state (user) depuis le cookie (s'il y en a un) */
        dispatch({ type: 'SET_MENU', payload: { index: 1 } })
    },[]); 

    return(      
        <div className="container" id="cont"> 
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Waiting />} />
                    <Route path="/sign/:action" element={<Authentication />} />               {/* Connection / Création de compte */}
                    <Route path="/home" element={<Posts uid={active_user} />} />
                    <Route path="/profile" element={<Profile uid={active_user} />} />

                    <Route path="*" element={
                        <div>
                            <h2>404 Ooops.. Page inexistante !</h2>
                        </div>
                    } />
                </Routes>      
            </BrowserRouter>
            <Footer />
        </div>
    )
};