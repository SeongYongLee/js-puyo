const puyo = document.querySelector('#puyo');
const puyoColor = ['red', 'blue', 'green', 'yellow', 'purple']; // [0 = red, 1 = blue, 2 = green, 3 = yellow, 4 = purple]
const selectColor = []; // 난이도에 의해 선택된 뿌요 색깔
const colorData = [];
const blockData = [];
let gameStatus = true; // false = 게임 오버
let puyoStatus = true; // true = 뿌요 움직일수 있음
let difficulty = 4; // TODO 난이도 설정
let currentPuyo = { // 현재 움직이는 뿌요
  rotate: 0, // 뿌요 중심 위치 [0 = 아래, 1 = 왼쪽, 2 = 위, 3 = 오른쪽]
  doubleRotate: 0, // 이중 회전 스위치
  puyo: [ // 각 뿌요의 색깔, tr, td
    ['',0,0],
    ['',0,0]
  ]
}  

function init() { // 게임 준비
  [...Array(16).keys()].forEach(() => {
    const tr = document.createElement('tr');
    [...Array(6).keys()].forEach(() => {
      const td = document.createElement('td');
      tr.appendChild(td);
    });
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
  colorData.length = 0;
  blockData.length = 0;
  [...Array(16).keys()].forEach(() => {
    colorData.push(Array(6).fill('white'));
    blockData.push(Array(6).fill('blank'));
  });
  puyoGenerate();
}

function puyoDraw() { // 뿌요 그리기
  colorData.forEach((tr, i) => {
    tr.forEach((td, j) => {
      puyo.children[i].children[j].className = td !== 0 ? td : '';
    });
  });
}

function puyoDrop() { // 뿌요 블럭화
  puyoStatus = false;
  blockData[currentPuyo.puyo[0][1]][currentPuyo.puyo[0][2]] = 'block';
  blockData[currentPuyo.puyo[1][1]][currentPuyo.puyo[1][2]] = 'block';
  puyoDown([0, 1, 2, 3, 4, 5]);
}

function puyoDown(down) { // 빈 공간 뿌요 떨어짐
  const isDownSet = new Set(); // Set 활용하여 알고리즘 개선
  down.forEach(td => {
    let isBlank = false;
    for (let tr = blockData.length - 1; tr >= 0; tr--) {
      if(!isBlank && blockData[tr][td] === 'blank') isBlank = true;
      if(isBlank && blockData[tr][td] === 'block') {
        isDownSet.add(td);
        blockData[tr + 1][td] = 'block';
        blockData[tr][td] = 'blank';
        colorData[tr + 1][td] = colorData[tr][td];
        colorData[tr][td] = 'white';
      }
    }
  })
  puyoDraw();
  if (isDownSet) down = [...isDownSet];
  if (down.length) setTimeout(() => puyoDown(down), 100);
  else puyoDelete();
}

function puyoDelete() { // 뿌요 삭제 알고리즘 v1
  let isDelete = false;
  let deleteGroup = [];
  const deleteData = [];
  [...Array(16).keys()].forEach(() => {
    deleteData.push(Array(6).fill(null));
  });

  for (let i = colorData.length - 1; i >= 0; i--) {
    blockData[i].forEach((td, j) => {
      if (td === 'block') {
        if (blockData[i + 1] && blockData[i + 1][j] === 'block' && colorData[i][j] === colorData[i + 1][j]) { // 색 비교 (열)
          if (deleteData[i + 1][j] !== null) {
            // console.log(3)
            if (deleteData[i][j] === null) {
              deleteData[i][j] = deleteData[i + 1][j];
              deleteGroup[deleteData[i][j]].push([i, j]);
            } else if (deleteData[i + 1][j] !== deleteData[i][j]) {
              deleteGroup[deleteGroup.length - 1].forEach(x => {
                deleteData[x[0]][x[1]] = deleteData[i + 1][j];
                deleteGroup[deleteData[i + 1][j]].push([x[0], x[1]]);
              })
              deleteGroup.pop();
            }
          } else {
            // console.log(4)
            if (deleteData[i][j] !== null) {
              deleteData[i + 1][j] = deleteData[i][j];
              deleteGroup[deleteData[i + 1][j]].push([i + 1, j]);
            } else {
              deleteData[i][j] = deleteGroup.length;
              deleteData[i + 1][j] = deleteGroup.length;
              deleteGroup.push([[i, j], [i + 1, j]]);
            }
          }
        } 
        if (blockData[i][j + 1] === 'block' && colorData[i][j] === colorData[i][j + 1]) { // 색 비교 (행)
          if (deleteData[i][j] !== null) {
            // console.log(1)
            deleteData[i][j + 1] = deleteData[i][j];
            deleteGroup[deleteData[i][j]].push([i, j + 1])
          } else {
            // console.log(2)
            deleteData[i][j] = deleteGroup.length;
            deleteData[i][j + 1] = deleteGroup.length;
            deleteGroup.push([[i, j], [i, j + 1]]);
          }
        } 
      }
    });
  }
  deleteGroup.forEach(x => {
    if (x.length >= 4) {
      x.forEach(y => {
        colorData[y[0]][y[1]] = 'white';
        blockData[y[0]][y[1]] = 'blank';
      })
      isDelete = true;
    }
  })
  // console.table(blockData)
  // console.table(colorData)
  // console.table(deleteData)
  // console.log(deleteGroup)
  // console.log('----------------------------------')

  if (isDelete) puyoDown([0, 1, 2, 3, 4, 5]);
  else puyoGenerate();
}

function puyoGenerate() { // 뿌요 생성
  // console.table(blockData)
  if (blockData[4][2] === 'blank') {
    const puyo = [
      selectColor.slice().splice(Math.floor(Math.random() * selectColor.length), 1)[0],
      selectColor.slice().splice(Math.floor(Math.random() * selectColor.length), 1)[0]
    ];
    colorData[4][2] = puyo[0];
    colorData[3][2] = puyo[1];
    currentPuyo = {
      rotate: 0,
      doubleRotate: 0,
      puyo: [
        [puyo[0],4,2],
        [puyo[1],3,2]
      ]
    }
  } else {
    gameover();
  }
  puyoDraw();
  puyoStatus = true;
}

function gameover() {
  gameStatus = false;
  alert('GAME OVER');
}

function puyoRotateInit(rotate) { // 뿌요 회전
  const tempRotate = rotate === 'right' ? (currentPuyo.rotate + 1) % 4 : (currentPuyo.rotate + (4 - 1)) % 4;
  const tr = currentPuyo.puyo[0][1]; // 코드 가독성 위해 상수 선언
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
        currentPuyo.rotate = currentPuyo.rotate === 0 ? 2 : 0;
        currentPuyo.doubleRotate = 0;
        rotate === 'right' 
        ? blockData[tr + 1] && blockData[tr + 1][td] === 'blank' ? puyoMove([tr, td],[tr + 1, td]): puyoMove([tr - 1, td],[tr, td])
        : puyoMove([tr, td],[tr - 1, td]);
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
        currentPuyo.rotate = currentPuyo.rotate === 0 ? 2 : 0;
        currentPuyo.doubleRotate = 0;
        rotate === 'right' 
        ? puyoMove([tr, td],[tr - 1, td])
        : blockData[tr + 1] && blockData[tr + 1][td] === 'blank' ? puyoMove([tr, td],[tr + 1, td]): puyoMove([tr - 1, td],[tr, td]);
      } else {
        currentPuyo.doubleRotate = rotate;
      }
      break;
  }
}

