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

// ============= MAVZU TUSHUNTIRISHLARI (AI YORDAMIDA) =============
const TOPICS_EXPLANATION = {
    "Butun sonlar": "Butun sonlar - manfiy, nol va musbat sonlar. Qo'shish (+), ayirish (-), ko'paytirish (×), bo'lish (÷) amallari bajariladi.",
    "Kasrlar": "Kasr - a/b ko'rinishidagi son. a - surat, b - maxraj. Kasrlarni qo'shish uchun umumiy maxrajga keltiriladi.",
    "Foizlar": "Foiz - yuzdan bir qism. P% = P/100. Foizni topish: (qism/butun) × 100%",
    "Daraja": "aⁿ = a × a × ... × a (n marta). a⁰=1, a⁻ⁿ=1/aⁿ, (aᵐ)ⁿ=aᵐⁿ",
    "Ildiz": "√a = b, agar b² = a. (√a)² = a, √(a×b) = √a × √b",
    "Proportsiya": "a:b = c:d → ad = bc. a/b = c/d → x = (b×c)/a",
    "Bir noma'lumli tenglama": "ax + b = c → x = (c-b)/a. Noma'lumni bir tomonga o'tkazish kerak.",
    "Ikki noma'lumli tenglama": "x+y=S, x-y=D → x=(S+D)/2, y=(S-D)/2. Qo'shish yoki almashtirish usuli.",
    "Kvadrat tenglama": "ax²+bx+c=0 → D=b²-4ac → x=[-b±√D]/2a. D>0→2 ta ildiz, D=0→1 ta ildiz, D<0→ildiz yo'q.",
    "Kvadrat funksiya": "y=ax²+bx+c. Tepa nuqta: x=-b/(2a). a>0→yuqoriga, a<0→pastga ochiladi.",
    "Logarifm (asosiy)": "log_a(b)=c → a^c=b. log(ab)=loga+logb, log(a/b)=loga-logb, log(aⁿ)=n·loga",
    "Logarifmik tenglama": "log_a(x)=b → x=a^b. Aniqlanish sohasi: x>0, a>0, a≠1",
    "Trigonometriya": "sin²α+cos²α=1, sin(30°)=0.5, cos(60°)=0.5, sin(45°)=0.707, cos(45°)=0.707",
    "Trigonometrik tenglama": "sin(x)=a → x=arcsin(a)+360°·k, cos(x)=a → x=arccos(a)+360°·k",
    "Arifmetik progressiya": "a_n = a₁ + (n-1)d, S_n = n(a₁+a_n)/2. d - ayirma",
    "Geometrik progressiya": "a_n = a₁ × q^(n-1), S_n = a₁(qⁿ-1)/(q-1). q - maxraj",
    "Limit": "lim(x→a) f(x)=L. lim(x→0) sin(x)/x=1, lim(x→2)(x²-4)/(x-2)=4",
    "Hosila": "f'(x)=lim(h→0)[f(x+h)-f(x)]/h. (xⁿ)'=n·xⁿ⁻¹, (sin x)'=cos x, (cos x)'=-sin x",
    "Integral": "∫ xⁿ dx = xⁿ⁺¹/(n+1)+C, ∫ sin(x)dx = -cos(x)+C, ∫ cos(x)dx = sin(x)+C",
    "Aniq integral": "∫_a^b f(x)dx = F(b)-F(a). Nyuton-Leybnis formulasi"
};

// ============= RANDOM SON =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============= AI SAVOL YARATISH =============
let isGenerating = false;

