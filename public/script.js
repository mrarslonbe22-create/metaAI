// ============= API SOZLAMALARI (Backend orqali) =============
const API_BASE = window.location.origin; // http://localhost:3000 yoki production URL

// ============= 20 TA MAVZU (o'zgarishsiz) =============
const TOPICS = [
    { name: "Butun sonlar", difficulty: 1, formula: "a + b = c", example: "25 + 17 = 42" },
    { name: "Kasrlar", difficulty: 2, formula: "a/b + c/d = (ad+bc)/bd", example: "1/2 + 1/3 = 5/6" },
    { name: "Foizlar", difficulty: 2, formula: "P% of X = (P/100) × X", example: "20% of 150 = 30" },
    { name: "Daraja", difficulty: 3, formula: "aⁿ = a × a × ... × a", example: "2³ = 8" },
    { name: "Ildiz", difficulty: 3, formula: "√a = b, agar b² = a", example: "√64 = 8" },
    { name: "Proportsiya", difficulty: 3, formula: "a/b = c/d → ad = bc", example: "x/5 = 10/25 → x = 2" },
    { name: "Bir noma'lumli tenglama", difficulty: 4, formula: "ax + b = c → x = (c-b)/a", example: "3x + 5 = 20 → x = 5" },
    { name: "Ikki noma'lumli tenglama", difficulty: 5, formula: "Sistema yechimi", example: "x+y=10, x-y=4 → x=7,y=3" },
    { name: "Kvadrat tenglama", difficulty: 6, formula: "ax² + bx + c = 0 → x = [-b ± √(b²-4ac)]/2a", example: "x²-5x+6=0 → x=2,3" },
    { name: "Kvadrat funksiya", difficulty: 6, formula: "y = a(x-h)² + k", example: "y = x²-4x+3 → tepa nuqta (2,-1)" },
    { name: "Logarifm (asosiy)", difficulty: 7, formula: "log_a(b) = c → a^c = b", example: "log₂(8) = 3" },
    { name: "Logarifmik tenglama", difficulty: 8, formula: "log_a(x) = b → x = a^b", example: "log₂(x) = 3 → x = 8" },
    { name: "Trigonometriya (sin, cos)", difficulty: 7, formula: "sin²α + cos²α = 1", example: "sin(30°) = 0.5" },
    { name: "Trigonometrik tenglama", difficulty: 8, formula: "sin(x) = a → x = arcsin(a)", example: "sin(x) = 0.5 → x = 30°" },
    { name: "Arifmetik progressiya", difficulty: 7, formula: "a_n = a₁ + (n-1)d", example: "a₁=2, d=3 → a₅=14" },
    { name: "Geometrik progressiya", difficulty: 8, formula: "a_n = a₁ × q^(n-1)", example: "a₁=3, q=2 → a₄=24" },
    { name: "Limit", difficulty: 9, formula: "lim(x→a) f(x) = L", example: "lim(x→2) (x²-4)/(x-2) = 4" },
    { name: "Hosila", difficulty: 9, formula: "f'(x) = limit(h→0) [f(x+h)-f(x)]/h", example: "f(x)=x² → f'(x)=2x" },
    { name: "Integral (asosiy)", difficulty: 10, formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C", example: "∫ x² dx = x³/3 + C" },
    { name: "Aniq integral", difficulty: 10, formula: "∫_a^b f(x)dx = F(b)-F(a)", example: "∫₀¹ x² dx = 1/3" }
];

// ============= TUSHUNTIRISHLAR =============
const EXPLANATIONS = TOPICS.reduce((acc, topic) => {
    acc[topic.name] = {
        title: topic.name,
        formula: topic.formula,
        example: topic.example,
        explanation: getDetailedExplanation(topic.name)
    };
    return acc;
}, {});

function getDetailedExplanation(topicName) {
    const explanations = {
        "Ildiz": "Kvadrat ildiz - bu o'z-o'ziga ko'paytirilganda berilgan sonni beradigan son. √a = b, agar b² = a. Masalan: √64 = 8, chunki 8 × 8 = 64.",
        "Logarifm (asosiy)": "Logarifm - darajaning teskari funksiyasi. log_a(b) = c degani a^c = b. Masalan: log₂(8) = 3, chunki 2³ = 8.",
        "Daraja": "Daraja - sonning o'ziga necha marta ko'paytirilishi. aⁿ = a × a × ... × a (n marta).",
        "Kvadrat tenglama": "Kvadrat tenglama ax² + bx + c = 0 ko'rinishida bo'ladi. Yechim: x = [-b ± √(b²-4ac)] / 2a",
        "Trigonometriya (sin, cos)": "Sin, cos, tan - to'g'ri burchakli uchburchak tomonlari nisbati. sin(α)=qarama-qarshi/gipotenuza, cos(α)=yopishgan/gipotenuza",
        "Limit": "Limit - funksiyaning biror nuqtaga yaqinlashgandagi qiymati. lim(x→a) f(x) = L",
        "Hosila": "Hosila - funksiyaning o'zgarish tezligi. f'(x) = df/dx",
        "Integral": "Integral - yuzani hisoblash. Hosilaning teskarisi."
    };
    return explanations[topicName] || `${topicName} mavzusi bo'yicha formulalar va misollar yuqorida keltirilgan.`;
}

// ============= FOYDALANUVCHI PROFILI =============
let currentUser = null;
let currentQuestions = [];
let currentAnswers = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];
let timerInterval = null;
let timeLeft = 900;

