// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin; // ✅ Faqat backend manzili

// API key ni BU YERGA YOZMANG!
// ============= 20 TA MAVZU =============
const TOPICS = [
    "Butun sonlar", "Kasrlar", "Foizlar", "Daraja", "Ildiz",
    "Proportsiya", "Bir noma'lumli tenglama", "Ikki noma'lumli tenglama",
    "Kvadrat tenglama", "Kvadrat funksiya", "Logarifm (asosiy)",
    "Logarifmik tenglama", "Trigonometriya", "Trigonometrik tenglama",
    "Arifmetik progressiya", "Geometrik progressiya", "Limit",
    "Hosila", "Integral", "Aniq integral"
];

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
        this.topicLevels = {};
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
            this.topicLevels = data.topicLevels || {};
            this.testHistory = data.testHistory || [];
            this.streak = data.streak || 0;
            this.lastTestDate = data.lastTestDate || null;
        }
        TOPICS.forEach(topic => {
            if (!this.topicLevels[topic]) this.topicLevels[topic] = 1;
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
            topicLevels: this.topicLevels,
            testHistory: this.testHistory,
            streak: this.streak,
            lastTestDate: this.lastTestDate
        };
        localStorage.setItem("mathai_users", JSON.stringify(users));
        localStorage.setItem("mathai_current_user", JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName
        }));
        this.updateUI();
    }
    
    updateTopicLevel(topicName, isCorrect) {
        let current = this.topicLevels[topicName] || 1;
        if (isCorrect) {
            this.topicLevels[topicName] = Math.min(10, current + 0.3);
            this.totalCorrect++;
        } else {
            this.topicLevels[topicName] = Math.max(1, current - 0.2);
            this.totalWrong++;
        }
        
        let total = 0, count = 0;
        for (let t in this.topicLevels) {
            total += this.topicLevels[t];
            count++;
        }
        let newLevel = count > 0 ? Math.round(total / count) : 1;
        if (newLevel > this.level) {
            this.showLevelUpToast(this.level, newLevel);
        }
        this.level = newLevel;
        this.saveProgress();
    }
    
    showLevelUpToast(oldLevel, newLevel) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.background = '#4f46e5';
        toast.innerHTML = `🎉 DARAJA OSHDI! ${oldLevel} → ${newLevel}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    updateUI() {
        const userNameSpan = document.getElementById("sidebarUserName");
        if (userNameSpan) userNameSpan.innerText = this.firstName;
        const levelSpan = document.getElementById("sidebarUserLevel");
        if (levelSpan) levelSpan.innerHTML = `🎯 Daraja ${this.level}`;
        const currentLevelSpan = document.getElementById("currentLevel");
        if (currentLevelSpan) currentLevelSpan.innerText = this.level;
        const totalTestsSpan = document.getElementById("totalTestsCount");
        if (totalTestsSpan) totalTestsSpan.innerText = this.totalTests;
        const accuracy = this.totalCorrect + this.totalWrong > 0 ? Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100) : 0;
        const avgScoreSpan = document.getElementById("avgScorePercent");
        if (avgScoreSpan) avgScoreSpan.innerText = `${accuracy}%`;
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
            if (this.lastTestDate === yesterday.toDateString()) this.streak++;
            else this.streak = 1;
            this.lastTestDate = today;
        }
        this.saveProgress();
        this.updateUI();
    }
}

// ============= ODDIY SAVOLLAR (AI ishlamasa) =============
const SIMPLE_QUESTIONS = {
    "Butun sonlar": { text: "25 + 17 = ?", answer: 42 },
    "Kasrlar": { text: "1/2 + 1/3 = ? (o'nlik)", answer: 0.833 },
    "Foizlar": { text: "20% of 150 = ?", answer: 30 },
    "Daraja": { text: "2^3 = ?", answer: 8 },
    "Ildiz": { text: "√64 = ?", answer: 8 },
    "Proportsiya": { text: "x/5 = 10/25, x = ?", answer: 2 },
    "Bir noma'lumli tenglama": { text: "3x + 5 = 20, x = ?", answer: 5 },
    "Ikki noma'lumli tenglama": { text: "x+y=10, x-y=4, x = ?", answer: 7 },
    "Kvadrat tenglama": { text: "x² - 5x + 6 = 0 (kichik ildiz)", answer: 2 },
    "Kvadrat funksiya": { text: "y=x²-4x+3 tepa nuqtasi x = ?", answer: 2 },
    "Logarifm (asosiy)": { text: "log₂(8) = ?", answer: 3 },
    "Logarifmik tenglama": { text: "log₂(x) = 3, x = ?", answer: 8 },
    "Trigonometriya": { text: "sin(30°) = ?", answer: 0.5 },
    "Trigonometrik tenglama": { text: "sin(x)=0.5 (0°<x<90°), x = ?", answer: 30 },
    "Arifmetik progressiya": { text: "a₁=2, d=3, a₅ = ?", answer: 14 },
    "Geometrik progressiya": { text: "a₁=3, q=2, a₄ = ?", answer: 24 },
    "Limit": { text: "lim(x→2) (x²-4)/(x-2) = ?", answer: 4 },
    "Hosila": { text: "f(x)=x², f'(2) = ?", answer: 4 },
    "Integral": { text: "∫₀² x dx = ?", answer: 2 },
    "Aniq integral": { text: "∫₀² x dx = ?", answer: 2 }
};

// ============= SAVOL YARATISH =============
function generateQuestionForTopic(topicName, level) {
    if (SIMPLE_QUESTIONS[topicName]) {
        return SIMPLE_QUESTIONS[topicName];
    }
    return { text: "5 + 3 = ?", answer: 8 };
}

function generateTestQuestions() {
    currentQuestions = [];
    currentAnswers = [];
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        const userLevel = currentUser ? (currentUser.topicLevels[topic] || 1) : 1;
        const question = generateQuestionForTopic(topic, userLevel);
        currentQuestions.push({ text: question.text, answer: question.answer, topic: topic });
        currentAnswers.push(question.answer);
    }
    console.log("✅ Savollar yaratildi:", currentQuestions.length);
}

// ============= REGISTRATSIYA =============
function registerUser() {
    console.log("registerUser chaqirildi");
    const firstName = document.getElementById("regFirstName").value.trim();
    const lastName = document.getElementById("regLastName").value.trim();
    
    if (!firstName || !lastName) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    
    currentUser = new UserProfile(firstName, lastName);
    currentUser.saveProgress();
    
    document.getElementById("registrationPage").style.display = "none";
    document.getElementById("homePage").classList.add("active");
    
    updateTopicsGrid();
    currentUser.updateUI();
    showToast(`👋 Xush kelibsiz, ${firstName}! Darajangiz: ${currentUser.level}`, "success");
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

// ============= TEST FUNKSIYALARI =============
function initTest() {
    console.log("initTest chaqirildi");
    if (!currentUser) {
        alert("Iltimos, avval ro'yxatdan o'ting!");
        switchToPage('home');
        return;
    }
    
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
    if (timerElement) timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    if (container) {
        container.innerHTML = `
            <div class="question-text">
                <strong>${currentQuestionIndex + 1}-savol (${question.topic})</strong><br>
                ${question.text}
            </div>
            <input type="number" id="currentAnswer" class="question-input" placeholder="Javobingizni yozing" step="any">
        `;
    }
    document.getElementById("questionCounter").innerText = currentQuestionIndex + 1;
    document.getElementById("explanationBox").style.display = "none";
    setTimeout(() => {
        const input = document.getElementById("currentAnswer");
        if (input) input.focus();
    }, 100);
}

function submitAnswer() {
    console.log("submitAnswer chaqirildi");
    const input = document.getElementById("currentAnswer");
    if (!input) return;
    
    const userAnswer = parseFloat(input.value);
    const correctAnswer = currentAnswers[currentQuestionIndex];
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    
    if (isNaN(userAnswer)) {
        alert("Iltimos, javobingizni raqam bilan yozing!");
        return;
    }
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    userAnswers.push({
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        topic: currentTopic
    });
    
    if (isCorrect) {
        userScore++;
        currentUser.updateTopicLevel(currentTopic, true);
        showToast("✅ To'g'ri javob!", "success");
    } else {
        currentUser.updateTopicLevel(currentTopic, false);
        showToast(`❌ Xato! To'g'ri javob: ${correctAnswer}`, "error");
        showExplanation(currentTopic, correctAnswer);
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function skipQuestion() {
    console.log("skipQuestion chaqirildi");
    if (currentQuestionIndex >= TOPICS.length) return;
    
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    userAnswers.push({
        isCorrect: false,
        topic: currentTopic,
        skipped: true
    });
    currentUser.updateTopicLevel(currentTopic, false);
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function showExplanation(topicName, correctAnswer) {
    const explanationText = TOPICS_DATA[topicName] || `${topicName} mavzusini qayta o'rganing.`;
    const box = document.getElementById("explanationBox");
    const content = document.getElementById("explanationContent");
    if (content) {
        content.innerHTML = `
            <h4>📘 ${topicName}</h4>
            <p>${explanationText}</p>
            <p><strong>To'g'ri javob:</strong> ${correctAnswer}</p>
            <button class="btn btn-primary" onclick="closeExplanation()" style="margin-top:10px;">Tushunildi</button>
        `;
    }
    if (box) box.style.display = "block";
}

