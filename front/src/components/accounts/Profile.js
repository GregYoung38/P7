import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { Popup } from '../modals/ModAlerts';
import Navigation from '../basics/Navigation';
import User from '../basics/User';
import { v4 as uuidv4 } from "uuid";
import uuid from 'react-uuid';

import imgDefault from '../../assets/mesimages/user_default.webp'

import { getToken, axios, getUTCtime } from "../../tools/requests";     /*** FONCTIONS GLOBALES ***/

const Profile = (props) => { 
    const dispatch = useDispatch();
    const goto = useNavigate();

    const actionPopup = (bool) => {(!bool) && setShowPopup({ show: false, type: null, msg: null }) }
    const [showPopup, setShowPopup] = useState({ show: false, type: null, msg: null })

    const { menus } = useSelector((state) => state);
    const [menuIndex, setMenuIndex] = useState(menus)

    /* [info] Informations de l'utilisateur connecté */
    const { active_user } = useSelector((state) => state);
    const [userConfig, setUserConfig] = useState(active_user.user)

    const [mail, setMail] = useState();                 // Input: MAIL
    const [name, setName] = useState();                 // Input: PSEUDO
    const [photo, setPhoto] = useState();               // Input: PHOTO (obj)
    const [photoUpdated, setPhotoUpdated] = useState(); // Input: PHOTO (update)
    /* [info] -------------------------------------- */

    const inputName = useRef();
    const inputMail = useRef();
    const pImg = useRef();

    useEffect(() => { setMenuIndex(2) }, []);
    useEffect(() => { dispatch({ type:'SET_MENU', payload: { index: menuIndex } }) }, [menuIndex]);

    useEffect(() => {
        setName(active_user.user.pseudo);
        setMail(active_user.user.email);
        setPhoto(active_user.user.photo);
    }, [active_user.user]);

    useEffect(() => {
        try {
            if (photoUpdated) {
                pImg.current.src = displayPicture();
            }
            else {
                (photo !== undefined && photo !== '') 
                    ? (pImg.current.src = `${process.env.REACT_APP_PICS_PROFILES}${photo}`) 
                    : (pImg.current.src = imgDefault)           
            } 
        }
        catch(err) { }        
    }, [photo]);

    const validateMail = () => {
        /* [info] Contrôle de l'adresse email */
        const Regex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$'); 

        var message = '';
        if (!Regex.test(inputMail.current.value)) message = `L'adresse email comporte des erreurs !\r\n`
        return message
    }

    function updateProfile(e) {
        e.preventDefault();
        const token = getToken();

        if (token !== null && validateMail().length === 0) {
            var DONNEES = new FormData();
            DONNEES.append('pseudo', inputName.current.value);
            DONNEES.append("email", inputMail.current.value); 
            DONNEES.append('sharedImg', photo);

            const head = { 
                headers: {   
                    Accept: 'application/json, text/html',
                    "Content-Type": "multipart/form-data; charset=utf-8; boundary=----WebKitFormBoundarySd8PqpLTuffYJfYC",
                    Authorization: "Bearer "+token
                }
            }

            axios('user').put(`/update/${props.uid.user.userId}`, DONNEES, head)
            .then((res) => {                
                if (res.status === 200) {
                    // Token mis à jour par le back-end -> Redéfinition du cookie avec les nouvelles infos de l'utilisateur
                    document.cookie = `token=${ res.data.token }; 
                                       expires=${ new Date(Date.now() + 31104000000).toUTCString() }`; 

                    const out = {
                        ...res.data.content,
                        userId: res.data.content._id
                    }
                    delete(out._id)
                    
                    setPhotoUpdated('')                    

                    // [info] Mise à jour du contexte
                    dispatch({ type: 'SET_USER', payload: out })    
                    setShowPopup({ show: true, type: 'success', msg: `Informations mises à jour` })               
                }
            })
            .catch((err) => console.log('Problème de mise à jour pour l\'utilisateur.. \r\n', err.response) )
        }
        else {
            setShowPopup({ show: true, type: 'error', msg: `Des erreurs ont été constatées..` }) 
        }
    }

    function addPicture(e) {
        setPhoto(e.target.files[0])
        setPhotoUpdated(e.target.value)
    }
    function displayPicture() {        
        if (photoUpdated) return URL.createObjectURL(photo)
        return photo 
    }
    function runInputFile(e) {
        e.preventDefault();
        document.querySelector('#input-file').click()
    }

    return [
        <section key={uuidv4()}>
            <div className='header-nav'>
                <Navigation />
                <User />
            </div>
        </section>,   

        (showPopup.show) ? (<Popup display={actionPopup} message={showPopup.msg} type={showPopup.type} key={uuid} />) : null,

        <div className="profile" key={uuidv4()}>
            <img id="testImage" ref={pImg} src={(photo) 
                ? `${process.env.REACT_APP_PICS_PROFILES}${photo}` 
                : imgDefault} alt={`image de profil`}
            />
            
            <div>
                <label htmlFor="name">Votre pseudo :</label>
                <input className="name" type="text" name="name" placeholder="nom d'utilisateur"
                       defaultValue={name} required ref={inputName} />
            </div>

            <div>
                <label htmlFor="email">Votre mail :</label>
                <input className="username" type="email" name="email" placeholder="adresse de contact"
                       defaultValue={mail} required ref={inputMail} />
            </div>

            <hr size="1" color="dimgray"/>

            <div>
                <button className='updatePix' onClick={(e) => runInputFile(e)}>
                    {!photo ? 'Ajouter une photo' : 'Modifier la photo'}
                </button>  
                <input type="file" id='input-file' value={''} onChange={(e) => addPicture(e) } />
            </div>

            <button onClick={(e) => updateProfile(e)}>mettre à jour</button>
        </div>
    ]
};
  
export default Profile