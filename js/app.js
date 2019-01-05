const fragment = document.createDocumentFragment();
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const matched = document.getElementsByClassName('match');
const stars = document.getElementsByClassName('fa-star');
const timer = document.querySelector('.timer');
let openCardArray = [];
let judgeCardArray = [];
let count = 0;
let removeStarCount = 0;
let second = 0;


/*
 * 创建一个包含所有卡片的数组
 */

const cards = [
  'fa-diamond', 'fa-diamond',
  'fa-paper-plane-o', 'fa-paper-plane-o',
  'fa-anchor', 'fa-anchor',
  'fa-bolt', 'fa-bolt',
  'fa-cube', 'fa-cube',
  'fa-leaf', 'fa-leaf',
  'fa-bicycle', 'fa-bicycle',
  'fa-bomb', 'fa-bomb'
  ];

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 'shuffle' 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 创建卡片
function createCard() {
  const newCardList = shuffle(cards);

  // 循环遍历创建 li、i 元素，并添加类名
  for (let i = 0; i < newCardList.length; i++) {
    const createLi = document.createElement('li');
    createLi.classList.add('card');
    const createI = document.createElement('i');
    createI.classList.add('fa', newCardList[i]);

    // 将 i 添加为 li 的子元素
    createLi.appendChild(createI);
    fragment.appendChild(createLi);
  }
  // 添加到文档片段
  deck.appendChild(fragment);
}

// 洗牌函数来自于 http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 对卡片点击做出响应
function respondToTheClick() {
  this.classList.add('open', 'show');
  // 防止再次点击
  this.style.pointerEvents = 'none';
  openCardArray.push(this);
  judgeCardArray.push(this.firstChild.getAttribute('class'));
  judgeMatch();
}

// 计时器
let interval;
function startTimer() {
  interval = setInterval(function() {
    second ++;
    timer.textContent = second;
  }, 1000);
}

// 停止（清除）计时
function stopTimer() {
  clearInterval(interval);
}

// 匹配判断，如果数组中已有另一张卡，请检查两张卡片是否匹配
function judgeMatch() {
  if (openCardArray.length === 2) {
    // 计算 move 次数
    movesCount();
    /*
     * 判断卡片是否相等
     * 若相等，进一步判断是否结束
     */
    if (judgeCardArray[0] === judgeCardArray[1]) {
      match();
      finish();
    } else {
      mismatch();
    }
    judgeCardArray = [];
  }
}

// 如果卡片匹配，将卡片锁定为 'open' 状态
function match() {
  openCardArray[0].classList.remove('open', 'show');
  openCardArray[1].classList.remove('open', 'show');
  openCardArray[0].classList.add('match');
  openCardArray[1].classList.add('match');
  openCardArray = [];
}

// 如果卡片不匹配，将卡片从数组中移除并隐藏卡片的符号
function mismatch() {
  // 定时隐藏卡片
  setTimeout(function(){
    for (let i = 0; i < openCardArray.length; i++) {
      openCardArray[i].classList.remove('open', 'show');
      // 移除禁用
      openCardArray[i].style.pointerEvents = 'auto';
    }
    openCardArray = [];
  }, 400);
}

// 计算移动次数
function movesCount() {
  count++;
  moves.textContent = count;
  scoreCalculation();
}

// 星级评分，移动次数达到 15 次，减去一星，达到 25 次，再减去一星。
function scoreCalculation() {
  if (count === 15) {
    removeStarCount = 1;
    stars[stars.length - removeStarCount].style.visibility = 'hidden';
  } else if (count === 25) {
    removeStarCount = 2;
    stars[stars.length - removeStarCount].style.visibility = 'hidden';
  }
}

// 完成游戏
function finish() {
  if (matched.length === 16) {
    stopTimer();
    // 结束提示
    alert(`Congratulation! 耗时 ${second} 秒，共移动 ${count} 次，得到 ${stars.length - removeStarCount} 颗星！`);
    // 询问是否再玩一次
    if (confirm('您想再来一局吗？')) {
      again();
    }
  }
}

// 重置显示星星
function resetStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].style.visibility = 'visible';
  }
}

// 添加重置按钮的监听器
function addListenerToReset() {
  const faRepeat = document.querySelector('.fa-repeat');
  faRepeat.addEventListener('click', again);
}

// 重置游戏
function again() {
  // 清空计步器
  moves.textContent = 0;
  count = 0;

  //清空计时器
  timer.textContent = 0;
  second = 0;

  resetStars();
  stopTimer();
  // 移除旧卡片，重新开始
  deck.style.display = 'none';
  for (let i = 0; i < 16; i++) {
    const firstCard = document.querySelector('.card');
    deck.removeChild(firstCard);
  }

  startGame();
  deck.style.display = 'flex';
}

// 创建卡片-添加卡片、重置按钮监听器-开始计时
function startGame() {
  createCard();
  const card = document.querySelectorAll('.card');
  for (let i = 0; i < card.length; i++) {
    card[i].addEventListener('click', respondToTheClick);
  }
  addListenerToReset();
  startTimer();
  console.log('test');
}

window.onload = startGame();

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 'open' 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */