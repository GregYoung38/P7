import getConnectedUser from '../tools/getConnectedUser'
var initialState = { user: {} }

export default function reducer( state = initialState, action ) {      
    let newState

    switch (action.type) {
        case 'REFRESH_COOKIE' :  /* Obtenir les détails de l'utilisateur connecté */
            const res = getConnectedUser;
            var data;
            if (res !== undefined) {
                if (res.length > 1 && res[1]) {  
                    data = res[1];
                    return {
                        ...state, 
                        user: data
                    }
                }     
            }
            
            return state;

        case 'GET_USER' :  /* Obtenir les détails de l'utilisateur connecté */
            newState = {
                ...state
            }
            return newState;

        case 'SET_USER' :  /* Définir un utilisateur comme étant l'utilisateur connecté */
            const PL = action.payload;
            newState = {
                ...state,
                user: { ...PL }
            }
            return newState;

        case 'CLEAR_USER' : /* Déconnecter l'utilisateur */
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC'; 
            newState = {
                ...state,
                user: {}
            }
            return newState;

        default :
            newState = {
                ...state
            }
            return newState;
    }
}