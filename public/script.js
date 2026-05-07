// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin;

// ============= 20 TA MAVZU (BAZA) =============
const TOPICS = [
    { id: 1, name: "Butun sonlar", baseLevel: 1 },
    { id: 2, name: "Kasrlar", baseLevel: 2 },
    { id: 3, name: "Foizlar", baseLevel: 2 },
    { id: 4, name: "Daraja", baseLevel: 3 },
    { id: 5, name: "Ildiz", baseLevel: 3 },
    { id: 6, name: "Proportsiya", baseLevel: 3 },
    { id: 7, name: "Bir noma'lumli tenglama", baseLevel: 4 },
    { id: 8, name: "Ikki noma'lumli tenglama", baseLevel: 5 },
    { id: 9, name: "Kvadrat tenglama", baseLevel: 6 },
    { id: 10, name: "Kvadrat funksiya", baseLevel: 6 },
    { id: 11, name: "Logarifm (asosiy)", baseLevel: 7 },
    { id: 12, name: "Logarifmik tenglama", baseLevel: 8 },
    { id: 13, name: "Trigonometriya (sin, cos)", baseLevel: 7 },
    { id: 14, name: "Trigonometrik tenglama", baseLevel: 8 },
    { id: 15, name: "Arifmetik progressiya", baseLevel: 7 },
    { id: 16, name: "Geometrik progressiya", baseLevel: 8 },
    { id: 17, name: "Limit", baseLevel: 9 },
    { id: 18, name: "Hosila", baseLevel: 9 },
    { id: 19, name: "Integral (asosiy)", baseLevel: 10 },
    { id: 20, name: "Aniq integral", baseLevel: 10 }
];

// ============= FOYDALANUVCHI PROFILI (Darajali) =============
let currentUser = null;
let currentQuestions = [];
let currentAnswers = [];
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];
let timerInterval = null;
let timeLeft = 900;
let isWaitingForAI = false;

