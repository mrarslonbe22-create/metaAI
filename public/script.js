// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin;

// ============= 20 TA MAVZU =============
const TOPICS = [
    "Butun sonlar", "Kasrlar", "Foizlar", "Daraja", "Ildiz",
    "Proportsiya", "Bir noma'lumli tenglama", "Ikki noma'lumli tenglama",
    "Kvadrat tenglama", "Kvadrat funksiya", "Logarifm (asosiy)",
    "Logarifmik tenglama", "Trigonometriya", "Trigonometrik tenglama",
    "Arifmetik progressiya", "Geometrik progressiya", "Limit",
    "Hosila", "Integral", "Aniq integral"
];

// ============= MAVZU TUSHUNTIRISHLARI (BAZA) =============
const TOPICS_BASE = {
    "Butun sonlar": { formula: "a + b, a - b, a × b, a ÷ b", rules: "Qo'shish, ayirish, ko'paytirish, bo'lish" },
    "Kasrlar": { formula: "a/b + c/d = (ad+bc)/bd", rules: "Surat va maxraj" },
    "Foizlar": { formula: "P% = P/100, P% of X = (P/100)×X", rules: "Foizni kasrga aylantirish" },
    "Daraja": { formula: "aⁿ = a×a×...×a", rules: "aᵐ×aⁿ = aᵐ⁺ⁿ, (aᵐ)ⁿ = aᵐⁿ" },
    "Ildiz": { formula: "√a = b → b² = a", rules: "√(a×b) = √a × √b" },
    "Proportsiya": { formula: "a/b = c/d → ad = bc", rules: "a:b = c:d" },
    "Bir noma'lumli tenglama": { formula: "ax + b = c → x = (c-b)/a", rules: "Noma'lumni bir tomonga o'tkazish" },
    "Ikki noma'lumli tenglama": { formula: "x+y=S, x-y=D → x=(S+D)/2", rules: "Qo'shish usuli" },
    "Kvadrat tenglama": { formula: "ax²+bx+c=0 → x=[-b±√(b²-4ac)]/2a", rules: "Diskriminant D=b²-4ac" },
    "Kvadrat funksiya": { formula: "y=ax²+bx+c", rules: "Tepa nuqta x=-b/(2a)" },
    "Logarifm (asosiy)": { formula: "log_a(b)=c → a^c=b", rules: "log(ab)=loga+logb" },
    "Logarifmik tenglama": { formula: "log_a(x)=b → x=a^b", rules: "Aniqlanish sohasi x>0" },
    "Trigonometriya": { formula: "sin²α+cos²α=1", rules: "sin(30°)=0.5, cos(60°)=0.5" },
    "Trigonometrik tenglama": { formula: "sin(x)=a → x=arcsin(a)", rules: "Davriylik" },
    "Arifmetik progressiya": { formula: "a_n=a₁+(n-1)d", rules: "d=a₂-a₁" },
    "Geometrik progressiya": { formula: "a_n=a₁×q^(n-1)", rules: "q=a₂/a₁" },
    "Limit": { formula: "lim(x→a) f(x)=L", rules: "lim(x→a) (x²-a²)/(x-a)=2a" },
    "Hosila": { formula: "f'(x)=lim(h→0)[f(x+h)-f(x)]/h", rules: "(xⁿ)'=n·xⁿ⁻¹" },
    "Integral": { formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1)+C", rules: "∫ₐᵇ f(x)dx = F(b)-F(a)" },
    "Aniq integral": { formula: "∫ₐᵇ f(x)dx = F(b)-F(a)", rules: "Yuzani hisoblash" }
};

// ============= FOYDALANUVCHI PROFILI =============
let currentUser = null;
let currentQuestions = [];      // { text, answer, topic, level }
let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];
let timerInterval = null;
let timeLeft = 900;
let isGenerating = false;

