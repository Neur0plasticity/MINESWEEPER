class MineSweeper {
    onMark = this.dig; // default tool is dig()
    width = 15;
    height = 12;
    lim = this.width * this.height;
    constructor(){
      this.newGame()
    }
    newGame(){
      this.fullLoad();
    }
    resetGame(){
      this.minimalLoad();
    }
    fullLoad(){
      this.loadMainHTML();
      this.loadScoreBoard();
      this.loadMenu();
      this.loadGrid();
      this.layMines();
      this.layNumbers();
      // this.tokenizeGrid();
    }
    minimalLoad(){
      this.loadGrid();
      this.layMines();
      this.layNumbers();
      this.tokenizeGrid();
    }
    flag(){
      if      (this.grid.getN(id).flag === true)  this.assignValue(id,false);
      else if (this.grid.getN(id).flag === false) this.assignValue(id,true);
      else throw new Error(this.grid.getN(id));
    }
    dig(){
      if      (this.grid.getN(id).mine === true)  this.gameOver();
      else if (this.grid.getN(id).mine === false) this.grid.assignValue(id,{mine:false,flag:false,number:false,dug:true});
    }
    gameOver(){
      throw new Error("unfinished");
    }
    loadMainHTML(){
      document.getElementById('MineSweeper').innerHTML = `
        <h1>MineSweeper Exposed</h1>
        <div id="ScoreBoard"></div>
        <div id="Menu"></div>
        <div id="Grid"></div>
      `;
    }
    loadScoreBoard(){
      this.scoreBoard = new ScoreBoard({
        won:  0,
        lost: 0,
        flags:0
      });
    }
    loadMenu(){
      this.menu = new Menu({
        new:   {id:"new",  class:"_25pct",title:"new",  onClick:this.newGame},
        reset: {id:"reset",class:"_25pct",title:"reset",onClick:this.resetGame},
        flag:  {id:"flag", class:"_25pct",title:"flag", onClick:function(){this.onMark = this.flag}},
        dig:   {id:"dig",  class:"_25pct",title:"dig",  onClick:function(){this.onMark = this.dig}}
      });
    }
    loadGrid(){
      this.grid = new Grid({
        width:  15,
        height: 12,
        onClick: this.onMark
      });
    }
    layMines(){
      let nMines = Math.round(this.lim / 6);
      let b;
      let cnt = 1;
      while (nMines !== 0) {
        if (cnt >= this.lim) cnt = 0;
        b = Boolean(Math.round(Math.random()*2));
        if (!b) this.grid.assignValue(cnt,0),nMines--;
        cnt++;
      }
    }
    layNumbers(){
      let mines;
      let c;
      for (let i = 1; i <= this.lim; i++) {
        c = this.grid.getN(i);
        mines = 0;
        if (c === 0) {
          continue;
        } else {
          /*top left*/      mines += (0 === this.grid.getN((i-this.width)-1));
          /*top center*/    mines += (0 === this.grid.getN((i-this.width)));
          /*top right*/     mines += (0 === this.grid.getN((i-this.width)+1));
          /*center left*/   mines += (0 === this.grid.getN(i-1));
          /*center*/        mines += (0 === this.grid.getN(i));  
          /*center right*/  mines += (0 === this.grid.getN(i+1));
          /*bottom left*/   mines += (0 === this.grid.getN((i+this.width)-1));
          /*bottom center*/ mines += (0 === this.grid.getN(i+this.width));
          /*bottom right*/  mines += (0 === this.grid.getN((i+this.width)+1));
        }
        this.grid.assignValue(i,mines);
      }
    }
    tokenizeGrid(){
      /*
        this tokenizer reduces the extra logic that would have been needed to code other functions
      */
      let k;
      let v;
      for (k = 1; k <= this.lim;k++) {
        v = this.grid.getN(k);
        if      (v === null)  this.grid.assignValue(k,{mine:false,number:false,flag:false,dug:false});
        else if (v === 0)     this.grid.assignValue(k,{mine:true, number:false,flag:false,dug:false});
        else if (v > 0)       this.grid.assignValue(k,{mine:false,number:v,    flag:false,dug:false});
        else throw new Error(v);
      }
    }
    
  }
  class ScoreBoard {
    scores = {};
    constructor(scores){
      for (let k in scores) {
        this.scores[k] = scores[k];
      }
      let html = '';
      for (let k in this.scores) {
        html += `<div><label for="${k}P">${k}</label>
      <progress id="${k}P" style="width:285px" value="${this.scores[k]}" max="100"></progress></div>`;
      }
      document.getElementById('ScoreBoard').innerHTML = html;
    }
  };
  class Menu {
    buttons = {};
    constructor(buttons){
      this.gen(buttons);
      this.render();
    }
    gen(buttons){
      for (let k in buttons) {
        this.buttons[k] = buttons[k];
      }
    }
    render(){
      let sb = document.getElementById('ScoreBoard');
      for (let k in this.buttons) {
        sb.innerHTML += `<button id="${this.buttons[k].id}" 
                                  class="${this.buttons[k].class}" 
                                  onclick="${this.buttons[k].onClick}">
                                    ${this.buttons[k].title}
                        </button>`;
      }
    }
  };
  class Grid {
    items = {};
    // null = no value
    constructor(obj){
      this.width     = (obj.width > 0)?obj.width:1;
      this.height    = (obj.height > 0)?obj.height:1;
      this.gen();
      this.render();
    }
    gen(){
      let lim = this.width * this.height;
      for (let k = 1; k <= lim;k++) {
        this.items['_'+k] = null;
      }
    }
    render(){
      let html = ``;
      for (let k in this.items) { 
        html += `<div id="${k}" class="box"></div>`;
      }
      document.getElementById('Grid').innerHTML = html;
    }
    assignValue(n,v){
      console.log('n',n);
      this.items['_'+n] = v;
      document.getElementById('_'+n).innerText = v;
    }
    getN(n){
      return this.items['_'+n];
    }
  };
  
const ms = new MineSweeper();