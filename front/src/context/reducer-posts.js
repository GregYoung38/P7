var initialState = { posts: [] }

export default function reducer( state = initialState, action ) {      
    let newState;

    switch (action.type) {
        case 'LOAD_POSTS' :  /* Obtenir les publications à jour */
            newState = {
                ...state,
                posts: action.payload
            }
            return newState

        case 'ADD_LIKER' : /* Ajouter un like */
            const PLD = action.payload.liker;
            newState = { 
                ...state,
                ...state.posts.map((el) => 
                    (el._id === action.payload.id) && {...el.usersLiked, PLD}
                ) 
            }
            return newState

        case 'DELETE_LIKER' : /* Supprimer un like */
            newState = { 
                ...state,
                ...state.posts.map((el) => 
                    (el._id === action.payload.id) && {...el.usersLiked.filter((tag) => tag !== action.payload.liker) }
                ) 
            }
            return newState

        case 'ADD_POST' :  /* Ajouter une publication au store */
            var arr = [...state.posts, action.payload]
            arr.sort(function compare(a, b) {
                if (a.date_creation < b.date_creation) return 1;
                if (a.date_creation > b.date_creation ) return -1;
                return 0;
            });

            newState = {   
                ...state,
                posts : arr
            }
            return newState

        case 'UPDATE_POST' : /* Supprimer une publication */
            newState = { 
                ...state,
                ...state.posts.map((item) =>
                    item._id === action.payload.data.id && { ...item, ...action.payload.data }
                ) 
            }                       
            return newState
        
        case 'DELETE_POST' : /* Supprimer une publication */
            newState = {
                ...state,
                posts: [ ...state.posts.filter((el) => el._id !== action.payload.id) ]
            }
            return newState;

        default :
            return { ...state };
    }
}