class UserProfile {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${firstName} ${lastName}`;
        this.level = 1;
        this.totalTests = 0;
        this.totalCorrect = 0;
        this.totalWrong = 0;
        this.topicLevels = {};      // Har bir mavzu uchun daraja (1-10)
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
            // To'g'ri javob: daraja oshadi
            let increase = 0.3 + (Math.random() * 0.2);
            this.topicLevels[topicName] = Math.min(10, current + increase);
            this.totalCorrect++;
        } else {
            // Xato javob: daraja kamayadi
            let decrease = 0.2 + (Math.random() * 0.1);
            this.topicLevels[topicName] = Math.max(1, current - decrease);
            this.totalWrong++;
        }
        
        // Global darajani hisoblash
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
        toast.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#10b981,#4f46e5);color:white;padding:20px 40px;border-radius:20px;font-size:24px;font-weight:bold;z-index:10000;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);`;
        toast.innerHTML = `🎉 <strong>DARAJANGIZ OSDI!</strong> 🎉<br>${oldLevel} → ${newLevel}`;
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
            timeSpent: timeSpent,
            topicLevels: JSON.parse(JSON.stringify(this.topicLevels))
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

// ============= AI SAVOL YARATISH =============
async function generateAIQuestion(topicName, level) {
    if (isGenerating) {
        return { text: "5 + 3", answer: 8, level: level };
    }
    
    isGenerating = true;
    
    const levelNames = {
        1: "juda oson (boshlang'ich)",
        2: "oson",
        3: "o'rta oson",
        4: "o'rta",
        5: "o'rta qiyin",
        6: "qiyinroq",
        7: "qiyin",
        8: "juda qiyin",
        9: "murakkab",
        10: "eng murakkab (olimpia darajasi)"
    };
    
    const prompt = `Siz matematika o'qituvchisisiz. Quyidagi talablar asosida matematik savol yarating.

MAVZU: ${topicName}
QIYINLIK DARAJASI: ${level}/10 (${levelNames[level] || 'o\'rta'})

TALABLAR:
1. Savol faqat "${topicName}" mavzusiga oid bo'lsin
2. Darajaga mos qiyinlikda bo'lsin (${level}/10)
3. Javobi aniq raqam bo'lsin (butun yoki o'nlik)
4. O'zbek tilida yozilsin
5. Formulalarni to'g'ri yozing

QAYTARISH FORMATI (faqat shu formatda javob bering):
SAVOL: [savol matni]
JAVOB: [raqam]`;

    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        const aiText = data.answer || "";
        
        let questionText = `${topicName} ga oid misol: 5 + 3`;
        let answer = 8;
        
        const questionMatch = aiText.match(/SAVOL:\s*(.+)/i);
        const answerMatch = aiText.match(/JAVOB:\s*([\d\.\-]+)/i);
        
        if (questionMatch) questionText = questionMatch[1].trim();
        if (answerMatch) answer = parseFloat(answerMatch[1]);
        
        return { text: questionText, answer: answer, level: level };
        
    } catch (error) {
        console.error("AI savol yaratishda xato:", error);
        return { text: `${topicName} ga oid misol: 5 + 3`, answer: 8, level: level };
    } finally {
        isGenerating = false;
    }
}

// ============= AI TUSHUNTIRISH YARATISH =============
async function getAIExplanation(topicName, userAnswer, correctAnswer, level) {
    const prompt = `Siz matematika o'qituvchisisiz. O'quvchi ${topicName} mavzusida xato qildi.

O'quvchi darajasi: ${level}/10
O'quvchi javobi: ${userAnswer}
To'g'ri javob: ${correctAnswer}

Quyidagilarni o'zbek tilida yozing (batafsil va tushunarli):

1. BU MAVZU UCHUN ASOSIY FORMULA:
2. QANDAY QILIB YECHISH KERAK (qadam-baqadam):
3. YANA BIRTA MISOL:
4. O'QUVCHIGA MASLAHAT:

JAVOBINGIZNI MATEMATIK FORMULALAR BILAN TO'LDIRING.`;

    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        return data.answer || `${topicName} mavzusini qayta o'rganing. To'g'ri javob: ${correctAnswer}`;
        
    } catch (error) {
        return `${topicName} mavzusi bo'yicha formulalar: ${TOPICS_BASE[topicName]?.formula || "Asosiy formulani o'rganing"}\nTo'g'ri javob: ${correctAnswer}`;
    }
}

// ============= SAVOLLARNI YARATISH =============
async function generateTestQuestions() {
    if (!currentUser) return [];
    
    showToast("🤖 AI yangi savollar tayyorlamoqda...", "info");
    
    const questions = [];
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        const userLevel = currentUser.topicLevels[topic] || 1;
        
        // 1-10 oralig'ida daraja (qiyinlik)
        const difficulty = Math.min(10, Math.max(1, Math.round(userLevel)));
        
        const question = await generateAIQuestion(topic, difficulty);
        questions.push({
            text: question.text,
            answer: question.answer,
            topic: topic,
            difficulty: difficulty,
            userLevel: userLevel
        });
        
        console.log(`📚 ${i+1}. ${topic} (daraja ${userLevel.toFixed(1)}) → savol yaratildi`);
        
        // API ga haddan tashqari ko'p so'rov yubormaslik uchun kichik kutish
        await new Promise(r => setTimeout(r, 500));
    }
    
    showToast("✅ Savollar tayyor! Testni boshlang.", "success");
    return questions;
}

