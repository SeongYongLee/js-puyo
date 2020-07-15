const puyo = document.querySelector('#puyo');
const colorData = [];
const blockData = [];
const puyoColor = ['red', 'blue', 'green', 'yellow', 'purple']; // [0 = red, 1 = blue, 2 = green, 3 = yellow, 4 = purple]
const selectColor = []; // 난이도에 의해 선택된 뿌요 색깔
let difficulty = 4; // TODO 난이도 설정
let currentPuyo = { // 현재 움직이는 뿌요
  rotate: 0, // 뿌요 중심 위치 [0 = 아래, 1 = 왼쪽, 2 = 위, 3 = 오른쪽]
  puyo: [ // 각 뿌요의 색깔, tr, td
    ['',0,0],
    ['',0,0]
  ]
}  


function init() { // 게임 실행 INIT
  [...Array(13).keys()].forEach(()=> {
    const tr = document.createElement('tr');
    [...Array(6).keys()].forEach(()=> {
      const td = document.createElement('td');
      tr.appendChild(td);
    });
    colorData.push(Array(6).fill('white'));
    blockData.push(Array(6).fill('blank'));
    puyo.appendChild(tr);
  });
  gamestart();
}

function gamestart() { // 새로운 게임
  const tempColor = puyoColor.slice();
  selectColor.length = 0;
  while (selectColor.length < difficulty) { // 난이도에 따른 뿌요의 색깔을 정합니다.
    selectColor.push(tempColor.splice(Math.floor(Math.random() * tempColor.length), 1)[0]);
  }
  puyoGenerate();
}

function puyoGenerate() { // 뿌요 생성
  if (colorData[0][2] === 'white') {
    const puyo = [
      selectColor.slice().splice(Math.floor(Math.random() * selectColor.length), 1)[0],
      selectColor.slice().splice(Math.floor(Math.random() * selectColor.length), 1)[0]
    ];
    colorData[0][2] = puyo[1];
    colorData[1][2] = puyo[0];
    currentPuyo = {
      rotate: 0,
      puyo: [
        [puyo[0],1,2],
        [puyo[1],0,2]
      ]
    }
  } else {
    gameover();
  }
  puyoDraw();
}

function gameover() {
  alert('GAME OVER');
}

// 뿌요 그리기
function puyoDraw() { 
  console.table(colorData);
  colorData.forEach((tr, i) => {
    tr.forEach((td, j) => {
      puyo.children[i].children[j].className = td !== 0 ? td : '';
    });
  });
}

// 뿌요 회전
function puyoRotateInit(rotate) { 
  currentPuyo.rotate = rotate === 'right' ? (currentPuyo.rotate + 1) % 4 : (currentPuyo.rotate + (4 - 1)) % 4;
  switch (currentPuyo.rotate) {
    case 0 :
      puyoRotate(currentPuyo.puyo[0][1]-1, currentPuyo.puyo[0][2]);
      break;
    case 1 :
      puyoRotate(currentPuyo.puyo[0][1], currentPuyo.puyo[0][2]+1);
      break;
    case 2 :
      puyoRotate(currentPuyo.puyo[0][1]+1, currentPuyo.puyo[0][2]);
      break;
    case 3 :
      puyoRotate(currentPuyo.puyo[0][1], currentPuyo.puyo[0][2]-1);
      break;
  }
}
function puyoRotate(tr,td) {
  if (blockData[tr][td] && blockData[tr][td] === 'blank') {
    colorData[tr][td] = colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]]
    colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = 'white';
    currentPuyo.puyo[1] = [currentPuyo.puyo[1][0], tr, td];
    puyoDraw();
  }
}

init();

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyZ':
      puyoRotateInit('left');
      break;
    case 'KeyX':
      puyoRotateInit('right');
      break;
    case 'ArrowLeft':
      if(blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]-1] && blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]-1] === 'blank'
      && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]-1] && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]-1] === 'blank' ) {
        colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]--] = 'white';
        colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]--] = 'white';
        colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]] = currentPuyo.puyo[0][0];
        colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = currentPuyo.puyo[1][0];
        puyoDraw();
      }
      break;
    case 'ArrowRight':
      if(blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]+1] && blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]+1] === 'blank'
      && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]+1] && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]+1] === 'blank' ) {
        colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]++] = 'white';
        colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]++] = 'white';
        colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]] = currentPuyo.puyo[0][0];
        colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = currentPuyo.puyo[1][0];
        puyoDraw();
      }
      break;
    case 'ArrowDown':
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowUp':
    case 'Space':
      break;
  }
});