async function generateAIQuestion(topicName, level) {
    if (isGenerating) {
        return { text: `5 + 3 = ?`, answer: 8 };
    }
    
    isGenerating = true;
    
    const levelDesc = level <= 2 ? "juda oson" : 
                     level <= 4 ? "oson" : 
                     level <= 6 ? "o'rta" : 
                     level <= 8 ? "qiyin" : "juda qiyin";
    
    const prompt = `Siz matematika o'qituvchisiz. "${topicName}" mavzusiga oid matematik savol yarating.

QIYINLIK DARAJASI: ${level}/10 (${levelDesc})
TALABLAR:
1. Savol faqat ${topicName} mavzusiga oid bo'lsin
2. ${level}/10 darajasiga mos qiyinlikda bo'lsin
3. Javob aniq raqam bo'lsin (butun yoki o'nlik)
4. O'zbek tilida yozilsin

QAYTARISH FORMATI (faqat shu formatda):
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
        
        let questionText = `${topicName} ga oid misol: 5 + 3 = ?`;
        let answer = 8;
        
        const questionMatch = aiText.match(/SAVOL:\s*(.+)/i);
        const answerMatch = aiText.match(/JAVOB:\s*([\d\.\-]+)/i);
        
        if (questionMatch) questionText = questionMatch[1].trim();
        if (answerMatch) answer = parseFloat(answerMatch[1]);
        
        return { text: questionText, answer: answer };
        
    } catch (error) {
        console.error("AI xatosi:", error);
        return { text: `5 + 3 = ?`, answer: 8 };
    } finally {
        isGenerating = false;
    }
}

// ============= AI TUSHUNTIRISH =============
async function getAIExplanation(topicName, userAnswer, correctAnswer, level) {
    const prompt = `Siz matematika o'qituvchisisis. O'quvchi "${topicName}" mavzusida xato qildi.

O'quvchi darajasi: ${level}/10
O'quvchi javobi: ${userAnswer}
To'g'ri javob: ${correctAnswer}

Quyidagilarni o'zbek tilida yozing:

1. 📐 FORMULA: (bu mavzu uchun asosiy formulani yozing)
2. 📝 MISOL: (qadam-baqadam yechim bilan)
3. ✏️ AMALIY TOPSHIRIQ: (o'quvchi mustaqil yechishi uchun misol)
4. 💡 MASLAHAT: (qisqa tavsiya)

Javobingizni tushunarli va batafsil yozing.`;
    
    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        const data = await response.json();
        return data.answer || TOPICS_EXPLANATION[topicName] || `${topicName} mavzusini qayta o'rganing. To'g'ri javob: ${correctAnswer}`;
    } catch (error) {
        return TOPICS_EXPLANATION[topicName] || `${topicName} mavzusini qayta o'rganing. To'g'ri javob: ${correctAnswer}`;
    }
}

