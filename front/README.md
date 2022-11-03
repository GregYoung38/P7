# P7 : GROUPOMANIA --> Créez un réseau social d’entreprise
    -------------------------------------------- Sujet --------------------------------------------
    Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web
    regroupant une douzaine d'employés.
    Votre directrice, Stéphanie, vient de signer un nouveau contrat avec Groupomania, un groupe
    spécialisé dans la grande distribution, et l'un des plus fidèles clients de l'agence.
    Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le
    but de cet outil est de faciliter les interactions entre collègues. Le département RH de
    Groupomania a imaginé plusieurs fonctionnalités pour favoriser les échanges entre collègues.
    Après en avoir discuté avec Caroline, votre manager, elle vous envoie un mail pour vous briefer
    sur votre mission :

    ------------------------------------------- Attendus ------------------------------------------
    En ce qui concerne l’aspect graphique, nous allons pour le moment limiter les choses au
    minimum, c’est-à-dire :
    respecter l’identité graphique fournie dans le brief ;
    produire quelque chose de responsive qui s'adapte aux desktop, tablette et mobile ;
    tout le reste est expliqué sur le brief. À part ça, tu as carte blanche, mais attention à ne
    pas te lancer dans quelque chose de trop compliqué.
    Côté technique aussi, nous sommes assez libres sur ce projet ; néanmoins il y a quelques
    éléments qu’il faut avoir en tête avant de commencer le projet :
    pour ce nouveau projet on part vraiment de zéro, tu vas donc devoir mettre en place le
    backend, le frontend et la base de données ;
    le projet doit être codé en JavaScript et respecter les standards WCAG ;
    il est obligatoire d’utiliser un framework front-end JavaScript. Comme on part de zéro,
    libre à toi d’utiliser celui que tu préfères (React, Vue, Angular…). Je te conseille d’utiliser
    React, mais ça reste à toi de décider ;
    pour la base de données, tu peux utiliser les outils de ton choix. Tu peux utiliser soit une
    base de données non relationnelle, comme mongoDB par exemple, soit une base de
    données relationnelle (en t’aidant d’un ORM si tu le souhaites) ;
    pense à bien fournir un README avec ton code, expliquant comment installer le site sur
    un nouveau poste.

# Installation & Exécution
    1) Depuis les dossiers {back} et {front}, exécutez npm install dans le terminal.
    2) Lancez respectivement :
       --> cd back 
       --> npm start
       --> cd front 
       --> npm start

       Le programme se lancera dans le navigateur sur le port défini par défaut dans l'application :
       Back-End : port 3000
       Front-End : port 5000

# Configuration Variables d'environnement / MongoDB :
    Pour fonctionner correctement, vous devez définir les variables d'environnement comme suit :
    ¤ Fichier back/.env :
        PORT = 3000
        MDB_LOGIN = < votre login >
        MDB_PWD = < votre mot de passe >
        MDB_CLSTR = < votre cluster >
        MDB_DATABASE = < votre nom de base de données >
        ACCESS_TOKEN_SECRET = 0

    La structure des champs est définie au niveau back-end.
    Si vous décidez d'utiliser un port différent pour le back-end, vous devrez mettre à jour les 
    variables d'environnement précisées dans le fichier front/.env :
        REACT_APP_HOSTBACK = http://localhost:3000
        REACT_APP_PICS_PROFILES = http://localhost:3000/pictures/profiles/
        REACT_APP_PICS_POSTS = http://localhost:3000/pictures/posts/

    Si vous décidez d'utiliser un port différent pour le front-end, vous devrez mettre à jour le script
    {start} du fichier package.json initialement réglé sur : 
        "start": "set PORT=5000 && react-scripts start"

# Pré-processeur SASS en mode développpement :
    Exécutez les commandes suivantes depuis le terminal :
        cd front
        npm run sass



 