class UserProfile {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${firstName} ${lastName}`;
        this.level = 1;
        this.totalTests = 0;
        this.totalCorrect = 0;
        this.totalWrong = 0;
        this.topicMastery = {};
        this.testHistory = [];
        this.streak = 0;
        this.lastTestDate = null;
        this.loadProgress();
    }
    
    loadProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        if (users[this.fullName]) {
            const data = users[this.fullName];
            this.level = data.level || 1;
            this.totalTests = data.totalTests || 0;
            this.totalCorrect = data.totalCorrect || 0;
            this.totalWrong = data.totalWrong || 0;
            this.topicMastery = data.topicMastery || {};
            this.testHistory = data.testHistory || [];
            this.streak = data.streak || 0;
            this.lastTestDate = data.lastTestDate || null;
        }
        
        TOPICS.forEach(topic => {
            if (!this.topicMastery[topic.name]) {
                this.topicMastery[topic.name] = { correct: 0, wrong: 0, level: 1 };
            }
        });
    }
    
    saveProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        users[this.fullName] = {
            firstName: this.firstName,
            lastName: this.lastName,
            level: this.level,
            totalTests: this.totalTests,
            totalCorrect: this.totalCorrect,
            totalWrong: this.totalWrong,
            topicMastery: this.topicMastery,
            testHistory: this.testHistory,
            streak: this.streak,
            lastTestDate: this.lastTestDate
        };
        localStorage.setItem("mathai_users", JSON.stringify(users));
        this.updateUI();
    }
    
    updateTopicMastery(topicName, isCorrect) {
        if (!this.topicMastery[topicName]) {
            this.topicMastery[topicName] = { correct: 0, wrong: 0, level: 1 };
        }
        
        if (isCorrect) {
            this.topicMastery[topicName].correct++;
            this.totalCorrect++;
            this.topicMastery[topicName].level = Math.min(10, this.topicMastery[topicName].level + 0.3);
        } else {
            this.topicMastery[topicName].wrong++;
            this.totalWrong++;
            this.topicMastery[topicName].level = Math.max(1, this.topicMastery[topicName].level - 0.2);
        }
        
        let totalLevel = 0;
        let count = 0;
        for (let topic in this.topicMastery) {
            totalLevel += this.topicMastery[topic].level;
            count++;
        }
        this.level = Math.round(totalLevel / count);
        this.saveProgress();
    }
    
    updateUI() {
        const userNameSpan = document.getElementById("sidebarUserName");
        if (userNameSpan) userNameSpan.innerText = this.firstName || "Guest";
        
        const levelSpan = document.getElementById("sidebarUserLevel");
        if (levelSpan) levelSpan.innerHTML = `🎯 Daraja ${this.level}`;
        
        const currentLevelSpan = document.getElementById("currentLevel");
        if (currentLevelSpan) currentLevelSpan.innerText = this.level;
        
        const totalTestsSpan = document.getElementById("totalTestsCount");
        if (totalTestsSpan) totalTestsSpan.innerText = this.totalTests;
        
        const avgScoreSpan = document.getElementById("avgScorePercent");
        if (avgScoreSpan && this.totalCorrect + this.totalWrong > 0) {
            const percent = Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100);
            avgScoreSpan.innerText = `${percent}%`;
        }
        
        const streakSpan = document.getElementById("streakDays");
        if (streakSpan) streakSpan.innerText = this.streak;
    }
    
    addTestResult(score, total, weakTopics, timeSpent) {
        this.totalTests++;
        this.testHistory.unshift({
            date: new Date().toISOString(),
            score: score,
            total: total,
            percent: Math.round((score/total)*100),
            weakTopics: weakTopics,
            timeSpent: timeSpent
        });
        
        if (this.testHistory.length > 20) this.testHistory.pop();
        
        const today = new Date().toDateString();
        if (this.lastTestDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (this.lastTestDate === yesterday.toDateString()) {
                this.streak++;
            } else {
                this.streak = 1;
            }
            this.lastTestDate = today;
        }
        this.saveProgress();
        this.updateUI();
    }
}

// ============= SAVOL YARATISH =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestionForTopic(topic, userLevel) {
    const difficulty = Math.min(10, Math.max(1, userLevel + (topic.difficulty - 5)));
    const topicName = topic.name;
    let question = { text: "", answer: 0, topic: topicName };
    
    switch(topicName) {
        case "Butun sonlar":
            if (difficulty <= 3) {
                let a = randomInt(10, 50);
                let b = randomInt(10, 50);
                question.text = `${a} + ${b}`;
                question.answer = a + b;
            } else if (difficulty <= 7) {
                let a = randomInt(50, 200);
                let b = randomInt(50, 200);
                question.text = `${a} + ${b}`;
                question.answer = a + b;
            } else {
                let a = randomInt(500, 2000);
                let b = randomInt(500, 2000);
                question.text = `${a} + ${b}`;
                question.answer = a + b;
            }
            break;
        case "Ildiz":
            if (difficulty <= 3) {
                let perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
                let val = perfectSquares[randomInt(0, perfectSquares.length-1)];
                question.text = `√${val}`;
                question.answer = Math.sqrt(val);
            } else if (difficulty <= 7) {
                let val = randomInt(100, 400);
                question.text = `√${val}`;
                question.answer = Math.round(Math.sqrt(val));
            } else {
                let val = randomInt(400, 1000);
                question.text = `√${val}`;
                question.answer = Math.round(Math.sqrt(val) * 10) / 10;
            }
            break;
        case "Logarifm (asosiy)":
            let base = randomInt(2, 5);
            let power = randomInt(2, 4);
            let value = Math.pow(base, power);
            question.text = `log${base}(${value})`;
            question.answer = power;
            break;
        case "Kvadrat tenglama":
            let root1 = randomInt(2, 8);
            let root2 = randomInt(2, 8);
            let bVal = -(root1 + root2);
            let cVal = root1 * root2;
            question.text = `x² ${bVal >= 0 ? '+' : ''}${bVal}x ${cVal >= 0 ? '+' : ''}${cVal} = 0`;
            question.answer = Math.min(root1, root2);
            break;
        default:
            question.text = `${randomInt(10, 50)} + ${randomInt(10, 50)}`;
            question.answer = eval(question.text);
    }
    return question;
}

function generateTestQuestions() {
    currentQuestions = [];
    currentAnswers = [];
    const difficultyMultiplier = Math.min(2, Math.max(0.5, currentUser.level / 5));
    
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        let question = generateQuestionForTopic(topic, currentUser.level);
        currentQuestions.push(question);
        currentAnswers.push(question.answer);
    }
}

// ============= TEST FUNKSIYALARI =============
function initTest() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    
    if (!firstName || !lastName) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    
    currentUser = new UserProfile(firstName, lastName);
    generateTestQuestions();
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    timeLeft = 900;
    
    document.getElementById("testStartSection").style.display = "none";
    document.getElementById("testActiveSection").style.display = "block";
    document.getElementById("testResultSection").style.display = "none";
    document.getElementById("totalQuestions").innerText = TOPICS.length;
    document.getElementById("currentLevelBadge").innerText = currentUser.level;
    
    startTimer();
    showCurrentQuestion();
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTest();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.getElementById("timer");
    if (timerElement) {
        timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    const progressPercent = (currentQuestionIndex / TOPICS.length) * 100;
    const progressBar = document.getElementById("testProgressBar");
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
}

function showCurrentQuestion() {
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    const container = document.getElementById("questionContainer");
    container.innerHTML = `
        <div class="question-text">
            <strong>${currentQuestionIndex + 1}-savol (${question.topic || TOPICS[currentQuestionIndex].name})</strong><br>
            ${question.text}
        </div>
        <input type="number" id="currentAnswer" class="question-input" placeholder="Javobingizni yozing" step="any">
    `;
    document.getElementById("questionCounter").innerText = currentQuestionIndex + 1;
    document.getElementById("explanationBox").style.display = "none";
    setTimeout(() => {
        const input = document.getElementById("currentAnswer");
        if (input) input.focus();
    }, 100);
}

function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showExplanation(topicName) {
    const explanation = EXPLANATIONS[topicName];
    if (!explanation) return;
    const explanationBox = document.getElementById("explanationBox");
    const explanationContent = document.getElementById("explanationContent");
    explanationContent.innerHTML = `
        <h4>📘 ${explanation.title}</h4>
        <p><strong>Formula:</strong> ${explanation.formula}</p>
        <p><strong>Misol:</strong> ${explanation.example}</p>
        <p><strong>Tushuntirish:</strong> ${explanation.explanation}</p>
        <button class="btn btn-sm btn-primary" onclick="closeExplanation()" style="margin-top:10px">Tushunildi</button>
    `;
    explanationBox.style.display = "block";
}

function closeExplanation() {
    document.getElementById("explanationBox").style.display = "none";
}

function submitAnswer() {
    const input = document.getElementById("currentAnswer");
    const userAnswer = parseFloat(input.value);
    const correctAnswer = currentAnswers[currentQuestionIndex];
    const currentTopic = currentQuestions[currentQuestionIndex].topic || TOPICS[currentQuestionIndex].name;
    
    if (isNaN(userAnswer)) {
        alert("Iltimos, javobingizni raqam bilan yozing!");
        return;
    }
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    userAnswers.push({
        question: currentQuestions[currentQuestionIndex],
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        topic: currentTopic
    });
    
    if (isCorrect) {
        userScore++;
        currentUser.updateTopicMastery(currentTopic, true);
        showToast("✅ To'g'ri javob!", "success");
    } else {
        currentUser.updateTopicMastery(currentTopic, false);
        showToast(`❌ Xato! To'g'ri javob: ${correctAnswer}`, "error");
        showExplanation(currentTopic);
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function skipQuestion() {
    const currentTopic = currentQuestions[currentQuestionIndex].topic || TOPICS[currentQuestionIndex].name;
    userAnswers.push({
        question: currentQuestions[currentQuestionIndex],
        userAnswer: null,
        correctAnswer: currentAnswers[currentQuestionIndex],
        isCorrect: false,
        topic: currentTopic,
        skipped: true
    });
    currentUser.updateTopicMastery(currentTopic, false);
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    showExplanation(currentTopic);
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function finishTest() {
    clearInterval(timerInterval);
    const timeSpent = 900 - timeLeft;
    const weakTopics = [];
    
    userAnswers.forEach(answer => {
        if (!answer.isCorrect && !answer.skipped) {
            if (!weakTopics.includes(answer.topic)) weakTopics.push(answer.topic);
        }
    });
    
    currentUser.addTestResult(userScore, TOPICS.length, weakTopics, timeSpent);
    
    const results = JSON.parse(localStorage.getItem("mathai_results")) || [];
    results.push({
        id: Date.now(),
        name: currentUser.fullName,
        score: userScore,
        maxScore: TOPICS.length,
        weakTopics: weakTopics,
        timeSpent: timeSpent,
        date: new Date().toLocaleString('uz-UZ')
    });
    localStorage.setItem("mathai_results", JSON.stringify(results));
    
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "block";
    
    const percent = Math.round((userScore / TOPICS.length) * 100);
    document.getElementById("resultGreeting").innerHTML = `👋 Salom, <strong>${currentUser.firstName}</strong>!`;
    document.getElementById("resultScore").innerText = userScore;
    document.getElementById("resultPercentage").innerHTML = `${percent}%`;
    
    let resultIcon = "🎉";
    if (percent >= 80) resultIcon = "🏆";
    else if (percent >= 60) resultIcon = "👍";
    else if (percent >= 40) resultIcon = "📚";
    else resultIcon = "💪";
    document.getElementById("resultIcon").innerHTML = resultIcon;
    
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    const timeText = minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`;
    
