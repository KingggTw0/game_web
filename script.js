const topics = {
  0: "Tình cảm Gia đình & Hiếu đạo",
  1: "Học tập & Ý chí rèn luyện",
  2: "Kinh nghiệm sản xuất & Thời tiết",
  3: "Đạo đức & Nhân cách sống",
  4: "Ứng xử xã hội & Đối nhân xử thế",
  5: "Phê phán thói hư tật xấu (Châm biếm)",
};

const groups = [group_1, group_2, group_3, group_4, group_5, group_6];

// Biến toàn cục
let currentSet = [];
let currentPhraseIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 300; // 5 phút = 300 giây
let startTime, endTime;

// Hàm xáo trộn mảng (Fisher-Yates Shuffle)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Khởi tạo: 6 bộ câu hỏi
function initGame() {
  const source = []; // Bộ câu hỏi

  while (source.length < 6) {
    const indexSource = Math.round(Math.random() * 100) % 6;
    if (source.includes(indexSource)) continue;
    source.push(indexSource);
  }

  const container = document.getElementById("sets-container");

  // Chia thành 6 bộ (mỗi bộ 15)
  for (let i = 0; i < source.length; i++) {

    // Tạo nút bấm trên giao diện
    const btn = document.createElement("button");
    btn.className = "btn-set";
    btn.innerText = `Bộ số ${i + 1}`;
    btn.onclick = () => {
      startSet(source[i]);
      btn.classList.add("disabled");
    };
    container.appendChild(btn);
  }
}

// Bắt đầu chơi 1 bộ
function startSet(setIndex) {
  currentSet = groups[setIndex];
  currentPhraseIndex = 0;
  score = 0;
  timeLeft = 300;

  // Chuyển màn hình
  document.getElementById("screen-menu").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");

  // Hiển thị chủ đề của bộ câu hỏi
  document.getElementById("topic").innerText = topics[setIndex];

  // Render dữ liệu đầu tiên
  updateUI();

  // Bắt đầu đếm giờ
  startTime = new Date();
  startTimer();
}

// Cập nhật giao diện khi đổi câu hỏi
function updateUI() {
  document.getElementById("phrase-display").innerText =
    currentSet[currentPhraseIndex];
  document.getElementById("current-score").innerText = score;
  document.getElementById("question-count").innerText = currentPhraseIndex + 1;
}

// Xử lý nút "Tính điểm"
function handleScore() {
  score++;
  nextPhrase();
}

// Xử lý nút "Bỏ qua"
function handleSkip() {
  nextPhrase();
}

// Chuyển sang cụm từ tiếp theo
function nextPhrase() {
  currentPhraseIndex++;
  if (currentPhraseIndex >= 15) {
    endGame();
  } else {
    updateUI();
  }
}

// Đồng hồ đếm ngược
function startTimer() {
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerEl.innerText = `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Kết thúc game
function endGame() {
  clearInterval(timerInterval);
  endTime = new Date();

  // Tính thời gian hoàn thành thực tế
  const timeTakenSeconds = Math.round((endTime - startTime) / 1000);
  const takenMin = Math.floor(timeTakenSeconds / 60);
  const takenSec = timeTakenSeconds % 60;

  // Hiển thị Popup
  document.getElementById("final-score").innerText = score;
  document.getElementById("final-time").innerText = `${
    takenMin < 10 ? "0" + takenMin : takenMin
  }:${takenSec < 10 ? "0" + takenSec : takenSec}`;

  document.getElementById("modal-result").classList.remove("hidden");
}

// Chơi lại
function reset() {
  document.getElementById("modal-result").classList.add("hidden");
  document.getElementById("screen-menu").classList.remove("hidden");
  document.getElementById("screen-game").classList.add("hidden");
}

// Chạy hàm khởi tạo khi tải trang
initGame();
