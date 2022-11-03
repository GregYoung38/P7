function getConnectedUser() {
    var msg = [];

    if (document.cookie) {
        var myCookie = null;
        document.cookie.split(';').forEach((cookie) => {
            const [ name, value ] = cookie.split('=').map(c => c.trim());
            if (name === 'token') { myCookie = value }
        });      

        if (myCookie) {
            fetch(`${process.env.REACT_APP_HOSTBACK}/api/auth/refreshToken`, { 
                method: 'POST',
                headers: { authorization: `Bearer ${myCookie}`,
                           'Content-Type': 'application/json' }
            })
            .then( (response) => {
                response.json()  
                .then((res) => {       
                    msg.push({ message : res.message }); 

                    const contenu = res.content; 
                               
                    const initialState = {
                        user: {
                            userId: contenu.user._id,
                            email: contenu.user.email,
                            pseudo: contenu.user.pseudo,
                            photo: contenu.user.photo,
                            isAdmin: contenu.user.isAdmin
                        }  
                    }
                    msg.push(initialState.user);
                })        
            })
            .catch(err => msg.push(err))
        } 
        else {
            msg.push({ message : 'Cookie <token> introuvable' });
        }        
    }
    else {
        msg.push({ message : 'non connecté' })        
    }

    return msg
}

export default getConnectedUser()