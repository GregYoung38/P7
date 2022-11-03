var initialState = { comment: [] }

export default function reducer( state = initialState, action ) {      
    let newState;

    switch (action.type) {
        case 'LOAD_COMMENTS' :  /* Charger les publications à jour */
            newState = {
                ...state,
                comment: action.payload
            }
            return newState

        case 'ADD_COMMENT' :  /* Charger les publications à jour */
            var arr = [...state.comment, action.payload]
            // arr.sort(function compare(a, b) {
            //     if (a.date_creation < b.date_creation) return 1;
            //     if (a.date_creation > b.date_creation ) return -1;
            //     return 0;
            // });

            newState = {
                ...state,
                comment: arr
            }
            return newState

        case 'UPDATE_COMMENT' :  /* Charger les publications à jour */
            newState = {
                ...state,
                comment: [...state.comment, action.payload ]
            }
            return newState

        case 'DELETE_COMMENT' : /* Supprimer une publication */
            newState = {
                ...state,
                comment: [ ...state.comment.filter((el) => el._id !== action.payload.id) ]
            }
            return newState;

        default :
            return { ...state };
    }
}