// ============= AI DARS O'QISH =============
async function getAILesson(topicName, level) {
    const prompt = `Siz matematika o'qituvchisiz. "${topicName}" mavzusini o'rgating.

O'quvchi darajasi: ${level}/10

Quyidagilarni o'zbek tilida yozing:
1. 📐 MAVZU NOMI VA ASOSIY FORMULA:
2. 📏 QOIDALAR (3-4 ta):
3. 📝 MISOL (batafsil yechim bilan):
4. ✏️ MUSTAQIL TOPSHIRIQ:
5. 💡 XULOSA:

Javobingizni tushunarli va misollar bilan to'ldiring.`;
    
    try {
        const response = await fetch(`${API_BASE}/api/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: prompt })
        });
        const data = await response.json();
        return data.answer || TOPICS_EXPLANATION[topicName] || `${topicName} mavzusini qayta o'rganing.`;
    } catch (error) {
        return TOPICS_EXPLANATION[topicName] || `${topicName} mavzusini qayta o'rganing.`;
    }
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
        this.testHistory = [];
        this.streak = 0;
        this.loadProgress();
    }
    
    loadProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        if (users[this.fullName]) {
            const data = users[this.fullName];
            this.level = data.level || 1;
            this.totalTests = data.totalTests || 0;
            this.testHistory = data.testHistory || [];
            this.streak = data.streak || 0;
        }
    }
    
    saveProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        users[this.fullName] = {
            firstName: this.firstName,
            lastName: this.lastName,
            level: this.level,
            totalTests: this.totalTests,
            testHistory: this.testHistory,
            streak: this.streak
        };
        localStorage.setItem("mathai_users", JSON.stringify(users));
        localStorage.setItem("mathai_current_user", JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName
        }));
        this.updateUI();
    }
    
    updateLevelFromTest(percent) {
        let oldLevel = this.level;
        let increase = 0;
        
        if (percent >= 90) increase = 1.0;
        else if (percent >= 75) increase = 0.75;
        else if (percent >= 65) increase = 0.5;
        else if (percent >= 50) increase = 0.25;
        else increase = 0;
        
        let newLevel = Math.min(10, oldLevel + increase);
        this.level = newLevel;
        
        if (newLevel > oldLevel) {
            this.showLevelUpToast(oldLevel, newLevel);
        }
        return increase;
    }
    
    showLevelUpToast(oldLevel, newLevel) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#10b981,#4f46e5);color:white;padding:20px 40px;border-radius:20px;font-size:24px;font-weight:bold;z-index:10000;text-align:center;`;
        toast.innerHTML = `🎉 <strong>DARAJA OSHDI!</strong> 🎉<br>${oldLevel.toFixed(1)} → ${newLevel.toFixed(1)}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
    
    updateUI() {
        const userNameSpan = document.getElementById("sidebarUserName");
        if (userNameSpan) userNameSpan.innerText = this.firstName;
        const levelSpan = document.getElementById("sidebarUserLevel");
        if (levelSpan) levelSpan.innerHTML = `🎯 Daraja ${this.level.toFixed(1)}`;
        const currentLevelSpan = document.getElementById("currentLevel");
        if (currentLevelSpan) currentLevelSpan.innerText = this.level.toFixed(1);
        const totalTestsSpan = document.getElementById("totalTestsCount");
        if (totalTestsSpan) totalTestsSpan.innerText = this.totalTests;
        
        const avgScore = this.testHistory.length > 0 
            ? Math.round(this.testHistory.reduce((sum, t) => sum + t.percent, 0) / this.testHistory.length) 
            : 0;
        const avgScoreSpan = document.getElementById("avgScorePercent");
        if (avgScoreSpan) avgScoreSpan.innerText = `${avgScore}%`;
        const streakSpan = document.getElementById("streakDays");
        if (streakSpan) streakSpan.innerText = this.streak;
    }
    
    addTestResult(score, total, percent, timeSpent) {
        const levelIncrease = this.updateLevelFromTest(percent);
        this.totalTests++;
        this.testHistory.unshift({
            date: new Date().toISOString(),
            score: score,
            total: total,
            percent: percent,
            levelIncrease: levelIncrease,
            newLevel: this.level,
            timeSpent: timeSpent
        });
        
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

// ============= TEST SAVOLLARINI YARATISH =============
async function generateTestQuestions() {
    if (!currentUser) return;
    
    currentQuestions = [];
    currentAnswers = [];
    let level = Math.min(10, Math.max(1, Math.floor(currentUser.level)));
    
    showToast(`🤖 AI ${currentUser.level.toFixed(1)}-darajaga mos savollar tayyorlamoqda...`, "info");
    
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        const question = await generateAIQuestion(topic, level);
        currentQuestions.push({
            text: question.text,
            answer: question.answer,
            topic: topic,
            level: level
        });
        currentAnswers.push(question.answer);
        
        // API ga haddan tashqari ko'p so'rov yubormaslik uchun
        await new Promise(r => setTimeout(r, 300));
    }
    
    showToast(`✅ ${TOPICS.length} ta savol tayyor! Testni boshlang.`, "success");
}

// ============= REGISTRATSIYA =============
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
    showToast(`👋 Xush kelibsiz, ${firstName}! Sizning darajangiz: ${currentUser.level}`, "success");
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

// ============= TEST FUNKSIYALARI =============
async function initTest() {
    if (!currentUser) {
        alert("Iltimos, avval ro'yxatdan o'ting!");
        switchToPage('home');
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
    document.getElementById("currentLevelBadge").innerText = currentUser.level.toFixed(1);
    
    startTimer();
    showCurrentQuestion();
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) { clearInterval(timerInterval); finishTest(); }
        else { timeLeft--; updateTimerDisplay(); }
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
    if (currentQuestionIndex >= TOPICS.length) { finishTest(); return; }
    const question = currentQuestions[currentQuestionIndex];
    const container = document.getElementById("questionContainer");
    if (container) {
        container.innerHTML = `
            <div class="question-text">
                <strong>${currentQuestionIndex + 1}-savol (${question.topic})</strong><br>
                <span style="font-size:14px; color:#4f46e5;">⭐ Daraja: ${question.level}/10</span><br><br>
                ${question.text}
            </div>
            <input type="number" id="currentAnswer" class="question-input" placeholder="Javobingizni yozing" step="any">
        `;
    }
    document.getElementById("questionCounter").innerText = currentQuestionIndex + 1;
    document.getElementById("explanationBox").style.display = "none";
    setTimeout(() => { const input = document.getElementById("currentAnswer"); if (input) input.focus(); }, 100);
}

async function submitAnswer() {
    const input = document.getElementById("currentAnswer");
    if (!input) return;
    const userAnswer = parseFloat(input.value);
    const correctAnswer = currentAnswers[currentQuestionIndex];
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    const questionLevel = currentQuestions[currentQuestionIndex].level;
    
    if (isNaN(userAnswer)) { alert("Iltimos, javobingizni raqam bilan yozing!"); return; }
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    
    userAnswers.push({ userAnswer: userAnswer, correctAnswer: correctAnswer, isCorrect: isCorrect, topic: currentTopic });
    
    if (isCorrect) {
        userScore++;
        showToast("✅ To'g'ri javob!", "success");
        currentQuestionIndex++;
        if (currentQuestionIndex >= TOPICS.length) finishTest();
        else showCurrentQuestion();
    } else {
        showToast("❌ Xato javob! AI tushuntirish tayyorlamoqda...", "info");
        const explanation = await getAIExplanation(currentTopic, userAnswer, correctAnswer, questionLevel);
        showAIExplanation(currentTopic, explanation, correctAnswer);
    }
}

function showAIExplanation(topicName, explanation, correctAnswer) {
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="background:#fee2e2; padding:15px; border-radius:12px; margin-bottom:15px;">
                <strong>❌ Xato javob!</strong><br>
                <strong>✅ To'g'ri javob:</strong> ${correctAnswer}
            </div>
            <div class="formula-box" style="background:#f0fdf4; padding:15px; border-radius:12px;">
                <strong>🤖 AI TUSHUNTIRISHI:</strong><br>
                <div style="margin-top:10px; line-height:1.6;">${explanation.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn btn-primary" onclick="closeLessonModalAndContinue()" style="flex:1;">➡️ Keyingi savol</button>
                <button class="btn btn-outline" onclick="openAILesson('${topicName}')" style="flex:1;">📚 To'liq dars</button>
            </div>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-graduation-cap"></i> ${topicName} - AI Tushuntirish`;
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "flex";
}

