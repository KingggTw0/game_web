// script.js

// 1. Dữ liệu trò chơi
const levels = [
    { 
        answer: "HOC TAP", 
        image: "https://via.placeholder.com/400x200?text=Sách+Vở", 
        hint: "Hoạt động chính của học sinh." 
    },
    { 
        answer: "AN TOAN", 
        image: "https://via.placeholder.com/400x200?text=Mũ+Bảo+Hiểm", 
        hint: "Không có nguy hiểm." 
    },
    // Thêm các màn chơi khác tại đây...
];

let currentLevelIndex = 0;
let currentAnswer = []; // Mảng chứa các chữ cái người dùng đã chọn
let allAvailableLetters = []; // Các chữ cái có thể chọn (đáp án + chữ cái ngẫu nhiên)

// 2. Các phần tử DOM
const answerSlotsDiv = document.getElementById('answer-slots');
const letterBankDiv = document.getElementById('letter-bank');
const puzzleImage = document.getElementById('puzzle-image');
const hintText = document.getElementById('hint-text');
const messageElement = document.getElementById('message');
const nextLevelBtn = document.getElementById('next-level-btn');

// 3. Hàm tạo Bảng chữ cái ngẫu nhiên
function generateRandomLetters(correctAnswer) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const extraCount = 16 - correctAnswer.length; // Tổng cộng 16 chữ cái (tùy chỉnh)
    let randomLetters = [];
    for (let i = 0; i < extraCount; i++) {
        randomLetters.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    // Kết hợp đáp án và chữ cái ngẫu nhiên
    const allLetters = [...correctAnswer.split(''), ...randomLetters];
    // Xáo trộn (Shuffle) mảng chữ cái
    for (let i = allLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
    }
    return allLetters;
}

// 4. Hàm tải Màn chơi
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        messageElement.textContent = "🎉 CHÚC MỪNG! Bạn đã hoàn thành tất cả các màn chơi! 🎉";
        answerSlotsDiv.innerHTML = '';
        letterBankDiv.innerHTML = '';
        puzzleImage.style.display = 'none';
        nextLevelBtn.style.display = 'none';
        return;
    }

    const currentLevel = levels[levelIndex];
    currentAnswer = Array(currentLevel.answer.length).fill(''); // Reset ô đáp án
    
    // Cập nhật giao diện
    puzzleImage.src = currentLevel.image;
    puzzleImage.style.display = 'block';
    hintText.textContent = `Gợi ý: ${currentLevel.hint}`;
    messageElement.textContent = '';
    nextLevelBtn.style.display = 'none';

    // Tạo Ô chữ đáp án
    answerSlotsDiv.innerHTML = '';
    currentLevel.answer.split('').forEach((letter, index) => {
        const slot = document.createElement('div');
        slot.classList.add('answer-slot');
        slot.dataset.index = index;
        slot.addEventListener('click', () => removeLetter(index));
        answerSlotsDiv.appendChild(slot);
    });

    // Tạo Bảng chữ cái
    allAvailableLetters = generateRandomLetters(currentLevel.answer.replace(/\s/g, ''));
    letterBankDiv.innerHTML = '';
    allAvailableLetters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.classList.add('letter-btn');
        btn.textContent = letter;
        btn.dataset.originalIndex = index; // Lưu vị trí ban đầu
        btn.addEventListener('click', () => selectLetter(btn, letter));
        letterBankDiv.appendChild(btn);
    });
}

// 5. Hàm xử lý chọn Chữ cái
function selectLetter(button, letter) {
    // 1. Tìm vị trí trống đầu tiên trong ô đáp án
    const emptyIndex = currentAnswer.findIndex(char => char === '');
    
    if (emptyIndex !== -1) {
        // 2. Đặt chữ cái vào ô đáp án và cập nhật DOM
        currentAnswer[emptyIndex] = letter;
        const slotElement = answerSlotsDiv.children[emptyIndex];
        slotElement.textContent = letter;
        slotElement.dataset.letterIndex = button.dataset.originalIndex; // Lưu index của nút đã chọn
        
        // 3. Vô hiệu hóa nút đã chọn
        button.classList.add('disabled');
        button.disabled = true;

        // 4. Kiểm tra đáp án sau khi điền
        checkAnswer();
    }
}

// 6. Hàm xử lý xóa Chữ cái
function removeLetter(answerIndex) {
    const letter = currentAnswer[answerIndex];
    
    if (letter) {
        // 1. Tìm lại nút chữ cái tương ứng trong bảng chữ cái
        const letterIndex = answerSlotsDiv.children[answerIndex].dataset.letterIndex;
        const originalButton = letterBankDiv.querySelector(`[data-original-index="${letterIndex}"]`);

        // 2. Kích hoạt lại nút
        if (originalButton) {
            originalButton.classList.remove('disabled');
            originalButton.disabled = false;
        }

        // 3. Xóa chữ cái khỏi ô đáp án
        currentAnswer[answerIndex] = '';
        answerSlotsDiv.children[answerIndex].textContent = '';
        delete answerSlotsDiv.children[answerIndex].dataset.letterIndex;
    }
}

// 7. Hàm kiểm tra Đáp án
function checkAnswer() {
    const currentLevel = levels[currentLevelIndex];
    const userAnswer = currentAnswer.join('');

    if (!userAnswer.includes('')) { // Đã điền đầy đủ
        if (userAnswer === currentLevel.answer.replace(/\s/g, '')) {
            messageElement.textContent = "✅ CHÍNH XÁC! Chúc mừng bạn!";
            nextLevelBtn.style.display = 'block';
        } else {
            messageElement.textContent = "❌ SAI! Hãy thử lại.";
        }
    }
}

// 8. Xử lý nút Màn Tiếp Theo
nextLevelBtn.addEventListener('click', () => {
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
});

// 9. Khởi động trò chơi
document.addEventListener('DOMContentLoaded', () => {
    loadLevel(currentLevelIndex);
});