// ============= TEST FUNKSIYALARI =============
function registerUser() {
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
    showToast(`👋 Xush kelibsiz, ${firstName}! Sizning boshlang'ich darajangiz: ${currentUser.level}`, "success");
}

async function initTest() {
    if (!currentUser) {
        alert("Iltimos, avval ro'yxatdan o'ting!");
        switchToPage('home');
        return;
    }
    
    // AI dan yangi savollar yaratish
    currentQuestions = await generateTestQuestions();
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
                <span style="font-size: 20px; color: #4f46e5;">⭐ Daraja: ${question.difficulty}/10</span><br><br>
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
    const question = currentQuestions[currentQuestionIndex];
    const correctAnswer = question.answer;
    const currentTopic = question.topic;
    const questionDifficulty = question.difficulty;
    
    if (isNaN(userAnswer)) {
        alert("Iltimos, javobingizni raqam bilan yozing!");
        return;
    }
    
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    userAnswers.push({
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
        topic: currentTopic,
        difficulty: questionDifficulty
    });
    
    if (isCorrect) {
        userScore++;
        currentUser.updateTopicLevel(currentTopic, true);
        showToast(`✅ To'g'ri javob! Darajangiz oshdi! (${currentTopic})`, "success");
        currentQuestionIndex++;
        if (currentQuestionIndex >= TOPICS.length) {
            finishTest();
        } else {
            showCurrentQuestion();
        }
    } else {
        currentUser.updateTopicLevel(currentTopic, false);
        showToast(`❌ Xato javob! Tushuntirish o'qilyapti...`, "info");
        
        // AI dan tushuntirish olish
        const explanation = await getAIExplanation(currentTopic, userAnswer, correctAnswer, questionDifficulty);
        showExplanationModal(currentTopic, explanation, correctAnswer);
        
        currentQuestionIndex++;
        if (currentQuestionIndex >= TOPICS.length) {
            finishTest();
        } else {
            // Tushuntirish yopilgandan keyin keyingi savolga o'tish uchun
            window.nextQuestionAfterExplain = () => {
                showCurrentQuestion();
            };
        }
    }
}

