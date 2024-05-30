// x o x
// x x 0
// o x o

let field = [["x","o","x"], ["x", "x", "o"], ["o", "x", "o"]];

const dialog = document.querySelector("dialog");
const showButton = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
  dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
  dialog.close();
});

function Field(symbol){
    this.playerScore = 0;
    this.computerScore = 0;
    this.player = symbol;
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

    this.checkGame = function(){
        let results = getAllRows(this.field);
        let win = results.filter((em)=> em=="xxx" || em=="ooo");
        if (win.length == 0){
            return "Draw";
        } else if(win[0] == "xxx"){
            return "x won";
        }
        else{
            return "o won"
        }
    };

    this.update = function(symbol, i, j){
        this.field[i][j] = symbol.toLowerCase();
    };

    this.showField = ()=>{
        for (let row of this.field){
            for (let elem of row){
                process.stdout.write(elem);
            }
            console.log();
        }
    }

}

let c = new Field("x");
for (let i=0; i<3;i++){
    for (let j=0; j<3;j++){
        c.update(field[i][j], i, j);
    }
}

