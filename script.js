// x o x
// x x 0
// o x o

let field = [["x","o","x"], ["x", "x", "o"], ["o", "x", "o"]];

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");
const choice = document.body.getElementsByClassName("choice")[0];
const game = document.body.getElementsByClassName("game")[0];
const sectors = document.querySelectorAll(".field .symbol");
const result = document.querySelector(".game .result");
const resetButton = document.querySelector("#reset");
const spanScore = {"X":document.querySelector("#XScore"),"O":document.querySelector("#OScore")};

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
  choice.style.display = "block";
  game.style.display = "none";
  dialog.style.cssText = "background: white";
  for (let sector of sectors){
    sector.innerHTML = "";
  }
  spanScore["X"].innerText = 0;
  spanScore["O"].innerText = 0;
});

function Field(){
    this.field = [["","",""],["","",""],["","",""]];
    this.getAllRows = function(){
        let result = [];
        let diagonal = "";
        let reverseDiagonal = "";
        
        for (let i=0; i<3; i++){
            let row = this.field[i].join('');
            result.push(row);
            
            let column = "";
            for (let j=0; j<3;j++){
                column+=this.field[j][i];
            }
    
            result.push(column);
            diagonal += this.field[i][i];
            reverseDiagonal += this.field[i][2-i];
            
        }
    
        result.push(diagonal);
        result.push(reverseDiagonal);
        return result;
    };

    this.getWinner = function(){
        let results = this.getAllRows(this.field);
        let win = results.filter((em)=> em=="xxx" || em=="ooo");
        if (win.length == 0){
            return "tie";
        } else if(win[0] == "xxx"){
            return "X";
            
        }
        else{
            return "O"
        }
    };


    this.update = function(symbol, i, j){
        this.field[i][j] = symbol;
        let id = i*3+j;
        sectors[id].innerHTML = symbol.toUpperCase();
    };

    this.showField = ()=>{
        let output = "";
        for (let row of this.field){
            for (let elem of row){
                if (elem!=""){
                    output +=elem;
                } else{output+='-'};
            }
            output+="\n";
        }
        return output;
    }

    this.getAvailable = function(){
        let result = [];
        for (let i=0; i<3;i++){
            for (let j=0;j<3;j++){
                if (this.field[i][j] ===""){
                    result.push([i,j]);
                }
            }
        }

        return result;
    }
    this.getElement = (i,j)=>this.field[i][j];
    this.isAvailable = (i,j)=>this.field[i][j]==="";
}

function Game(symbol){
    this.playerSymbol = symbol.toLowerCase();
    this.computerSymbol = this.playerSymbol == "x" ? "o" : "x";
    this.field = new Field();
    this.firstMove = this.playerSymbol != "o"; 

    this.computerMove = function(){
        let availableChoices = this.field.getAvailable();
        for (let i=0; i<3; i++){
            for(let j=0; j<3;j++){
                if (!this.field.isAvailable(i,j)){
                    continue;
                }
                let currentEl = this.field.getElement(i,j);
                this.field.update(this.computerSymbol, i,j);
                if (this.gameOver()){
                    this.firstMove = true;
                    return;
                }else{
                    this.field.update(currentEl, i,j);
                }
            }
        }
        for (let i=0; i<3; i++){
            for(let j=0; j<3;j++){
                if (!this.field.isAvailable(i,j)){
                    continue;
                }
                let currentEl = this.field.getElement(i,j);
                this.field.update(this.playerSymbol, i,j);
                if (this.gameOver()){
                    this.field.update(this.computerSymbol, i,j);
                    this.firstMove = true;
                    return;
                }else{
                    this.field.update(currentEl, i,j);
                }
            }
        }
        
        let move = availableChoices[Math.floor(Math.random() * availableChoices.length)];
        this.field.update(this.computerSymbol, move[0],move[1]);
        this.firstMove = true;
    }
    
    this.humanMove = function(i, j){
        this.field.update(this.playerSymbol, i, j);        
    }

    this.gameOver = function(){
        let winner = this.field.getWinner();
        if (this.field.getAvailable()== undefined || this.field.getAvailable().length==0 || winner !="tie"){
            return true;
        } else{
            return false;
            
        }
                
        
    }

    this.reset = function(){
        for (let i=0;i<3;i++){
            for (let j=0; j<3; j++){
                this.field.update("",i,j);
            }
        }
    };
    
}

    


function getInt(arr){
    let new_arr = [];
    for (let elem of arr){
        new_arr.push(+elem);
    }
    return new_arr;
}

function startGame(symbol){
    choice.style.cssText= "display: none";
    dialog.style.cssText = `background: rgb(167,54,164);
    background: linear-gradient(0deg, rgba(167,54,164,1) 0%, rgba(173,30,197,1) 48%, rgba(206,24,174,1) 61%, rgba(30,4,232,1) 100%);`
    game.style.cssText += "display: flex";
    let info = document.querySelector(".info #symbol");
    info.innerHTML = symbol;
    info.style.cssText = "color: white";   

    let new_game = new Game(symbol.toLowerCase());
    if (!new_game.firstMove){
        new_game.computerMove();
    }

    for (let sector of sectors){
        let [i,j] = getInt(sector.id);
        sector.addEventListener("mouseover", function(){            
            if (new_game.field.isAvailable(i,j) && !new_game.gameOver()){
                sector.innerHTML = symbol;
            }
        });

        sector.addEventListener("mouseout",function(){
            sector.innerHTML = new_game.field.getElement(i,j).toUpperCase();
        });

        sector.addEventListener("click",function(){
            if (new_game.field.isAvailable(i,j) && !new_game.gameOver()){
                new_game.humanMove(i,j);
                if (!new_game.gameOver()){
                    new_game.computerMove();
                } 
                
                if (new_game.gameOver()){
                    let currentWinner = new_game.field.getWinner();
                    if (currentWinner == "tie"){
                        result.innerHTML = "It's a ";
                    }else{
                        result.innerHTML = 'The winner is '
                        spanScore[currentWinner].innerText ++;
                    }
                    result.innerHTML +=`<span id='winner'>${currentWinner}</span>!`;
                    document.getElementById("winner").style.cssText='font-family: "poetsen";color: white;display:inline-block';
                }
                
            }
            console.log(new_game.field.showField());
            
        });

        resetButton.addEventListener("click", function(){
            new_game.reset();
            new_game.firstMove = new_game.playerSymbol != "o"; 
            result.innerHTML = "";
            if (!new_game.firstMove){
                new_game.computerMove();
            }
        });
    }
}