function showExplanationModal(topicName, explanation, correctAnswer) {
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="background: #fee2e2; padding: 15px; border-radius: 12px; margin-bottom: 15px;">
                <strong>❌ Xato javob!</strong><br>
                <strong>✅ To'g'ri javob:</strong> ${correctAnswer}
            </div>
            <div class="formula-box">
                <strong>🤖 AI TUSHUNTIRISHI:</strong><br>
                <div style="margin-top: 10px; line-height: 1.6;">${explanation.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-primary" onclick="closeExplanationModalAndContinue()" style="flex: 1;">➡️ Keyingi savol</button>
                <button class="btn btn-outline" onclick="closeLessonModal()" style="flex: 1;">📚 Darslar</button>
            </div>
        `;
    }
    
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-graduation-cap"></i> ${topicName} - Tushuntirish`;
    
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "flex";
}

function closeExplanationModalAndContinue() {
    closeLessonModal();
    if (typeof window.nextQuestionAfterExplain === 'function') {
        window.nextQuestionAfterExplain();
        delete window.nextQuestionAfterExplain;
    } else {
        if (currentQuestionIndex < TOPICS.length) {
            showCurrentQuestion();
        } else {
            finishTest();
        }
    }
}

function skipQuestion() {
    if (currentQuestionIndex >= TOPICS.length) return;
    
    const question = currentQuestions[currentQuestionIndex];
    userAnswers.push({
        isCorrect: false,
        topic: question.topic,
        skipped: true,
        difficulty: question.difficulty
    });
    
    currentUser.updateTopicLevel(question.topic, false);
    showToast(`⏭ "${question.topic}" savoli o'tkazib yuborildi`, "warning");
    
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
    userAnswers.forEach(a => {
        if (!a.isCorrect && !weakTopics.includes(a.topic)) weakTopics.push(a.topic);
    });
    
    currentUser.addTestResult(userScore, TOPICS.length, weakTopics, timeSpent);
    
    // Natijalarni saqlash
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
    
    // Test interfeysini yashirish
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "block";
    
    const percent = Math.round((userScore / TOPICS.length) * 100);
    document.getElementById("resultGreeting").innerHTML = `👋 Salom, <strong>${currentUser.firstName}</strong>!`;
    document.getElementById("resultScore").innerText = userScore;
    document.getElementById("resultPercentage").innerHTML = `${percent}%`;
    
    const resultIcon = percent >= 80 ? "🏆" : (percent >= 60 ? "🎉" : (percent >= 40 ? "📚" : "💪"));
    document.getElementById("resultIcon").innerHTML = resultIcon;
    
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p>`;
    
    let weakHtml = "";
    if (weakTopics.length > 0) {
        weakHtml = `
            <h4>📖 O'rganishingiz kerak bo'lgan mavzular:</h4>
            <div class="weak-topics-list">
                ${weakTopics.map(t => `<span class="weak-topic" onclick="showAILesson('${t}')">${t}</span>`).join('')}
            </div>
            <p style="margin-top: 15px;">💡 AI sizga ushbu mavzularni o'rganishda yordam beradi!</p>
        `;
    } else {
        weakHtml = `<p class="success-text">🎉 A'lo! Barcha mavzularni o'zlashtirgansiz! Darajangiz <strong>${currentUser.level}</strong> ga yetdi!</p>`;
    }
    
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    updateStatisticsPage();
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
}

// ============= AI DARS (MAVZU O'RGANISH) =============
async function showAILesson(topicName) {
    showToast(`🤖 AI "${topicName}" mavzusini tayyorlamoqda...`, "info");
    
    const userLevel = currentUser ? (currentUser.topicLevels[topicName] || 1) : 1;
    
    const prompt = `Siz matematika o'qituvchisisiz. "${topicName}" mavzusi bo'yicha to'liq dars tayyorlang.

O'quvchi darajasi: ${userLevel.toFixed(1)}/10

Quyidagilarni o'zbek tilida yozing (batafsil va tushunarli):

1. MAVZU NOMI:
2. ASOSIY FORMULA(LAR):
3. MUHIM QOIDALAR (3-4 ta):
4. MISOL (qadam-baqadam yechim bilan):
5. AMALIY TOPSHIRIQ (o'quvchi mustaqil yechishi uchun):
6. QISQA XULOSA:

JAVOBINGIZNI FORMULALAR VA MISOLLAR BILAN TO'LDIRING.`;

    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        
        const data = await response.json();
        const lesson = data.answer || `${topicName} mavzusi bo'yicha ma'lumot topilmadi.`;
        
        const modal = document.getElementById("lessonModal");
        const modalBody = document.getElementById("modalBody");
        
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="formula-box">
                    <strong>🤖 AI DARS (${topicName})</strong>
                    <div style="margin-top: 15px; line-height: 1.6;">${lesson.replace(/\n/g, '<br>')}</div>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="closeLessonModal()" style="flex: 1;">Tushunildi</button>
                    <button class="btn btn-outline" onclick="startPracticeForTopic('${topicName}')" style="flex: 1;">✏️ Amaliy mashq</button>
                </div>
            `;
        }
        
        document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${topicName} - AI dars`;
        
        const modal = document.getElementById("lessonModal");
        if (modal) modal.style.display = "flex";
        
    } catch (error) {
        showToast("❌ AI dars tayyorlashda xatolik", "error");
    }
}

async function startPracticeForTopic(topicName) {
    closeLessonModal();
    showToast(`🤖 "${topicName}" mavzusidan amaliy savol tayyorlanmoqda...`, "info");
    
    const userLevel = currentUser ? (currentUser.topicLevels[topicName] || 1) : 1;
    const question = await generateAIQuestion(topicName, Math.min(10, userLevel + 1));
    
    const userAnswer = prompt(`✏️ Amaliy mashq\n\nMavzu: ${topicName}\nSavol: ${question.text}\n\nJavobingizni yozing:`);
    
    if (userAnswer !== null) {
        const userNum = parseFloat(userAnswer);
        const isCorrect = !isNaN(userNum) && Math.abs(userNum - question.answer) < 0.01;
        
        if (isCorrect) {
            showToast(`✅ To'g'ri javob! "${topicName}" mavzusini yaxshi bilasiz!`, "success");
            currentUser.updateTopicLevel(topicName, true);
        } else {
            showToast(`❌ Xato! To'g'ri javob: ${question.answer}. Davom eting!`, "error");
            currentUser.updateTopicLevel(topicName, false);
            const explanation = await getAIExplanation(topicName, userNum, question.answer, userLevel);
            showExplanationModal(topicName, explanation, question.answer);
        }
        updateTopicsGrid();
        updateStatisticsPage();
    }
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
            body: JSON.stringify({ 
                question: `Siz matematika o'qituvchisisiz. O'zbek tilida javob bering.\n\nSavol: ${message}` 
            })
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
    const container = document.getElementById("chatMessages");
    if (!container) return "";
    
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    if (isTemp) div.id = "temp_" + Date.now();
    
    div.innerHTML = `
        <div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div>
        <div class="message-content">${content}</div>
    `;
    
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
            data: {
                labels: topics,
                datasets: [{
                    label: 'Mavzu bo\'yicha darajangiz (1-10)',
                    data: levels,
                    backgroundColor: '#4f46e5',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { y: { min: 0, max: 10, title: { display: true, text: 'Daraja' } } },
                plugins: { legend: { position: 'top' } }
            }
        });
    }
    
    const recentTests = document.getElementById("recentTestsList");
    if (recentTests) {
        if (currentUser.testHistory.length > 0) {
            recentTests.innerHTML = currentUser.testHistory.slice(0, 10).map((test, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e2e8f0;">
                    <div>
                        <strong>#${idx + 1}</strong>
                        <small style="color: #64748b; margin-left: 10px;">${new Date(test.date).toLocaleDateString('uz-UZ')}</small>
                    </div>
                    <div>
                        <span style="background: ${test.percent >= 70 ? '#10b981' : (test.percent >= 40 ? '#f59e0b' : '#ef4444')}; padding: 4px 12px; border-radius: 20px; color: white; font-weight: bold;">
                            ${test.score}/${test.total} (${test.percent}%)
                        </span>
                    </div>
                </div>
            `).join('');
        } else {
            recentTests.innerHTML = `<div style="text-align: center; padding: 40px;">Hali hech qanday test topshirilmagan</div>`;
        }
    }
}

// ============= DARSLAR SAHIFASI =============
function updateTopicsGrid() {
    const grid = document.getElementById("topicsGrid");
    if (!grid) return;
    
    grid.innerHTML = TOPICS.map(topic => {
        const userLevel = currentUser ? (currentUser.topicLevels[topic] || 1).toFixed(1) : 1;
        const levelPercent = (userLevel / 10) * 100;
        
        return `
            <div class="topic-card" onclick="showAILesson('${topic}')">
                <i class="fas fa-chalkboard-user"></i>
                <h4>${topic}</h4>
                <div style="margin: 10px 0;">
                    <div class="progress-bar" style="height: 6px;">
                        <div style="width: ${levelPercent}%; height: 100%; background: linear-gradient(90deg, #4f46e5, #10b981); border-radius: 10px;"></div>
                    </div>
                    <small>Daraja: ${userLevel}/10</small>
                </div>
                <button class="btn btn-outline" style="margin-top: 10px; width: 100%;" onclick="event.stopPropagation(); showAILesson('${topic}')">
                    📘 AI dars olish
                </button>
            </div>
        `;
    }).join('');
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showAILesson('${topic}')">
            <i class="fas fa-book-open"></i>
            <h4>${topic}</h4>
            <button class="btn btn-primary" style="margin-top: 12px; width: 100%;" onclick="event.stopPropagation(); showAILesson('${topic}')">
                🤖 AI dars
            </button>
        </div>
    `).join('');
}

function showLesson(topicName) {
    showAILesson(topicName);
}

function closeLessonModal() {
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "none";
}

// ============= SAHIFALAR =============
function switchToPage(pageName) {
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

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

function showToast(message, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    const bgColor = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : (type === 'info' ? '#3b82f6' : '#ef4444'));
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:12px;color:white;font-weight:500;z-index:2000;background:${bgColor};animation:slideIn 0.3s ease;`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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
    
    console.log("✅ MathAI (AI adaptiv test) tayyor!");
    showToast("🧠 MathAI ishga tushdi! AI yordamida matematikani o'rganing.", "info");
});
