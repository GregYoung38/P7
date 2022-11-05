const _axios = require('axios');

export function getUTCtime() {
    /* [info] Mise à jour de la date-système */
    var utc = new Date();
    var tz = (utc.getTimezoneOffset())/60;

    utc.setTime(utc.getTime() - tz * 60 * 60 * 1000);  
    return utc;
}

export function axios(destination) {
    if (destination === 'user') {
        return _axios.create({ baseURL: `${ process.env.REACT_APP_HOSTBACK }/api/auth` });
    }
    else {
        return _axios.create({ baseURL: `${ process.env.REACT_APP_HOSTBACK }/api/posts` });
    }
}

export function getToken() {
    var myCookie = null;

    if (document.cookie) {            
        document.cookie.split(';').forEach((cookie) => {
            const [ name, value ] = cookie.split('=').map(c => c.trim());
            if (name === 'token') { 
                myCookie = value
            }
        });   
    }
    return myCookie
}