function closeExplanation() {
    document.getElementById("explanationBox").style.display = "none";
}

function finishTest() {
    clearInterval(timerInterval);
    const timeSpent = 900 - timeLeft;
    const weakTopics = [];
    
    userAnswers.forEach(a => {
        if (!a.isCorrect && !weakTopics.includes(a.topic)) weakTopics.push(a.topic);
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
    document.getElementById("resultIcon").innerHTML = percent >= 80 ? "🏆" : (percent >= 60 ? "👍" : "📚");
    
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p>`;
    
    let weakHtml = "";
    if (weakTopics.length > 0) {
        weakHtml = `<h4>📖 O'rganishingiz kerak:</h4><div class="weak-topics-list">${weakTopics.map(t => `<span class="weak-topic" onclick="showLesson('${t}')">${t}</span>`).join('')}</div>`;
    } else {
        weakHtml = `<p>🎉 A'lo! Barcha mavzularni o'zlashtirgansiz!</p>`;
    }
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    
    updateStatisticsPage();
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
}

// ============= AI CHAT =============
async function sendChatMessage() {
    console.log("sendChatMessage chaqirildi");
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
            loadingMessage.querySelector(".message-content").innerHTML = `<p>❌ Xatolik. Keyinroq urinib ko'ring.</p>`;
            loadingMessage.id = "";
        }
    }
}