    let weakHtml = "";
    if (weakTopics.length > 0) {
        weakHtml = `
            <h4>📖 O'rganishingiz kerak bo'lgan mavzular:</h4>
            <div class="weak-topics-list">
                ${weakTopics.map(t => `<span class="weak-topic" onclick="showLesson('${t}')">${t}</span>`).join('')}
            </div>
        `;
    } else {
        weakHtml = `<p class="success-text">🎉 A'lo! Barcha mavzularni o'zlashtirgansiz!</p>`;
    }
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${timeText}</p>`;
    
    getAIAdvice(weakTopics, percent);
    updateStatisticsPage();
}

async function getAIAdvice(weakTopics, percent) {
    const adviceDiv = document.getElementById("aiAdviceResult");
    adviceDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> AI maslahat olinmoqda...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/api/advice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weakTopics: weakTopics, score: Math.round(percent / 5) })
        });
        const data = await response.json();
        if (data.success) {
            adviceDiv.innerHTML = `
                <div class="ai-advice-card">
                    <i class="fas fa-robot"></i>
                    <div>
                        <h4>🤖 AI Tavsiyasi</h4>
                        <p>${data.advice}</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        adviceDiv.innerHTML = `<div class="error">❌ AI maslahat olishda xatolik</div>`;
    }
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
}

