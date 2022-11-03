import React, { useState, useEffect } from 'react';         /* Gestion des hooks */
import { NavLink, useNavigate } from 'react-router-dom';    /* Création de liens de menu */
import { useDispatch } from 'react-redux'

import Avatar from './Avatar';
import { axios, getUTCtime } from "../../tools/requests";   /*** FONCTIONS GLOBALES ***/

import { Popup } from '../modals/ModAlerts';
import { v4 as uuidv4 } from "uuid";

const Login_Connect_form = (props) => {
    const goto = useNavigate();
    const dispatch = useDispatch();
        
    const [pseudo, setPseudo] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')       
    const [confirm, setConfirm] = useState('')    
    
    const isLogin = (props.indice.form === 'connect') ? true : false  

    function pseudoCheck(e) { setPseudo(e.target.value) }
    function emailCheck(e) { setEmail(e.target.value) }
    function passwordCheck(e) { setPassword(e.target.value) }

    const [showPopup, setShowPopup] = useState({ show: false, type: null, delay: 3, msg: null });
    async function actionPopup(bool) { (!bool) && setShowPopup({ show: false, type: null, delay: 3, msg: null }) };


    useEffect(() => {
        try {
            /* [info] Pour le responsive.. */
            const container = document.querySelector('.container')
            container.classList.add('loginform')
        }
        catch(err) {}  
    }, []);    


    function pre_validation() {    
        /* ----------------------------------  Expressions régulières  ---------------------------------- */
        /* [info] Contrôle du nom d'utilisateur */
        const RegExp1 = new RegExp("^[a-zA-Z0-9 àâäéèêëïîôöùûüç\s,'-]*$");        

        /* [info] Contrôle de l'adresse email */
        const RegExp2 = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$'); 
        
        /* [info] Contrôle du mot de passe */
        const RegExp3 = new RegExp('^[A-Za-z0-9]{8,}$');
        /* ---------------------------------------------------------------------------------------------- */

        const inputs = document.querySelectorAll("form input:not([type=submit])");
        var msgs = '';
    
        /* Contrôles instantanés */    
        inputs.forEach(function(element) {
            switch (element.id) {
                case 'username': 
                    msgs += testInputs(element, RegExp1, 'le nom d\'utilisateur');
                    break;
                case 'email': 
                    msgs += testInputs(element, RegExp2, 'le mail');
                    break;
                case 'password': 
                    msgs += testInputs(element, RegExp3, 'le mot de passe');
                    break;                
                case 'confirmPwd': 
                    msgs += testInputs(element, RegExp3, 'la confirmation du mot de passe');
                    break;                  
            }      
        }) 
        return msgs   
    }
    function testInputs(input, regexp, cible) { 
        var message = '';

        if (input.value === '') {
            message = `Veuillez renseigner ${cible} \r\n`;
        }
        else {
            if (!regexp.test(input.value)) message = `${cible} comporte des erreurs !\r\n`
        } 
    
        if (!message && input.id === 'confirmPwd') {
            if (input.value !== document.querySelector('input#password').value) {
                message = `Les mots de passe ne correspondent pas`
            }
        }
        return message
    }
    function handleConnect() {        
        if (email !=='' && password !=='') {  
            axios('user').post('/login', { email: email, password: password })
            .then((res) => {
                // Créer un cookie pour une durée de validité "arbitraire" de 12 mois (86400000ms => 1 jour)
                document.cookie = `token=${ res.data.accessToken }; 
                                   expires=${ new Date(Date.now() + 31104000000).toUTCString() }`;
                
                const reponse = {
                    ...res.data.reponse,
                    userId: res.data.reponse._id
                }
                delete reponse._id

                setShowPopup({ show: true, type: 'success', delay: 2, msg: `Connection réussie !` })
                dispatch({ type: 'SET_USER', payload: reponse })
                setTimeout( () => { goto('/home') }, 3000);
            })
            .catch((err) => {          
                setShowPopup({ show: true, type: 'error', delay: 2, msg: `Connection refusée` }) 
            })
        } 
        else {
            setShowPopup({ show: true, delay: 2, msg: `Des champs requis sont manquants` })  
        }
    }
    function handleCreate(){        
        const err = pre_validation();

        if (err.length > 0) {
            setShowPopup({ show: true, msg: pre_validation() })  
        }
        else {            
            axios('user').post(`/signup`, {
                pseudo: pseudo,
                email: email,
                password: password,
                photo: ''
            })   
            .then(res => {
                setShowPopup({ show: true, type: 'success', msg: `Compte créé..` }) 
                setTimeout( () => { goto('/sign/connect') }, 3000);
            })
            .catch((error) => setShowPopup({ show: true, msg: error }) )
        }
    }
    
    return [        
        (showPopup.show) && (<Popup display={() => actionPopup()} type={showPopup.type} message={showPopup.msg} delay={showPopup.delay} key={uuidv4()} />),

        <div className="auth" key={uuidv4} >        
            <Avatar />        
        
            <h1>{ props.indice.title }</h1>

            {   // Création du champ de saisie "pseudonyme"
                (props.indice.form === 'create') && 
                <input id='username' className="username" type="text" 
                    placeholder="nom d'utilisateur" defaultValue=''
                    onChange={pseudoCheck} /> 
            }               

            <input id='email' className="username" type="email" 
                placeholder="adresse email" defaultValue=''
                onChange={emailCheck} />

            <input id='password' className="password" type="password" 
                placeholder="mot de passe" defaultValue=''
                onChange={passwordCheck} />
            
            {   // Création du champ de saisie "confirmation du password"
                (props.indice.form === 'create') && 
                    <input id='confirmPwd' className='confirm' type='password' 
                        onChange={(e)=>{ setConfirm(e.target.value)} } 
                        placeholder='confirmez..'  defaultValue='' /> 
            }                     

            <button className="auth" onClick={()=>{ isLogin ? handleConnect() : handleCreate() } }>
                { props.indice.bttnTxt }
            </button>

            <ul>       
                {/* Permet de se diriger sur la form "se connecter" ou bien "créer un compte" */}
                <NavLink to={props.indice.link}>
                    <li><span className='text'>{ props.indice.text }</span></li>
                </NavLink> 
            </ul>            
        </div>        
    ]    
}

export default Login_Connect_form