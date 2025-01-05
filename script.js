// 球員題庫（完整數據，包含陳柏清和莊昕諺）
const players = [
  { number: 45, name: "林昱珉", position: "投手", team: "亞利桑那響尾蛇體系" },
  { number: 21, name: "吳俊偉", position: "投手", team: "中信兄弟" },
  { number: 64, name: "王志煊", position: "投手", team: "樂天桃猿" },
  { number: 17, name: "陳冠宇", position: "投手", team: "樂天桃猿" },
  { number: 69, name: "黃子鵬", position: "投手", team: "樂天桃猿" },
  { number: 71, name: "莊昕諺", position: "投手", team: "樂天桃猿" },
  { number: 59, name: "陳冠偉", position: "投手", team: "味全龍" },
  { number: 18, name: "林凱威", position: "投手", team: "味全龍" },
  { number: 19, name: "張奕", position: "投手", team: "富邦悍將" },
  { number: 12, name: "江國豪", position: "投手", team: "富邦悍將" },
  { number: 20, name: "陳柏清", position: "投手", team: "台鋼雄鷹" },
  { number: 75, name: "郭俊麟", position: "投手", team: "統一7-ELEVEn獅" },
  { number: 39, name: "黃恩賜", position: "投手", team: "中信兄弟" },

  // 捕手
  { number: 27, name: "林家正", position: "捕手", team: "亞利桑那響尾蛇體系" },
  { number: 4, name: "吉力吉撈・鞏冠", position: "捕手", team: "味全龍" },
  { number: 95, name: "戴培峰", position: "捕手", team: "富邦悍將" },

  // 內野手
  { number: 90, name: "江坤宇", position: "內野手", team: "中信兄弟" },
  { number: 58, name: "岳東華", position: "內野手", team: "中信兄弟" },
  { number: 35, name: "潘傑楷", position: "內野手", team: "統一7-ELEVEn獅" },
  { number: 83, name: "林立", position: "內野手", team: "樂天桃猿" },
  { number: 85, name: "朱育賢", position: "內野手", team: "樂天桃猿" },
  { number: 25, name: "李凱威", position: "內野手", team: "味全龍" },
  { number: 9, name: "張政禹", position: "內野手", team: "味全龍" },

  // 外野手
  { number: 24, name: "陳傑憲", position: "外野手", team: "統一7-ELEVEn獅" },
  { number: 14, name: "邱智呈", position: "外野手", team: "統一7-ELEVEn獅" },
  { number: 77, name: "林安可", position: "外野手", team: "統一7-ELEVEn獅" },
  { number: 98, name: "陳晨威", position: "外野手", team: "樂天桃猿" },
  { number: 32, name: "曾頌恩", position: "外野手", team: "中信兄弟" }
];

// 遊戲變數
let score = 0;
let time = 60;
let currentPlayer;
let timerInterval;
let isGameRunning = false; // 遊戲狀態

// DOM 元素
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const questionDisplay = document.getElementById("question");
const optionsContainer = document.createElement("div"); // 選項容器
document.querySelector(".game-container").appendChild(optionsContainer);

// 初始化選項按鈕
for (let i = 0; i < 3; i++) {
  const button = document.createElement("button");
  button.className = "option-button";
  button.disabled = true; // 初始化時禁用按鈕
  optionsContainer.appendChild(button);
}

// 開始遊戲
function startGame() {
  score = 0; // 初始化分數
  time = 60; // 初始化倒計時
  isGameRunning = true; // 遊戲開始
  document.getElementById("start").disabled = true; // 禁用開始按鈕
  enableButtons(); // 啟用選項按鈕
  nextQuestion(); // 顯示第一題
  startTimer(); // 啟動計時器
}

// 啟用選項按鈕
function enableButtons() {
  const buttons = document.querySelectorAll(".option-button");
  buttons.forEach(button => (button.disabled = false));
}

// 禁用選項按鈕
function disableButtons() {
  const buttons = document.querySelectorAll(".option-button");
  buttons.forEach(button => (button.disabled = true));
}

// 計時器
function startTimer() {
  timerInterval = setInterval(() => {
    time--;
    timeDisplay.textContent = time; // 更新倒計時顯示

    if (time <= 0) {
      clearInterval(timerInterval); // 停止計時器
      endGame(); // 結束遊戲
    }
  }, 1000); // 每秒執行一次
}

// 顯示下一題
function nextQuestion() {
  if (!isGameRunning) return; // 如果遊戲未開始，直接返回

  // 隨機選擇正確答案
  currentPlayer = players[Math.floor(Math.random() * players.length)];
  questionDisplay.textContent = `
    背號：${currentPlayer.number} | 位置：${currentPlayer.position} | 球隊：${currentPlayer.team}
  `;

  // 隨機生成選項（正確答案 + 兩個錯誤答案）
  const correctOption = currentPlayer.name;
  const incorrectOptions = players
    .filter(player => player.name !== correctOption)
    .sort(() => Math.random() - 0.5) // 隨機排序
    .slice(0, 2); // 選出兩個錯誤答案

  // 合併選項並隨機打亂
  const options = [correctOption, ...incorrectOptions.map(option => option.name)]
    .sort(() => Math.random() - 0.5);

  // 更新按鈕文字和點擊事件
  const buttons = document.querySelectorAll(".option-button");
  buttons.forEach((button, index) => {
    button.textContent = options[index]; // 設置按鈕文字
    button.onclick = () => handleAnswer(options[index]); // 綁定點擊事件
  });
}

// 處理答案選擇
function handleAnswer(selectedAnswer) {
  if (!isGameRunning) return; // 如果遊戲未開始，禁止回答

  if (selectedAnswer === currentPlayer.name) {
    score++; // 答對加分
    scoreDisplay.textContent = score; // 更新分數顯示
    nextQuestion(); // 顯示下一題
  } else {
    alert("答錯了！再試試！");
  }
}

// 結束遊戲
function endGame() {
  isGameRunning = false; // 停止遊戲
  disableButtons(); // 禁用選項按鈕
  alert(`遊戲結束！你的分數是：${score}`);
  questionDisplay.textContent = "遊戲結束！按下開始遊戲重新挑戰！";
  document.getElementById("start").disabled = false; // 啟用開始按鈕
}

// 綁定按鈕事件
document.getElementById("start").addEventListener("click", startGame);