function addChatMessage(content, sender, isTemp = false) {
    const container = document.getElementById("chatMessages");
    if (!container) return "";
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    if (isTemp) div.id = "temp_" + Date.now();
    div.innerHTML = `<div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div><div class="message-content">${content}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
}

// ============= STATISTIKA =============
function updateStatisticsPage() {
    if (!currentUser) return;
    
    const topics = Object.keys(currentUser.topicLevels);
    const levels = topics.map(t => currentUser.topicLevels[t]);
    
    const chart = document.getElementById("topicsChart");
    if (chart && typeof Chart !== 'undefined') {
        let existing = Chart.getChart(chart);
        if (existing) existing.destroy();
        new Chart(chart, {
            type: 'bar',
            data: { labels: topics, datasets: [{ label: 'Mavzu darajasi (1-10)', data: levels, backgroundColor: '#4f46e5' }] },
            options: { responsive: true, scales: { y: { min: 0, max: 10 } } }
        });
    }
    
    const recent = document.getElementById("recentTestsList");
    if (recent) {
        if (currentUser.testHistory.length > 0) {
            recent.innerHTML = currentUser.testHistory.slice(0, 10).map((t, i) => `
                <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #e2e8f0;">
                    <span>${new Date(t.date).toLocaleDateString('uz-UZ')}</span>
                    <span style="background:${t.percent>=70?'#10b981':(t.percent>=40?'#f59e0b':'#ef4444')}; padding:4px 12px; border-radius:20px; color:white;">${t.score}/${t.total} (${t.percent}%)</span>
                </div>
            `).join('');
        } else {
            recent.innerHTML = `<div style="padding:40px; text-align:center;">Hali test topshirilmagan</div>`;
        }
    }
}

// ============= DARSLAR =============
const TOPICS_DATA = {
    "Butun sonlar": "Butun sonlar - manfiy, nol va musbat sonlar. Qo'shish, ayirish, ko'paytirish, bo'lish amallari bajariladi.",
    "Kasrlar": "Kasr - a/b ko'rinishidagi son. a - surat, b - maxraj.",
    "Foizlar": "Foiz - yuzdan bir qism. P% = P/100.",
    "Daraja": "aⁿ = a × a × ... × a (n marta)",
    "Ildiz": "√a = b, agar b² = a",
    "Proportsiya": "a:b = c:d → ad = bc",
    "Bir noma'lumli tenglama": "ax + b = c → x = (c-b)/a",
    "Ikki noma'lumli tenglama": "x + y = a, x - y = b → x = (a+b)/2",
    "Kvadrat tenglama": "ax² + bx + c = 0 → x = [-b ± √(b²-4ac)]/2a",
    "Kvadrat funksiya": "y = ax² + bx + c, tepa nuqta x = -b/(2a)",
    "Logarifm (asosiy)": "log_a(b) = c → a^c = b",
    "Logarifmik tenglama": "log_a(x) = b → x = a^b",
    "Trigonometriya": "sin²α + cos²α = 1, sin(30°)=0.5",
    "Trigonometrik tenglama": "sin(x)=a → x=arcsin(a)",
    "Arifmetik progressiya": "a_n = a₁ + (n-1)d",
    "Geometrik progressiya": "a_n = a₁ × q^(n-1)",
    "Limit": "lim(x→a) f(x) = L",
    "Hosila": "f'(x) = lim(h→0) [f(x+h)-f(x)]/h",
    "Integral": "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
    "Aniq integral": "∫_a^b f(x)dx = F(b)-F(a)"
};

function updateTopicsGrid() {
    const grid = document.getElementById("topicsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showLesson('${topic}')">
            <i class="fas fa-chalkboard-user"></i>
            <h4>${topic}</h4>
            <small>⭐ ${currentUser ? (currentUser.topicLevels[topic] || 1).toFixed(1) : 1}/10</small>
        </div>
    `).join('');
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showLesson('${topic}')">
            <i class="fas fa-book-open"></i>
            <h4>${topic}</h4>
            <button class="btn btn-outline" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); showLesson('${topic}')">📘 O'rganish</button>
        </div>
    `).join('');
}

function showLesson(topicName) {
    const explanation = TOPICS_DATA[topicName] || "Mavzu haqida ma'lumot topilmadi.";
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="formula-box"><strong>📘 ${topicName}</strong><br><p>${explanation}</p></div>
            <button class="btn btn-primary" onclick="closeLessonModal()" style="width:100%; margin-top:20px;">Tushunildi</button>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${topicName}`;
    if (modal) modal.style.display = "flex";
}

