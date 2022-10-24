let nrLines = 16;
let nrColumns = 16;
let nrBombs = 40;
let nrFlags = nrBombs;
let revealedBoard = [];
let matrix = []; 
let bomb = -1;
let gameStatus = nrLines * nrColumns - nrBombs;
let counter = 0;

//Sounds
let bombSound = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/descent/bomb.mp3');
let numberSound = new Audio('http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg');
let openSpaceSound = new Audio ('http://codeskulptor-demos.commondatastorage.googleapis.com/descent/Crumble%20Sound.mp3');
let winSound = new Audio ('http://starmen.net/mother1/music/08%20-%20MOTHER%20-%20You%20Won.mp3');

//Timer
const time_el = document.querySelector('.time');
let seconds = 0;
let interval = null;

function createRevealdBoard() {
    let matBoard = document.getElementById("gameBoard");
    for (let l = 0; l < nrLines; ++l) {
        revealedBoard[l] = document.createElement('tr');
        matBoard.append(revealedBoard[l]);
        for (let c = 0; c < nrColumns; ++c) {
            revealedBoard[l][c] = document.createElement('td');
            revealedBoard[l][c].innerText = "";
            revealedBoard[l][c].value = 0;
            revealedBoard[l].append(revealedBoard[l][c]);
            addAndRemoveFlags(l, c);
            clickedBoard(l, c);
        }
    }
    createMatrix();
}

function createMatrix() {
    for (let l = 0; l < nrLines; ++l) {
        let line = [];
        for (let c = 0; c < nrColumns; ++c) {
            line.push(0);
        }
        matrix.push(line);
    }
    addBombs();
} 

function addBombs() {
    for (let b = 1; b <= nrBombs;) {
        let l = Math.floor(Math.random() * nrLines);
        let c = Math.floor(Math.random() * nrColumns);
        if (matrix[l][c] == 0) {
            matrix[l][c] = bomb;
            ++b;           
        } 
    }
    generateNumbers();
}

function generateNumbers() {
    for (let l = 0; l < nrLines; ++l) {
        for (let c = 0; c < nrColumns; ++c) {
            if (matrix[l][c] === bomb) {
                for (let i = l - 1; i <= l + 1; ++i) {
                    for (let j = c - 1; j <= c + 1; ++j) {
                        if (i > -1 && i < nrLines && j > -1  && j < nrColumns && matrix[i][j] != bomb) {
                            matrix[i][j] += 1;
                        }
                    }
                }
            } 
        }
    }
    for (let l = 0; l < nrLines; ++l) {
        for (let c = 0; c < nrColumns; ++c) {
            if (matrix[l][c] == 0) {
                matrix[l][c] = "";
            } 
        }
    }
}

function timer() {
    ++seconds;
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    let secs = seconds % 60;
    if (secs < 10) {
        secs = '0' + secs;
    } 
    if (mins < 10) {
        mins = "0" + mins;
    } 
    if (hrs < 10) {
        hrs = "0" + hrs;
    } 
    time_el.innerText = `${hrs}:${mins}:${secs}`; 
}

function startTimer() {
    if (interval) {
        return;
    }
    interval = setInterval(timer, 1000);
}

function stop() {
    clearInterval(interval);
    interval = null;
}

function play() {
  bombSound.play();
  numberSound.play();
  openSpaceSound.play();
  winSound.play();
}

function addAndRemoveFlags(line, column) { 
    document.getElementById("flags").innerText = "Flags: " + nrFlags + "🚩";
    revealedBoard[line][column].addEventListener("contextmenu", (e) => {//right click
        e.preventDefault();
        if (revealedBoard[line][column].value === 0 && nrFlags > 0 && revealedBoard[line][column].innerText !=  "🚩") {
            revealedBoard[line][column].innerText = "🚩";
            --nrFlags;
        } else if (revealedBoard[line][column].innerText === "🚩") {
            revealedBoard[line][column].innerText = "";
            ++nrFlags;
        }
        document.getElementById("flags").innerText = "Flags: " + nrFlags + "🚩";
    })
}

function clickedBoard(line, column) {
    revealedBoard[line][column].addEventListener("click", () => {//left click
        startTimer();
        if (revealedBoard[line][column].innerText === "🚩") {
            return;
        }
        if (matrix[line][column] === bomb) {
            findBombs();
            revealedAllBord ();
            gameStatus = -1;
        } else if (matrix[line][column] === "") {
            displayNeighborhood(line, column);
        } else if (matrix[line][column] > 0) {
            revealedNumber(line, column);
        }
        WinOrLose();
    })
}

function findBombs() {
    for (let l = 0; l < nrLines; ++l) {
        for (let c = 0; c < nrColumns; ++c) {
            if (matrix[l][c] === bomb) {
                revealedBoard[l][c].innerText = "💣";
                revealedBoard[l][c].style = "background-color: #8B0000";
            }
        }
    }
}

function revealedAllBord() {
    for (let l = 0; l <= nrLines; ++l) {
        for (let c = 0; c <= nrColumns; ++c) {
            if (l > -1 && l < nrLines && c > -1  && c < nrColumns && matrix[l][c] != bomb) {
                revealedBoard[l][c].innerText = matrix[l][c];
                revealedBoard[l][c].style = "background-color: #F0FFF0";
            }
        }
    }
}

function displayNeighborhood(line, column) {
    openSpaceSound.play();
    for (let l = line - 1; l <= line + 1; ++l) {
        for (let c = column - 1; c <= column + 1; ++c) {
            if (l > -1 && l < nrLines && c > -1 && c < nrColumns) {
                if (matrix[l][c] != bomb && revealedBoard[l][c].value === 0) {
                    revealedBoard[l][c].innerText = matrix[l][c];
                    revealedBoard[l][c].value = 1;
                    revealedBoard[l][c].style = "background-color:#F0FFF0";
                    ++counter;
                    if (matrix[l][c] == "") {
                        displayNeighborhood(l, c);
                    }
                }
            }
        }
    }
}

function revealedNumber(line , column) {
    numberSound.play();
    if (revealedBoard[line][column].value != 1) {
        ++counter;
    }
    revealedBoard[line][column].innerText = matrix[line][column];
    revealedBoard[line][column].value = 1;
    revealedBoard[line][column].style = "background-color:  #F0FFF0";
}

function WinOrLose() {
    button = document.createElement("button");
    button.id = "button";
    if (gameStatus === bomb) {
        bombSound.play();
        stop();
        button.innerHTML = "You lost! 😳 Press me to play another round. 😁";
        document.body.appendChild(button);
    } else if (counter === gameStatus) {
        winSound.play();
        stop();
        button.innerHTML = "You Win! 😏 Press me to play another round. 😁";
        document.body.appendChild(button);
    }
    button.onclick = function() {
        window.location.reload();
    }
}
