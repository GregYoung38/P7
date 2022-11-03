import React from 'react';                       /* Gestion des hooks d'état */
import { useParams } from 'react-router-dom';
import Authforms from './Authforms.js'

export default function Dispatching() {        
    const { action } = useParams()      // Vaut [connect] ou [create]
    var news

    switch (action) {
        case 'connect': 
            news = {
                form: action,
                title: 'Connectez-vous',
                link: '/sign/create',
                text: 'pas encore inscrit ?',
                bttnTxt: 'se connecter'
            }
            break;

        case 'create': 
            news = {
                form: action,
                title: 'Inscrivez-vous',
                link: '/sign/connect',
                text: 'se connecter',
                bttnTxt: 's\'inscrire'
            }
            break;              
    }   
    
    return(
        <Authforms indice={news} />
    )    
}