const puyo = document.querySelector('#puyo');
let puyoData = [];
const puyoColor = ['red', 'blue', 'green', 'yellow', 'purple']; // [0 = red, 1 = blue, 2 = green, 3 = yellow, 4 = purple]
let difficulty = 4; // TODO 난이도 설정
let selectColor = []; // 난이도에 의해 선택된 뿌요 색깔
let currentPuyo = { // 현재 움직이는 뿌요
  rotate: 0, // 뿌요 중심 위치 [0 = 아래, 1 = 왼쪽, 2 = 위, 3 = 오른쪽]
  tr: 1,
  td: 2,
}  


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
    selectColor.push(puyoColor.splice(Math.floor(Math.random() * puyoColor.length), 1)[0]);
  }
  puyoGenerate();
}

function puyoGenerate() { // 뿌요 생성
  if (!puyoData[0][2]) {
    const puyo = [selectColor.splice(Math.floor(Math.random() * selectColor.length), 1)[0],
    selectColor.splice(Math.floor(Math.random() * selectColor.length), 1)[0]];
    puyoData[0][2] = puyo[0];
    puyoData[1][2] = puyo[1];
    currentPuyo = {
      rotate: 0,
      tr: 1,
      td: 2
    }
  } else {
    gameover();
  }
  puyoDraw();
}

function gameover() {
  alert('GAME OVER');
}

function puyoDraw() { // 뿌요 그리기
  console.table(puyoData);
  puyoData.forEach((tr, i) => {
    tr.forEach((td, j) => {
      td != 0 
      ? puyo.children[i].children[j].className = td
      : puyo.children[i].children[j].className = '';
    });
  });
}

function puyoRotate(rotate) { // 뿌요 회전
  rotate === 'right' 
  ? currentPuyo.rotate = (currentPuyo.rotate + 1) % 4
  : currentPuyo.rotate = (currentPuyo.rotate + (4 - 1)) % 4;

  console.log(currentPuyo.rotate)

  switch (currentPuyo.rotate) {
    case 0: {
      break;
    }
    case 1: {
      break;
    }
    case 2: {
      break;
    }
    case 3: {
      break;
    }
  }
}

init();

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyZ': { 
      puyoRotate('left');
      break;
    }
    case 'KeyX': { 
      puyoRotate('right');
      break;
    }
    case 'ArrowLeft': {
      break;
    }
    case 'ArrowRight': { 
      break;
    }
    case 'ArrowDown': { 
      break;
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowUp':
    case 'Space': {
      break;
    }
  }
});