const puyo = document.querySelector('#puyo');
let puyoData = [];
const puyoColor = ['red','blue','green','yellow','purple',]; //[0 = red, 1 = blue, 2 = green, 3 = yellow, 4 = purple, ]
let difficulty = 4; // TODO 난이도 설정
let selectColor = [];

function init() { // 게임 실행 INIT
  [...Array(13).keys()].forEach(()=> {
    const tr = document.createElement('tr');
    [...Array(6).keys()].forEach(()=> {
      const td = document.createElement('td');
      tr.appendChild(td);
    });
    puyoData.push(Array(6).fill(0));
    puyo.appendChild(tr);
  });
  gamestart();
}

function gamestart() { // 새로운 게임
  selectColor = [];
  while (selectColor.length < difficulty) { // 난이도에 따른 뿌요의 색깔을 정합니다.
    selectColor.push(puyoColor.splice(Math.floor(Math.random()*puyoColor.length),1)[0]);
  }
  generatePuyo();
}

function generatePuyo() { // 뿌요 생성
  let puyo = [selectColor.splice(Math.floor(Math.random()*selectColor.length),1)[0],
  selectColor.splice(Math.floor(Math.random()*selectColor.length),1)[0]];
  if (!puyoData[0][2]) {
    puyoData[0][2] = puyo[0];
    puyoData[1][2] = puyo[1];
  } else {
    gameover();
  }
  drawPuyo();
}

function drawPuyo() { // 뿌요 그리기
  console.table(puyoData)
  puyoData.forEach((tr, i) => {
    tr.forEach((td, j) => {
      if (td != 0) puyo.children[i].children[j].className = td;
      else puyo.children[i].children[j].className = '';
    });
  });
}

init();