function closeLessonModalAndContinue() {
    closeLessonModal();
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function skipQuestion() {
    if (currentQuestionIndex >= TOPICS.length) return;
    userAnswers.push({ isCorrect: false, topic: currentQuestions[currentQuestionIndex].topic, skipped: true });
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) finishTest();
    else showCurrentQuestion();
}

function finishTest() {
    clearInterval(timerInterval);
    const timeSpent = 900 - timeLeft;
    const percent = Math.round((userScore / TOPICS.length) * 100);
    currentUser.addTestResult(userScore, TOPICS.length, percent, timeSpent);
    
    const results = JSON.parse(localStorage.getItem("mathai_results")) || [];
    results.push({
        id: Date.now(),
        name: currentUser.fullName,
        score: userScore,
        maxScore: TOPICS.length,
        percent: percent,
        levelAfter: currentUser.level,
        timeSpent: timeSpent,
        date: new Date().toLocaleString('uz-UZ')
    });
    localStorage.setItem("mathai_results", JSON.stringify(results));
    
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "block";
    document.getElementById("resultGreeting").innerHTML = `👋 Salom, <strong>${currentUser.firstName}</strong>!`;
    document.getElementById("resultScore").innerText = userScore;
    document.getElementById("resultPercentage").innerHTML = `${percent}%`;
    
    let resultIcon = percent >= 90 ? "🏆" : (percent >= 75 ? "🎉" : (percent >= 65 ? "👍" : "📚"));
    document.getElementById("resultIcon").innerHTML = resultIcon;
    
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p><p>🎯 Yangi darajangiz: <strong>${currentUser.level.toFixed(1)}/10</strong></p>`;
    
    const weakTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.topic);
    let weakHtml = "";
    if (weakTopics.length > 0) {
        weakHtml = `<h4>📖 O'rganishingiz kerak bo'lgan mavzular:</h4><div class="weak-topics-list">${weakTopics.slice(0, 5).map(t => `<span class="weak-topic" onclick="openAILesson('${t}')">${t}</span>`).join('')}</div>`;
    } else {
        weakHtml = `<p>🎉 A'lo! Barcha savollarga to'g'ri javob berdingiz!</p>`;
    }
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    updateStatisticsPage();
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
}