// ============= AI CHAT (BACKEND ORQALI) =============
async function sendChatMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;
    
    addChatMessage(message, "user");
    input.value = "";
    
    const loadingId = addChatMessage('<i class="fas fa-spinner fa-spin"></i> AI javob yozyapti...', "bot", true);
    
    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: message })
        });
        const data = await response.json();
        const aiResponse = data.answer || "Kechirasiz, javob topilmadi.";
        
        const loadingMessage = document.getElementById(loadingId);
        if (loadingMessage) {
            loadingMessage.querySelector(".message-content").innerHTML = `<p>${aiResponse}</p>`;
            loadingMessage.id = "";
        }
    } catch (error) {
        const loadingMessage = document.getElementById(loadingId);
        if (loadingMessage) {
            loadingMessage.querySelector(".message-content").innerHTML = `<p>❌ Xatolik yuz berdi. Server aloqasini tekshiring.</p>`;
            loadingMessage.id = "";
        }
    }
}

function addChatMessage(content, sender, isTemp = false) {
    const messagesContainer = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    if (isTemp) messageDiv.id = "temp_" + Date.now();
    messageDiv.innerHTML = `
        <div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div>
        <div class="message-content"><p>${content}</p></div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv.id;
}

// ============= STATISTIKA =============
function updateStatisticsPage() {
    if (!currentUser) return;
    
    const topics = Object.keys(currentUser.topicMastery);
    const masteryLevels = topics.map(t => currentUser.topicMastery[t].level);
    const topicsChart = document.getElementById("topicsChart");
    if (topicsChart) {
        new Chart(topicsChart, {
            type: 'bar',
            data: { labels: topics, datasets: [{ label: 'O\'zlashtirish darajasi (1-10)', data: masteryLevels, backgroundColor: '#6366f1', borderRadius: 8 }] },
            options: { responsive: true, scales: { y: { min: 0, max: 10 } } }
        });
    }
    
    const recentTests = document.getElementById("recentTestsList");
    if (recentTests && currentUser.testHistory.length > 0) {
        recentTests.innerHTML = currentUser.testHistory.slice(0, 10).map(test => `
            <div class="test-history-item">
                <span>${new Date(test.date).toLocaleDateString('uz-UZ')}</span>
                <span class="score-badge ${test.percent >= 70 ? 'high' : (test.percent >= 40 ? 'medium' : 'low')}">
                    ${test.score}/${test.total} (${test.percent}%)
                </span>
            </div>
        `).join('');
    }
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map((topic) => `
        <div class="topic-card" onclick="showLesson('${topic.name}')">
            <i class="fas fa-book-open"></i>
            <h4>${topic.name}</h4>
            <small>Daraja: ${topic.difficulty}/10</small>
            ${currentUser && currentUser.topicMastery[topic.name] ? `<span class="mastery-level">🎯 ${Math.round(currentUser.topicMastery[topic.name].level * 10)}%</span>` : ''}
        </div>
    `).join('');
}

function showLesson(topicName) {
    const explanation = EXPLANATIONS[topicName];
    if (!explanation) return;
    const explanationBox = document.getElementById("explanationBox");
    const explanationContent = document.getElementById("explanationContent");
    if (explanationContent) {
        explanationContent.innerHTML = `
            <h4>📘 ${explanation.title}</h4>
            <p><strong>Formula:</strong> ${explanation.formula}</p>
            <p><strong>Misol:</strong> ${explanation.example}</p>
            <p><strong>Tushuntirish:</strong> ${explanation.explanation}</p>
            <h4>📝 Amaliy topshiriq:</h4>
            <p>${getPracticeForTopic(topicName)}</p>
        `;
        explanationBox.style.display = "block";
    }
}

function getPracticeForTopic(topicName) {
    const practices = {
        "Ildiz": "√169 ni hisoblang. Javob: 13",
        "Logarifm (asosiy)": "log₃(81) ni hisoblang. Javob: 4",
        "Daraja": "2⁵ ni hisoblang. Javob: 32",
        "Kvadrat tenglama": "x² - 7x + 12 = 0 tenglamasini yeching. Javob: x = 3 va x = 4"
    };
    return practices[topicName] || "Mavzuga oid 5 ta misol yeching va javoblaringizni tekshiring.";
}

function filterLessons() {
    const search = document.getElementById("lessonSearch")?.value.toLowerCase() || "";
    const cards = document.querySelectorAll("#lessonsGrid .topic-card");
    cards.forEach(card => {
        const title = card.querySelector("h4")?.innerText.toLowerCase() || "";
        card.style.display = title.includes(search) ? "block" : "none";
    });
}

// ============= NAVIGATION =============
function switchToPage(pageName) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(`${pageName}Page`).classList.add("active");
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    document.querySelector(`.nav-item[data-page="${pageName}"]`)?.classList.add("active");
    
    const titles = { home: "MathAI", test: "Test topshirish", statistics: "Mening statistikam", lessons: "Darslar", ai: "AI yordamchi" };
    document.getElementById("pageTitle").innerText = titles[pageName] || "MathAI";
    if (pageName === "lessons") updateLessonsPage();
    if (pageName === "statistics" && currentUser) updateStatisticsPage();
}

function goToAdmin() {
    const password = prompt("Admin parolini kiriting:");
    if (password === "admin123") window.location.href = "admin.html";
    else alert("❌ Parol xato!");
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
    const topicsGrid = document.getElementById("topicsGrid");
    if (topicsGrid) {
        topicsGrid.innerHTML = TOPICS.map(topic => `<div class="topic-card" onclick="showLesson('${topic.name}')"><i class="fas fa-chalkboard-user"></i><span>${topic.name}</span></div>`).join('');
    }
    
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle && sidebar) menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    
    const themeToggle = document.getElementById("themeToggle");
    themeToggle?.addEventListener("click", () => document.body.classList.toggle("dark-mode"));
    
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) switchToPage(page);
        });
    });
    
    console.log("✅ MathAI tayyor!");
});
