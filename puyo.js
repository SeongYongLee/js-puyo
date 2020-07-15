const puyo = document.querySelector('#puyo');
const colorData = [];
const blockData = [];
const puyoColor = ['red', 'blue', 'green', 'yellow', 'purple']; // [0 = red, 1 = blue, 2 = green, 3 = yellow, 4 = purple]
const selectColor = []; // 난이도에 의해 선택된 뿌요 색깔
let difficulty = 4; // TODO 난이도 설정
let currentPuyo = { // 현재 움직이는 뿌요
  rotate: 0, // 뿌요 중심 위치 [0 = 아래, 1 = 왼쪽, 2 = 위, 3 = 오른쪽]
  doubleRotate: 0, // 이중 회전 스위치
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
      doubleRotate: 0,
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
  const tempRotate = rotate === 'right' ? (currentPuyo.rotate + 1) % 4 : (currentPuyo.rotate + (4 - 1)) % 4;
  const tr = currentPuyo.puyo[0][1]; // 코드 가독성을 위해
  const td = currentPuyo.puyo[0][2];
  switch (tempRotate) { // 뿌요 중심 위치 [0 = 아래, 1 = 왼쪽, 2 = 위, 3 = 오른쪽]
    case 0 :
      currentPuyo.rotate = tempRotate;
      currentPuyo.doubleRotate = 0;
      puyoMove([tr, td],[tr - 1, td])
      break;
    case 1 :
      if (blockData[tr][td + 1] && blockData[tr][td + 1] === 'blank') {
        currentPuyo.rotate = tempRotate;
        currentPuyo.doubleRotate = 0;
        puyoMove([tr, td],[tr, td + 1])
      } else if (blockData[tr][td - 1] && blockData[tr][td - 1] === 'blank'){
        currentPuyo.rotate = tempRotate;
        currentPuyo.doubleRotate = 0;
        puyoMove([tr, td - 1],[tr, td])
      } else if (currentPuyo.doubleRotate === rotate){
        currentPuyo.rotate = rotate === 'right' ? (tempRotate + 1) % 4 : (tempRotate + (4 - 1)) % 4;
        currentPuyo.doubleRotate = 0;
        if (blockData[tr + 1] && blockData[tr + 1][td] && blockData[tr + 1][td] === 'blank') {
          puyoMove([tr, td],[tr + 1, td])
        } else {
          puyoMove([tr - 1, td],[tr, td])
        }
      } else {
        currentPuyo.doubleRotate = rotate;
      }
      break;
    case 2 :
      currentPuyo.rotate = tempRotate;
      currentPuyo.doubleRotate = 0;
      if (blockData[tr + 1] && blockData[tr + 1][td] && blockData[tr + 1][td] === 'blank') {
        puyoMove([tr, td],[tr + 1, td])
      } else {
        puyoMove([tr - 1, td],[tr, td])
      }
      break;
    case 3 :
      if (blockData[tr][td - 1] && blockData[tr][td - 1] === 'blank') {
        currentPuyo.rotate = tempRotate;
        currentPuyo.doubleRotate = 0;
        puyoMove([tr, td],[tr, td - 1])
      } else if (blockData[tr][td + 1] && blockData[tr][td + 1] === 'blank'){
        currentPuyo.rotate = tempRotate;
        currentPuyo.doubleRotate = 0;
        puyoMove([tr, td + 1],[tr, td])
      } else if (currentPuyo.doubleRotate === rotate){
        currentPuyo.rotate = rotate === 'right' ? (tempRotate + 1) % 4 : (tempRotate + (4 - 1)) % 4;
        currentPuyo.doubleRotate = 0;
        if (blockData[tr + 1] && blockData[tr + 1][td] && blockData[tr + 1][td] === 'blank') {
          puyoMove([tr, td],[tr + 1, td])
        } else {
          puyoMove([tr - 1, td],[tr, td])
        }
      } else {
        currentPuyo.doubleRotate = rotate;
      }
      break;
  }
}

// 뿌요 이동
function puyoMove(puyo0, puyo1) {
  colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]] = 'white';
  colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = 'white';
  currentPuyo.puyo[0][1] = puyo0[0];
  currentPuyo.puyo[0][2] = puyo0[1];
  currentPuyo.puyo[1][1] = puyo1[0];
  currentPuyo.puyo[1][2] = puyo1[1];
  colorData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]] = currentPuyo.puyo[0][0];
  colorData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = currentPuyo.puyo[1][0];
  puyoDraw();
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
      if(blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2] - 1] && blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2] - 1] === 'blank'
      && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2] - 1] && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2] - 1] === 'blank' ) {
        puyoMove([currentPuyo.puyo[0][1], currentPuyo.puyo[0][2] - 1],[currentPuyo.puyo[1][1], currentPuyo.puyo[1][2] - 1]);
      }
      break;
    case 'ArrowRight':
      if(blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2] + 1] && blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2] + 1] === 'blank'
      && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2] + 1] && blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2] + 1] === 'blank' ) {
        puyoMove([currentPuyo.puyo[0][1], currentPuyo.puyo[0][2] + 1],[currentPuyo.puyo[1][1], currentPuyo.puyo[1][2] + 1]);
      }
      break;
    case 'ArrowDown':
      if(blockData[currentPuyo.puyo[0][1] + 1] && blockData[currentPuyo.puyo[1][1] + 1]
      && blockData[currentPuyo.puyo[0][1] + 1][currentPuyo.puyo[0][2]] && blockData[currentPuyo.puyo[0][1] + 1][currentPuyo.puyo[0][2]] === 'blank'
      && blockData[currentPuyo.puyo[1][1] + 1][currentPuyo.puyo[1][2]] && blockData[currentPuyo.puyo[1][1] + 1][currentPuyo.puyo[1][2]] === 'blank' ) {
        puyoMove([currentPuyo.puyo[0][1] + 1, currentPuyo.puyo[0][2]],[currentPuyo.puyo[1][1] + 1, currentPuyo.puyo[1][2]]);
      }
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowUp':
    case 'Space':
      let x = 1;
      while (blockData[currentPuyo.puyo[0][1] + x] && blockData[currentPuyo.puyo[1][1] + x]
      && blockData[currentPuyo.puyo[0][1] + x][currentPuyo.puyo[0][2]] && blockData[currentPuyo.puyo[0][1] + x][currentPuyo.puyo[0][2]] === 'blank'
      && blockData[currentPuyo.puyo[1][1] + x][currentPuyo.puyo[1][2]] && blockData[currentPuyo.puyo[1][1] + x][currentPuyo.puyo[1][2]] === 'blank') x++;
      puyoMove([currentPuyo.puyo[0][1] + x - 1, currentPuyo.puyo[0][2]], [currentPuyo.puyo[1][1] + x - 1, currentPuyo.puyo[1][2]])
      break;
  }
});