// ============= AI DARS O'QISH (O'RGANISH TUGMASI) =============
async function openAILesson(topicName) {
    showToast(`🤖 "${topicName}" mavzusini tayyorlamoqda...`, "info");
    const level = currentUser ? currentUser.level : 1;
    const lesson = await getAILesson(topicName, level);
    
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; padding:15px; border-radius:12px; margin-bottom:20px; text-align:center;">
                <i class="fas fa-chalkboard-user" style="font-size:40px;"></i>
                <h2>${topicName}</h2>
            </div>
            <div class="formula-box" style="background:#f0fdf4; padding:15px; border-radius:12px;">
                <strong>🤖 AI DARS:</strong><br>
                <div style="margin-top:10px; line-height:1.6;">${lesson.replace(/\n/g, '<br>')}</div>
            </div>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn btn-primary" onclick="closeLessonModal()" style="flex:1;">Tushunildi</button>
                <button class="btn btn-outline" onclick="startPracticeForTopic('${topicName}')" style="flex:1;">✏️ Amaliy mashq</button>
            </div>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${topicName} - AI Dars`;
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "flex";
}

async function startPracticeForTopic(topicName) {
    closeLessonModal();
    const level = currentUser ? Math.floor(currentUser.level) : 1;
    const question = await generateAIQuestion(topicName, level + 1);
    const userAnswer = prompt(`✏️ Amaliy mashq - ${topicName}\n\nSavol: ${question.text}\n\nJavobingizni yozing:`);
    
    if (userAnswer !== null) {
        const userNum = parseFloat(userAnswer);
        const isCorrect = !isNaN(userNum) && Math.abs(userNum - question.answer) < 0.01;
        if (isCorrect) {
            showToast(`✅ To'g'ri javob! "${topicName}" mavzusini yaxshi tushungansiz!`, "success");
        } else {
            showToast(`❌ Xato! To'g'ri javob: ${question.answer}. Qayta o'rganing!`, "error");
            openAILesson(topicName);
        }
    }
}

function showTopicLesson(topicName) {
    openAILesson(topicName);
}

function closeLessonModal() {
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "none";
}

// ============= AI CHAT =============
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
    const chart = document.getElementById("topicsChart");
    if (chart && typeof Chart !== 'undefined') {
        let existing = Chart.getChart(chart);
        if (existing) existing.destroy();
        const testScores = currentUser.testHistory.slice(0, 10).reverse();
        const labels = testScores.map((_, i) => `Test ${i + 1}`);
        const data = testScores.map(t => t.percent);
        new Chart(chart, {
            type: 'line',
            data: { labels: labels, datasets: [{ label: 'Natijalar (%)', data: data, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', fill: true, tension: 0.3 }] },
            options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
        });
    }
    const recent = document.getElementById("recentTestsList");
    if (recent) {
        if (currentUser.testHistory.length > 0) {
            recent.innerHTML = currentUser.testHistory.slice(0, 10).map((t, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #e2e8f0;">
                    <div><strong>#${i + 1}</strong><small style="margin-left:10px;">${new Date(t.date).toLocaleDateString('uz-UZ')}</small></div>
                    <div><span style="background:${t.percent >= 75 ? '#10b981' : (t.percent >= 50 ? '#f59e0b' : '#ef4444')}; padding:4px 12px; border-radius:20px; color:white;">${t.score}/${t.total} (${t.percent}%)</span>${t.levelIncrease > 0 ? `<span style="margin-left:10px; color:#10b981;">+${t.levelIncrease}</span>` : ''}</div>
                </div>
            `).join('');
        } else {
            recent.innerHTML = `<div style="padding:40px; text-align:center;">Hali test topshirilmagan</div>`;
        }
    }
}

// ============= DARSLAR SAHIFASI =============
function updateTopicsGrid() {
    const grid = document.getElementById("topicsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="openAILesson('${topic}')">
            <i class="fas fa-chalkboard-user"></i>
            <h4>${topic}</h4>
            <button class="btn btn-primary" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); openAILesson('${topic}')">📚 AI dars</button>
        </div>
    `).join('');
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="openAILesson('${topic}')">
            <i class="fas fa-book-open"></i>
            <h4>${topic}</h4>
            <button class="btn btn-primary" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); openAILesson('${topic}')">📚 AI dars olish</button>
        </div>
    `).join('');
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
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : (type === 'info' ? '#3b82f6' : '#ef4444'));
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
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
    
    console.log("✅ MathAI (AI darajali test tizimi) tayyor!");
});