class UserProfile {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${firstName} ${lastName}`;
        this.globalLevel = 1;
        this.totalTests = 0;
        this.totalCorrect = 0;
        this.totalWrong = 0;
        this.topicLevels = {};  // Har bir mavzu uchun daraja (1-10)
        this.testHistory = [];
        this.streak = 0;
        this.lastTestDate = null;
        this.loadProgress();
    }
    
    loadProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        if (users[this.fullName]) {
            const data = users[this.fullName];
            this.globalLevel = data.globalLevel || 1;
            this.totalTests = data.totalTests || 0;
            this.totalCorrect = data.totalCorrect || 0;
            this.totalWrong = data.totalWrong || 0;
            this.topicLevels = data.topicLevels || {};
            this.testHistory = data.testHistory || [];
            this.streak = data.streak || 0;
            this.lastTestDate = data.lastTestDate || null;
        }
        
        // Yangi mavzular uchun boshlang'ich daraja
        TOPICS.forEach(topic => {
            if (!this.topicLevels[topic.name]) {
                this.topicLevels[topic.name] = topic.baseLevel;
            }
        });
    }
    
    saveProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        users[this.fullName] = {
            firstName: this.firstName,
            lastName: this.lastName,
            globalLevel: this.globalLevel,
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
        let currentLevel = this.topicLevels[topicName] || 1;
        
        if (isCorrect) {
            // To'g'ri javob: darajani oshirish (0.3-0.5)
            let increase = 0.3 + (Math.random() * 0.2);
            this.topicLevels[topicName] = Math.min(10, currentLevel + increase);
            this.totalCorrect++;
        } else {
            // Xato javob: darajani kamaytirish (0.2-0.3)
            let decrease = 0.2 + (Math.random() * 0.1);
            this.topicLevels[topicName] = Math.max(1, currentLevel - decrease);
            this.totalWrong++;
        }
        
        // Global darajani hisoblash (barcha mavzular o'rtacha)
        let total = 0;
        let count = 0;
        for (let topic in this.topicLevels) {
            total += this.topicLevels[topic];
            count++;
        }
        let newGlobal = count > 0 ? Math.round(total / count) : 1;
        
        if (newGlobal > this.globalLevel) {
            this.showLevelUpToast(this.globalLevel, newGlobal);
        }
        this.globalLevel = newGlobal;
        
        this.saveProgress();
    }
    
    showLevelUpToast(oldLevel, newLevel) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;padding:20px 40px;border-radius:20px;font-size:24px;font-weight:bold;z-index:10000;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);`;
        toast.innerHTML = `<i class="fas fa-star" style="font-size:40px;margin-bottom:10px;"></i><br>🎉 DARAJA OSHDI! 🎉<br>${oldLevel} → ${newLevel}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    updateUI() {
        const userNameSpan = document.getElementById("sidebarUserName");
        if (userNameSpan) userNameSpan.innerText = this.firstName || "Guest";
        const levelSpan = document.getElementById("sidebarUserLevel");
        if (levelSpan) levelSpan.innerHTML = `🎯 Daraja ${this.globalLevel}`;
        const currentLevelSpan = document.getElementById("currentLevel");
        if (currentLevelSpan) currentLevelSpan.innerText = this.globalLevel;
        const totalTestsSpan = document.getElementById("totalTestsCount");
        if (totalTestsSpan) totalTestsSpan.innerText = this.totalTests;
        const accuracy = this.totalCorrect + this.totalWrong > 0 ? Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100) : 0;
        const avgScoreSpan = document.getElementById("avgScorePercent");
        if (avgScoreSpan) avgScoreSpan.innerText = `${accuracy}%`;
        const streakSpan = document.getElementById("streakDays");
        if (streakSpan) streakSpan.innerText = this.streak;
        this.updateProfileCard();
    }
    
    updateProfileCard() {
        const profileCard = document.getElementById("userProfileCard");
        if (!profileCard) return;
        
        const weakTopics = [];
        const strongTopics = [];
        for (let topic in this.topicLevels) {
            if (this.topicLevels[topic] < 4) weakTopics.push(topic);
            else if (this.topicLevels[topic] > 7) strongTopics.push(topic);
        }
        
        profileCard.innerHTML = `
            <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;">
                <div style="width:60px;height:60px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                    <i class="fas fa-user-graduate" style="font-size:30px;color:white;"></i>
                </div>
                <div>
                    <h3 style="margin:0;">${this.firstName} ${this.lastName}</h3>
                    <p style="margin:0;color:#64748b;"><i class="fas fa-chart-line"></i> Global daraja: ${this.globalLevel}/10</p>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;margin-bottom:15px;">
                <div><strong>${this.totalTests}</strong><br><small>Testlar</small></div>
                <div><strong>${this.totalCorrect}</strong><br><small>To'g'ri</small></div>
                <div><strong>${Math.round((this.totalCorrect/(this.totalCorrect+this.totalWrong||1))*100)}%</strong><br><small>Aniqlik</small></div>
            </div>
            <div class="progress-bar" style="background:#e2e8f0;height:10px;border-radius:10px;margin-bottom:10px;">
                <div style="width:${(this.globalLevel/10)*100}%;background:linear-gradient(90deg,#4f46e5,#7c3aed);height:100%;border-radius:10px;"></div>
            </div>
            ${weakTopics.length > 0 ? `<div style="background:#fee2e2;padding:10px;border-radius:10px;"><strong>📖 O'rganish kerak:</strong> ${weakTopics.slice(0,3).join(", ")}</div>` : ''}
        `;
    }
    
    addTestResult(score, total, weakTopicsData, timeSpent) {
        this.totalTests++;
        const percent = Math.round((score/total)*100);
        this.testHistory.unshift({
            date: new Date().toISOString(),
            score: score,
            total: total,
            percent: percent,
            weakTopics: weakTopicsData,
            timeSpent: timeSpent,
            topicLevels: JSON.parse(JSON.stringify(this.topicLevels))
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

// ============= AI SAVOL YARATISH =============
async function generateQuestionWithAI(topicName, level) {
    if (isWaitingForAI) {
        return { text: "5 + 3", answer: 8 };
    }
    
    isWaitingForAI = true;
    
    try {
        const prompt = `Siz matematika o'qituvchisisiz. Quyidagi mavzu va darajaga mos SAVOL va JAVOB yarating.
        
Mavzu: ${topicName}
Daraja: ${level}/10 (1-eng oson, 10-eng qiyin)

Qoidalar:
1. Savol faqat shu mavzuga oid bo'lsin
2. Darajaga mos qiyinlikda bo'lsin
3. Javob raqam bo'lsin
4. O'zbek tilida bo'lsin

Formatda javob bering:
SAVOL: [savol matni]
JAVOB: [raqam]`;
        
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        const aiText = data.answer || "";
        
        let questionText = "5 + 3";
        let answer = 8;
        
        const questionMatch = aiText.match(/SAVOL:\s*(.+)/i);
        const answerMatch = aiText.match(/JAVOB:\s*([\d\.\-]+)/i);
        
        if (questionMatch) questionText = questionMatch[1].trim();
        if (answerMatch) answer = parseFloat(answerMatch[1]);
        
        return { text: questionText, answer: answer };
        
    } catch (error) {
        console.error("AI savol yaratishda xato:", error);
        return { text: "5 + 3", answer: 8 };
    } finally {
        isWaitingForAI = false;
    }
}

// ============= ODDIY SAVOL YARATISH (AI ishlamasa) =============
function generateSimpleQuestion(topicName, level) {
    let question = { text: "", answer: 0 };
    
    switch(topicName) {
        case "Butun sonlar":
            let a = randomInt(10, 50 * level);
            let b = randomInt(10, 50 * level);
            question.text = `${a} + ${b}`;
            question.answer = a + b;
            break;
        case "Ildiz":
            let squares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            let idx = Math.min(level - 1, squares.length - 1);
            let val = squares[idx];
            question.text = `√${val}`;
            question.answer = Math.sqrt(val);
            break;
        case "Daraja":
            let base = randomInt(2, Math.min(5, level + 1));
            let exp = randomInt(2, Math.min(4, level));
            question.text = `${base}^${exp}`;
            question.answer = Math.pow(base, exp);
            break;
        default:
            question.text = `${randomInt(10, 50)} + ${randomInt(10, 50)}`;
            question.answer = eval(question.text);
    }
    return question;
}

// ============= SAVOL YARATISH (DARAJAGA QARAB) =============
async function generateQuestionForTopic(topic, userLevel) {
    const topicName = topic.name;
    const level = Math.min(10, Math.max(1, Math.round(userLevel || 1)));
    
    try {
        const aiQuestion = await generateQuestionWithAI(topicName, level);
        return { text: aiQuestion.text, answer: aiQuestion.answer, topic: topicName };
    } catch (error) {
        const simpleQuestion = generateSimpleQuestion(topicName, level);
        return { text: simpleQuestion.text, answer: simpleQuestion.answer, topic: topicName };
    }
}

// ============= TEST SAVOLLARINI YARATISH =============
async function generateTestQuestions() {
    if (!currentUser) return;
    
    currentQuestions = [];
    currentAnswers = [];
    
    showToast("📚 AI savollar tayyorlanmoqda...", "info");
    
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        const userTopicLevel = currentUser.topicLevels[topic.name] || topic.baseLevel;
        
        const question = await generateQuestionForTopic(topic, userTopicLevel);
        currentQuestions.push(question);
        currentAnswers.push(question.answer);
        
        console.log(`${i+1}. ${topic.name} (daraja ${userTopicLevel}): ${question.text}`);
    }
    
    showToast("✅ Savollar tayyor!", "success");
}

// ============= TUSHUNTIRISH (AI dan) =============
async function getAIExplanation(topicName, userAnswer, correctAnswer) {
    try {
        const prompt = `Siz matematika o'qituvchisisiz. O'quvchi ${topicName} mavzusida xato qildi.
Uning javobi: ${userAnswer}, To'g'ri javob: ${correctAnswer}

Quyidagilarni o'zbek tilida tushuntirib bering:
1. Bu mavzu uchun asosiy formula
2. Qanday qilib to'g'ri yechish kerak
3. 1-2 ta misol
4. O'quvchiga maslahat`;

        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        return data.answer || `${topicName} mavzusini qayta o'rganing. Formula: ... Misol: ...`;
    } catch (error) {
        return `${topicName} mavzusini qayta o'rganing. To'g'ri javob: ${correctAnswer}`;
    }
}

