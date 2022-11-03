import React, { useEffect } from 'react'

import info from '../../assets/mesimages/info.webp';
import alert from '../../assets/mesimages/alert.webp';
import error from '../../assets/mesimages/error.webp';
import success from '../../assets/mesimages/checked.webp';

export function Popup(props) {
    const config = {
        duree: (props.delay ? (props.delay*1000) : 3000),
        class: (props.delay ? `delay${props.delay}` : `delay3`)
    }

    useEffect( () => {
        // Relatif à l'animation CSS de fermeture s'exécutant à 200ms de moins (fluidité, cohérence)
        setTimeout( () => { props.display(false) }, config.duree);
    }, [])

    return (
        <div className={`modal menu alert ${config.class}`}>
            {props.type === 'info' && <img src={info} width="25" height="25" alt="icône d'information" />}
            {props.type === 'error' && <img src={error} width="24" height="24" alt="icône d'erreur" />}
            {props.type === 'alert' && <img src={alert} width="25" height="25" alt="icône d'alerte" />}
            {props.type === 'success' && <img src={success} width="20" height="20" alt="icône de réussite" />}

            <p>                
                {props.message}
            </p>
        </div>
    )
}