function puyoMove(puyo0, puyo1) { // 뿌요 이동
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

window.addEventListener('keydown', e => {
  if (puyoStatus && gameStatus) {
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
        if(blockData[currentPuyo.puyo[0][1] + 1] && blockData[currentPuyo.puyo[0][1] + 1][currentPuyo.puyo[0][2]] === 'blank'
        && blockData[currentPuyo.puyo[1][1] + 1] && blockData[currentPuyo.puyo[1][1] + 1][currentPuyo.puyo[1][2]] === 'blank') {
          puyoMove([currentPuyo.puyo[0][1] + 1, currentPuyo.puyo[0][2]],[currentPuyo.puyo[1][1] + 1, currentPuyo.puyo[1][2]]);
        } else {
          puyoDrop();
        }
        break;
    }
  }
});

window.addEventListener('keyup', e => {
  if (puyoStatus && gameStatus) {
    switch (e.code) {
      case 'ArrowUp':
      case 'Space':
        let x = 1;
        while (blockData[currentPuyo.puyo[0][1] + x] && blockData[currentPuyo.puyo[0][1] + x][currentPuyo.puyo[0][2]] === 'blank'
        && blockData[currentPuyo.puyo[1][1] + x] && blockData[currentPuyo.puyo[1][1] + x][currentPuyo.puyo[1][2]] === 'blank') x++;
        puyoMove([currentPuyo.puyo[0][1] + x - 1, currentPuyo.puyo[0][2]], [currentPuyo.puyo[1][1] + x - 1, currentPuyo.puyo[1][2]]);
        puyoDrop();
        break;
    }
  }
});