// ============= TEST FUNKSIYALARI =============
function startTest() {
    const firstName = document.getElementById("regFirstName").value.trim();
    const lastName = document.getElementById("regLastName").value.trim();
    
    if (!firstName || !lastName) {
        alert("Iltimos, ism va familiyangizni kiriting!");
        return;
    }
    
    currentUser = new UserProfile(firstName, lastName);
    currentUser.saveProgress();
    
    document.getElementById("registrationSection").style.display = "none";
    document.getElementById("mainAppSection").style.display = "block";
    
    currentUser.updateUI();
    updateLessonsPage();
    
    showToast(`👋 Xush kelibsiz, ${firstName}! Sizning darajangiz: ${currentUser.globalLevel}`, "success");
}

async function initTest() {
    if (!currentUser) {
        alert("Iltimos, avval ro'yxatdan o'ting!");
        return;
    }
    
    await generateTestQuestions();
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    timeLeft = 900;
    
    document.getElementById("testStartSection").style.display = "none";
    document.getElementById("testActiveSection").style.display = "block";
    document.getElementById("testResultSection").style.display = "none";
    document.getElementById("totalQuestions").innerText = TOPICS.length;
    document.getElementById("currentLevelBadge").innerText = currentUser.globalLevel;
    
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

async function submitAnswer() {
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
        question: currentQuestions[currentQuestionIndex],
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        topic: currentTopic
    });
    
    if (isCorrect) {
        userScore++;
        currentUser.updateTopicLevel(currentTopic, true);
        showToast("✅ To'g'ri javob! Darajangiz oshdi!", "success");
        currentQuestionIndex++;
        if (currentQuestionIndex >= TOPICS.length) {
            finishTest();
        } else {
            showCurrentQuestion();
        }
    } else {
        currentUser.updateTopicLevel(currentTopic, false);
        showToast("❌ Xato javob! Tushuntirish o'qilyapti...", "info");
        
        const explanation = await getAIExplanation(currentTopic, userAnswer, correctAnswer);
        showExplanationModal(currentTopic, explanation, correctAnswer);
    }
}