function closeLessonModal() {
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "none";
}

// ============= SAHIFALAR =============
function switchToPage(pageName) {
    console.log("switchToPage:", pageName);
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    const target = document.getElementById(`${pageName}Page`);
    if (target) target.classList.add("active");
    
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (activeNav) activeNav.classList.add("active");
    
    const titles = { home: "MathAI", test: "Test", statistics: "Statistika", lessons: "Darslar", ai: "AI yordamchi" };
    const title = document.getElementById("pageTitle");
    if (title) title.innerText = titles[pageName] || "MathAI";
    
    if (pageName === "lessons") updateLessonsPage();
    if (pageName === "statistics" && currentUser) updateStatisticsPage();
    if (pageName === "home") updateTopicsGrid();
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#ef4444');
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    showToast(document.body.classList.contains('dark-mode') ? "🌙 Qorong'u rejim" : "🌞 Yorug' rejim", "success");
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM yuklandi!");
    loadDarkMode();
    updateTopicsGrid();
    updateLessonsPage();
    
    const savedUser = localStorage.getItem("mathai_current_user");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUser = new UserProfile(user.firstName, user.lastName);
        document.getElementById("registrationPage").style.display = "none";
        document.getElementById("homePage").classList.add("active");
        currentUser.updateUI();
        updateStatisticsPage();
    }
    
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) switchToPage(page);
        });
    });
    
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", toggleDarkMode);
    
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle && sidebar) menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    
    window.onclick = (e) => {
        const modal = document.getElementById("lessonModal");
        if (e.target === modal) closeLessonModal();
    };
    
    console.log("✅ MathAI tayyor!");
});
