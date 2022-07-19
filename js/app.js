const player1 = {
    // Informations joueur
    name: 'Joueur 1',
    globalScore: 0,
    currentScore: 0,
    playGame: true,
    currentScoreP: document.querySelector('.block-player1 .round-score'),
    globalScoreP: document.querySelector('.block-player1 .global-score'),
    blockPlayer: document.querySelector('.block-player1')
}
const player2 = {
    name: 'Joueur 2',
    globalScore: 0,
    currentScore: 0,
    playGame: false,
    currentScoreP: document.querySelector('.block-player2 .round-score'),
    globalScoreP: document.querySelector('.block-player2 .global-score'),
    blockPlayer: document.querySelector('.block-player2')
}

// Bouton lancer, collecter et nouveau jeu
let btnRollDice = document.querySelector('.btn-lancer');
let btnHold = document.querySelector('.btn-hold');
let btnNewGame = document.querySelector('.new-game');

let dice = document.querySelector('.dice img');
let scoreOtherPlayer = document.querySelector('.score-other-player p')

// Function qui retourne un nombre aléatoire entre 1 et 6
let rollDice = function () {
    return Math.ceil(Math.random() * 6);
}

// Permet de mettre un délai avant de pouvoir relancer le dé
let waitRollDice = true;

btnRollDice.addEventListener('click', (e) => {
    if (waitRollDice) {
        waitRollDice = false;
        btnRollDice.style.opacity = 0.6;
        btnHold.style.opacity = 0.6;

        // Vérifie quel joueur à la main
        if (player1.playGame === true) {
            playGame(player1);
        } else {
            playGame(player2);
        }
    } else {
        console.log('Le dé ne sest pas encore arreté');
    }

    e.preventDefault();
});

function playGame(player) {
    // On récupère le score du dé et on fait une animation sur le dé.
    let scoreDice = rollDice();
    dice.classList.add('animation-dice');

    // On met un suspense de quelques secondes avant d'afficher le résulat
    setTimeout(() => {
        // Affiche le bon dé suivant le résultat du dé
        dice.setAttribute('src', `ressources/images/dices/dice${scoreDice}.svg`);

        if (scoreDice >= 4) {
            // On affecte et affiche le score total courant avec une animation
            player.currentScoreP.innerText = '😭';
            player.blockPlayer.style.border = '10px solid #D7263D';
            
            setTimeout(() => {
                changePlayer(player);
            }, 2500)
        } else {
            /**
             * On affecte le resultat du dé au score courant du joueur, puis on lance une animation qui retire de l'écran le score obtenue et affiche le score courant total
            */
            player.currentScore = player.currentScore + scoreDice;
            player.currentScoreP.innerText = '+' + scoreDice;
            player.currentScoreP.classList.add('add-score-dice');

            setTimeout(() => {
                setTimeout(() => {
                    player.currentScoreP.innerText = player.currentScore;
                    player.currentScoreP.classList.remove('out-left');
                }, 500)
                
                player.currentScoreP.classList.add('out-left');
            }, 1000)
        }

        // On supprime toutes les classes qui ont été ajouté
        dice.classList.remove('animation-dice');
        player.globalScoreP.classList.remove('add-score-dice');
    }, 2500)

    // On attend 5 secondes avant de pouvoir relancer le dé.
    setTimeout(() => {
        waitRollDice = true;
        btnRollDice.style.opacity = 1;
        btnHold.style.opacity = 1;
    },5000)
}



/**
 Changer de joueur, on remet son score courant à 0, on inverse les valeurs bool playGame des deux joueurs et on réactive le bouton lancer.
 */
function changePlayer(player) {
    player.currentScore = 0;
    player.currentScoreP.innerText = 0;
    player.currentScoreP.classList.add('add-score-dice');
    dice.setAttribute('src', `ressources/images/dices/dice6.svg`);
    player1.playGame = !player1.playGame;
    player2.playGame = !player2.playGame;

    player.blockPlayer.style.border = '';
    btnRollDice.style.opacity = 1;
    btnHold.style.opacity = 1;
    waitRollDice = true;

    knowScoreOtherPlayer(player);
    whoIsPlaying();
}

// Événement au click sur le bouton collecter (fonctionne comme le bouton lancer)
btnHold.addEventListener('click', (e) => {
    if (waitRollDice) {
        // Vérifie quel joueur à la main
        if (player1.playGame === true) {
            collecte(player1);
        } else {
            collecte(player2);
        }
    } else {
        console.log('Attendre que le dé sarrete pour collecter');
    }

    e.preventDefault();
})


// Permet de connaitre le score global de l'autre joueur
function knowScoreOtherPlayer(player) {
    if(player === player1) {
        scoreOtherPlayer.innerText = 'Score global de l\'autre joueur : ' + player.globalScore;
    } else {
        scoreOtherPlayer.innerText = 'Score global de l\'autre joueur : ' + player2.globalScore;
    }   
}

/*
Collecte le score actuel pour le mettre dans le globale et change de joueur
Si le joueur à plus de 100 en global, il remporte la partie et on remet les compteur à zero.
 */
function collecte(player) {
    if (player.currentScore === 0) {
        alert('Il n\'y a rien à collecter pour le ' + player.name);
    } else {
        waitRollDice = false;
        btnRollDice.style.opacity = 0.5;
        btnHold.style.opacity = 0.5;
        
        player.globalScore = player.globalScore + player.currentScore;
        player.globalScoreP.innerText = player.globalScore;
        player.currentScoreP.innerText = '🏦';
        setTimeout(() => {
            changePlayer(player)
            if (player.globalScore >= 50) {
                alert(`Le ${player.name} a gagné 🎉 🥳`);
                restartGame(player1)
                restartGame(player2)
            }
        }, 1500)
    }
    // On supprime toutes les classes qui ont été ajouté
    player.globalScoreP.classList.remove('add-score-dice');
}


// Recommencer une nouvelle partie
btnNewGame.addEventListener('click', (e) => {
    // Demander confirmation si partie déjà en cours
    if (player1.currentScore || player2.currentScore || player1.globalScore || player2.globalScore != 0) {
        let confirmNewGame = confirm('Voulez-vous recommencer votre partie ?');
        if (confirmNewGame) {
            restartGame(player1);
            restartGame(player2);
        }
    } else {
        restartGame(player1);
        restartGame(player2);
    }

    e.preventDefault()
})

// Remet le jeu à zéro 
function restartGame(player) {
    player.globalScore = 0;
    player.globalScoreP.innerText = 0;
    player.currentScore = 0;
    player.currentScoreP.innerText = 0;

    player1.playGame = true;
    player2.playGame = false;
    waitRollDice = true;
    dice.setAttribute('src', `ressources/images/dices/dice6.svg`);

    whoIsPlaying();
}

// Permet de savoir qui doit jouer
function whoIsPlaying() {
    if (player1.playGame === true) {
        player1.blockPlayer.classList.add('actif');
        player1.blockPlayer.classList.remove('inactif');
        player2.blockPlayer.classList.add('inactif');
        player2.blockPlayer.classList.remove('actif');
    } else {
        player1.blockPlayer.classList.remove('actif');
        player1.blockPlayer.classList.add('inactif');
        player2.blockPlayer.classList.remove('inactif');
        player2.blockPlayer.classList.add('actif');
    }
}




















