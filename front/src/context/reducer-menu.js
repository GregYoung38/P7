var initialState = { menu: 1 }

export default function menus( state = initialState, action ) {      
    let newState

    switch (action.type) {
        case 'GET_MENU' :  /* Obtenir les détails de l'utilisateur connecté */
            newState = {
                ...state
            }
            return newState;

        case 'SET_MENU' :  /* Définir un utilisateur comme étant l'utilisateur connecté */
            newState = {
                ...state,
                menu: action.payload.index
                }
            return newState;

        default :
            newState = {
                ...state
            }
            return newState;
    }
}