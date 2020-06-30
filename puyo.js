const puyo = document.querySelector('#puyo')
let puyoData = [];

// puyo table 생성
function init() {
  [...Array(13).keys()].forEach(()=> {
    const tr = document.createElement('tr');
    [...Array(6).keys()].forEach(()=> {
      const td = document.createElement('td');
      tr.appendChild(td);
    });
    puyo.appendChild(tr);
  });
  gamestart();
}

// 게임 시작
function gamestart() {
  generatePuyo();
}

function generatePuyo() {
  
}

init();