function showExplanationModal(topicName, explanation, correctAnswer) {
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="background:#eef2ff;padding:15px;border-radius:12px;margin-bottom:15px;">
                <strong>📘 Mavzu:</strong> ${topicName}<br>
                <strong>✅ To'g'ri javob:</strong> ${correctAnswer}
            </div>
            <div class="formula-box">
                <strong>🤖 AI Tushuntirishi:</strong><br>
                <p>${explanation.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="display:flex;gap:10px;margin-top:20px;">
                <button class="btn btn-primary" onclick="closeModalAndContinue()" style="flex:1;">➡️ Keyingi savol</button>
                <button class="btn btn-outline" onclick="closeLessonModal()" style="flex:1;">📚 Darslar</button>
            </div>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-graduation-cap"></i> ${topicName} - Tushuntirish`;
    
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "flex";
}

function closeModalAndContinue() {
    closeLessonModal();
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function skipQuestion() {
    if (!currentUser || currentQuestionIndex >= TOPICS.length) return;
    
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    userAnswers.push({
        question: currentQuestions[currentQuestionIndex],
        userAnswer: null,
        correctAnswer: currentAnswers[currentQuestionIndex],
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

function showToast(message, type) {
    const oldToasts = document.querySelectorAll('.toast');
    oldToasts.forEach(toast => toast.remove());
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : (type === 'info' ? '#3b82f6' : '#ef4444'));
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:12px;color:white;font-weight:500;z-index:2000;background:${bgColor};animation:slideIn 0.3s ease;`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : (type === 'info' ? 'fa-info-circle' : 'fa-times-circle'))}"></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function finishTest() {
    clearInterval(timerInterval);
    const timeSpent = 900 - timeLeft;
    const weakTopics = [];
    
    userAnswers.forEach(answer => {
        if (!answer.isCorrect && !weakTopics.includes(answer.topic)) {
            weakTopics.push(answer.topic);
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
    
    let resultIcon = percent >= 80 ? "🏆" : (percent >= 60 ? "👍" : (percent >= 40 ? "📚" : "💪"));
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
            <p style="margin-top:15px;">💡 AI sizga ushbu mavzularni o'rganishda yordam beradi!</p>
        `;
    } else {
        weakHtml = `<p class="success-text">🎉 A'lo! Barcha mavzularni o'zlashtirgansiz! Darajangiz ${currentUser.globalLevel} ga yetdi!</p>`;
    }
    
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${timeText}</p>`;
    
    currentUser.updateUI();
    updateStatisticsPage();
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
}

// ============= AI CHAT (ISTALGAN SAVOLGA JAVOB) =============
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
            loadingMessage.querySelector(".message-content").innerHTML = `<p>${aiResponse.replace(/\n/g, '<br>')}</p>`;
            loadingMessage.id = "";
        }
    } catch (error) {
        const loadingMessage = document.getElementById(loadingId);
        if (loadingMessage) {
            loadingMessage.querySelector(".message-content").innerHTML = `<p>❌ Xatolik yuz berdi. Keyinroq urinib ko'ring.</p>`;
            loadingMessage.id = "";
        }
    }
}

function addChatMessage(content, sender, isTemp = false) {
    const messagesContainer = document.getElementById("chatMessages");
    if (!messagesContainer) return "";
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    if (isTemp) messageDiv.id = "temp_" + Date.now();
    messageDiv.innerHTML = `<div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div><div class="message-content">${content}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv.id;
}

// ============= SHAXSIY STATISTIKA =============
function updateStatisticsPage() {
    if (!currentUser) return;
    
    const topics = Object.keys(currentUser.topicLevels);
    const levels = topics.map(t => currentUser.topicLevels[t]);
    
    const topicsChart = document.getElementById("topicsChart");
    if (topicsChart && typeof Chart !== 'undefined') {
        let existingChart = Chart.getChart(topicsChart);
        if (existingChart) existingChart.destroy();
        new Chart(topicsChart, {
            type: 'bar',
            data: {
                labels: topics,
                datasets: [{
                    label: 'Mavzu darajasi (1-10)',
                    data: levels,
                    backgroundColor: '#4f46e5',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                scales: { y: { min: 0, max: 10, title: { display: true, text: 'Daraja' } } }
            }
        });
    }
    
    const recentTests = document.getElementById("recentTestsList");
    if (recentTests) {
        if (currentUser.testHistory.length > 0) {
            recentTests.innerHTML = currentUser.testHistory.slice(0, 10).map((test, idx) => `
                <div style="display:flex; justify-content:space-between; padding:12px; border-bottom:1px solid #e2e8f0;">
                    <span>${new Date(test.date).toLocaleDateString('uz-UZ')}</span>
                    <span style="background:${test.percent>=70?'#10b981':(test.percent>=40?'#f59e0b':'#ef4444')}; padding:4px 12px; border-radius:20px; color:white;">${test.score}/${test.total} (${test.percent}%)</span>
                </div>
            `).join('');
        } else {
            recentTests.innerHTML = `<div style="text-align:center; padding:40px;">Hali test topshirilmagan</div>`;
        }
    }
}

// ============= MAVZU O'RGANISH =============
async function showLesson(topicName) {
    showToast("📚 AI ma'lumot tayyorlamoqda...", "info");
    
    try {
        const prompt = `Siz matematika o'qituvchisisiz. Quyidagi mavzu bo'yicha to'liq dars tayyorlang:

Mavzu: ${topicName}

Quyidagilarni o'zbek tilida yozing:
1. MAVZU NOMI:
2. ASOSIY FORMULA:
3. QOIDALAR (3-4 ta):
4. MISOL (batafsil yechim bilan):
5. AMALIY TOPSHIRIQ:
6. QISQA TUSHUNTIRISH:`;

        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        const content = data.answer || `${topicName} mavzusi bo'yicha ma'lumot topilmadi.`;
        
        const modal = document.getElementById("lessonModal");
        const modalBody = document.getElementById("modalBody");
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="formula-box">
                    <strong>🤖 AI Dars:</strong><br>
                    <div style="margin-top:10px;">${content.replace(/\n/g, '<br>')}</div>
                </div>
                <button class="btn btn-primary" onclick="closeLessonModal()" style="margin-top:20px; width:100%;">Tushunildi</button>
            `;
        }
        document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${topicName}`;
        if (modal) modal.style.display = "flex";
        
    } catch (error) {
        showToast("❌ Xatolik yuz berdi", "error");
    }
}

function closeLessonModal() {
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "none";
}

// ============= SAHIFALAR =============
function switchToPage(pageName) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) targetPage.classList.add("active");
    
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (activeNav) activeNav.classList.add("active");
    
    const titles = { home: "MathAI", test: "Test", statistics: "Statistika", lessons: "Darslar", ai: "AI yordamchi" };
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) pageTitle.innerText = titles[pageName] || "MathAI";
    
    if (pageName === "lessons") updateLessonsPage();
    if (pageName === "statistics" && currentUser) updateStatisticsPage();
    if (pageName === "test" && currentUser) {
        document.getElementById("testStartSection").style.display = "block";
        document.getElementById("testActiveSection").style.display = "none";
        document.getElementById("testResultSection").style.display = "none";
    }
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showLesson('${topic.name}')">
            <i class="fas fa-chalkboard-user"></i>
            <h4>${topic.name}</h4>
            <small>⭐ ${currentUser ? (currentUser.topicLevels[topic.name] || topic.baseLevel) : topic.baseLevel}/10</small>
            <button class="btn btn-outline" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); showLesson('${topic.name}')">📘 AI dars</button>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

function goToAdmin() {
    window.location.href = "admin.html";
}

// ============= RANDOM =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// ============= INIT =============
document.addEventListener('DOMContentLoaded', () => {
    loadDarkMode();
    updateLessonsPage();
    
    const savedUser = localStorage.getItem("mathai_current_user");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUser = new UserProfile(user.firstName, user.lastName);
        document.getElementById("registrationSection").style.display = "none";
        document.getElementById("mainAppSection").style.display = "block";
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
    
    console.log("✅ MathAI (AI adaptiv test) tayyor!");
});
