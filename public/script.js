// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin;

// ============= 20 TA MAVZU =============
const TOPICS = [
    { name: "Butun sonlar", difficulty: 1 },
    { name: "Kasrlar", difficulty: 2 },
    { name: "Foizlar", difficulty: 2 },
    { name: "Daraja", difficulty: 3 },
    { name: "Ildiz", difficulty: 3 },
    { name: "Proportsiya", difficulty: 3 },
    { name: "Bir noma'lumli tenglama", difficulty: 4 },
    { name: "Ikki noma'lumli tenglama", difficulty: 5 },
    { name: "Kvadrat tenglama", difficulty: 6 },
    { name: "Kvadrat funksiya", difficulty: 6 },
    { name: "Logarifm (asosiy)", difficulty: 7 },
    { name: "Logarifmik tenglama", difficulty: 8 },
    { name: "Trigonometriya (sin, cos)", difficulty: 7 },
    { name: "Trigonometrik tenglama", difficulty: 8 },
    { name: "Arifmetik progressiya", difficulty: 7 },
    { name: "Geometrik progressiya", difficulty: 8 },
    { name: "Limit", difficulty: 9 },
    { name: "Hosila", difficulty: 9 },
    { name: "Integral (asosiy)", difficulty: 10 },
    { name: "Aniq integral", difficulty: 10 }
];

// ============= MAVZU TUSHUNTIRISHLARI =============
const TOPICS_DATA = {
    "Butun sonlar": { title: "Butun sonlar", formula: "a + b = c, a - b = c", rules: "Qo'shish va ayirish", example: "25 + 17 = 42", practice: "345 + 278 = ?", explanation: "Butun sonlar - manfiy, nol va musbat sonlarni o'z ichiga oladi." },
    "Kasrlar": { title: "Kasrlar", formula: "a/b + c/d = (ad+bc)/bd", rules: "Qo'shish, ayirish, ko'paytirish", example: "1/2 + 1/3 = 5/6", practice: "3/4 + 2/5 = ?", explanation: "Kasr - sonning bo'linma ko'rinishi." },
    "Foizlar": { title: "Foizlar", formula: "P% of X = (P/100) × X", rules: "Foizni hisoblash", example: "20% of 150 = 30", practice: "30% of 200 = ?", explanation: "Foiz - yuzdan bir qism." },
    "Daraja": { title: "Daraja", formula: "aⁿ = a × a × ... × a", rules: "Daraja qoidalari", example: "2³ = 8", practice: "3⁴ = ?", explanation: "Daraja - sonning o'ziga necha marta ko'paytirilishi." },
    "Ildiz": { title: "Kvadrat ildiz", formula: "√a = b, agar b² = a", rules: "Ildiz qoidalari", example: "√64 = 8", practice: "√169 = ?", explanation: "Kvadrat ildiz - o'ziga ko'paytirilganda berilgan sonni beradigan son." },
    "Proportsiya": { title: "Proportsiya", formula: "a/b = c/d → ad = bc", rules: "Proportsiya qoidalari", example: "x/5 = 10/25 → x = 2", practice: "x/8 = 5/20", explanation: "Proportsiya - ikki nisbatning tengligi." },
    "Bir noma'lumli tenglama": { title: "Bir noma'lumli tenglama", formula: "ax + b = c → x = (c-b)/a", rules: "Tenglamani yechish", example: "3x + 5 = 20 → x = 5", practice: "4x + 7 = 31", explanation: "Bir noma'lumli chiziqli tenglama." },
    "Ikki noma'lumli tenglama": { title: "Ikki noma'lumli tenglama", formula: "x + y = S, x - y = D", rules: "Sistema yechimi", example: "x + y = 10, x - y = 4 → x = 7", practice: "x + y = 15, x - y = 5", explanation: "Ikki noma'lumli tenglamalar sistemasi." },
    "Kvadrat tenglama": { title: "Kvadrat tenglama", formula: "ax² + bx + c = 0", rules: "Diskriminant D = b² - 4ac", example: "x² - 5x + 6 = 0 → x = 2,3", practice: "x² - 7x + 12 = 0", explanation: "Kvadrat tenglama - noma'lum ikkinchi darajada." },
    "Kvadrat funksiya": { title: "Kvadrat funksiya", formula: "y = ax² + bx + c", rules: "Tepa nuqta x = -b/(2a)", example: "y = x² - 4x + 3 → tepa (2,-1)", practice: "y = x² - 6x + 5 tepa nuqtasi", explanation: "Kvadrat funksiya - grafigi parabola." },
    "Logarifm (asosiy)": { title: "Logarifm", formula: "log_a(b) = c → a^c = b", rules: "Logarifm qoidalari", example: "log₂(8) = 3", practice: "log₄(64) = ?", explanation: "Logarifm - darajaning teskari funksiyasi." },
    "Logarifmik tenglama": { title: "Logarifmik tenglama", formula: "log_a(x) = b → x = a^b", rules: "Logarifmik tenglamani yechish", example: "log₂(x) = 3 → x = 8", practice: "log₃(x) = 4", explanation: "Logarifmik tenglamalar." },
    "Trigonometriya (sin, cos)": { title: "Trigonometriya", formula: "sin²α + cos²α = 1", rules: "sin, cos, tan", example: "sin(30°) = 0.5", practice: "sin(45°) = ?", explanation: "Trigonometrik funksiyalar." },
    "Trigonometrik tenglama": { title: "Trigonometrik tenglama", formula: "sin(x) = a", rules: "x = arcsin(a)", example: "sin(x) = 0.5 → x = 30°", practice: "cos(x) = 0.5", explanation: "Trigonometrik tenglamalar." },
    "Arifmetik progressiya": { title: "Arifmetik progressiya", formula: "a_n = a₁ + (n-1)d", rules: "Ayirma d", example: "a₁=2, d=3 → a₅=14", practice: "a₁=5, d=4, a₁₀=?", explanation: "Arifmetik progressiya." },
    "Geometrik progressiya": { title: "Geometrik progressiya", formula: "a_n = a₁ × q^(n-1)", rules: "Maxraj q", example: "a₁=3, q=2 → a₄=24", practice: "a₁=2, q=3, a₅=?", explanation: "Geometrik progressiya." },
    "Limit": { title: "Limit", formula: "lim(x→a) f(x) = L", rules: "Limit hisoblash", example: "lim(x→2) (x²-4)/(x-2) = 4", practice: "lim(x→1) (x²-1)/(x-1)", explanation: "Limit - funksiyaning intilgandagi qiymati." },
    "Hosila": { title: "Hosila", formula: "f'(x) = lim(h→0) [f(x+h)-f(x)]/h", rules: "(xⁿ)' = n·xⁿ⁻¹", example: "f(x)=x² → f'(x)=2x", practice: "f(x)=x³ → f'(x)=?", explanation: "Hosila - o'zgarish tezligi." },
    "Integral (asosiy)": { title: "Integral", formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C", rules: "Integral qoidalari", example: "∫ x² dx = x³/3 + C", practice: "∫ x³ dx = ?", explanation: "Integral - hosilaning teskari amali." },
    "Aniq integral": { title: "Aniq integral", formula: "∫_a^b f(x)dx = F(b)-F(a)", rules: "Chegarali integral", example: "∫₀¹ x² dx = 1/3", practice: "∫₀² x dx = ?", explanation: "Aniq integral - yuzani hisoblash." }
};

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
        
        // Hozirgi foydalanuvchini saqlash
        localStorage.setItem("mathai_current_user", JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName
        }));
        
        this.updateUI();
    }
    
    updateTopicMastery(topicName, isCorrect) {
        if (!this.topicMastery[topicName]) {
            this.topicMastery[topicName] = { correct: 0, wrong: 0, level: 1 };
        }
        
        if (isCorrect) {
            this.topicMastery[topicName].correct++;
            this.totalCorrect++;
            // Darajani oshirish (0.3 qo'shiladi)
            let newLevel = this.topicMastery[topicName].level + 0.3;
            this.topicMastery[topicName].level = Math.min(10, newLevel);
        } else {
            this.topicMastery[topicName].wrong++;
            this.totalWrong++;
            // Darajani kamaytirish (0.2 ayiriladi)
            let newLevel = this.topicMastery[topicName].level - 0.2;
            this.topicMastery[topicName].level = Math.max(1, newLevel);
        }
        
        // Umumiy darajani hisoblash
        this.updateGlobalLevel();
        this.saveProgress();
    }
    
    updateGlobalLevel() {
        let totalLevel = 0;
        let count = 0;
        for (let topic in this.topicMastery) {
            totalLevel += this.topicMastery[topic].level;
            count++;
        }
        let newLevel = count > 0 ? Math.round(totalLevel / count) : 1;
        newLevel = Math.min(10, Math.max(1, newLevel));
        
        if (newLevel > this.level) {
            console.log(`🎉 Daraja oshdi! ${this.level} → ${newLevel}`);
            this.showLevelUpToast(this.level, newLevel);
        }
        this.level = newLevel;
    }
    
    showLevelUpToast(oldLevel, newLevel) {
        const toast = document.createElement('div');
        toast.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;padding:20px 40px;border-radius:20px;font-size:24px;font-weight:bold;z-index:10000;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);animation:levelUp 0.5s ease;`;
        toast.innerHTML = `
            <i class="fas fa-star" style="font-size:40px;margin-bottom:10px;"></i><br>
            🎉 DARAJA OSHDI! 🎉<br>
            ${oldLevel} → ${newLevel}
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
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
        
        const accuracy = this.totalCorrect + this.totalWrong > 0 
            ? Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100) 
            : 0;
        const avgScoreSpan = document.getElementById("avgScorePercent");
        if (avgScoreSpan) avgScoreSpan.innerText = `${accuracy}%`;
        
        const streakSpan = document.getElementById("streakDays");
        if (streakSpan) streakSpan.innerText = this.streak;
        
        // Profil ma'lumotlarini bosh sahifada ko'rsatish
        this.updateProfileCard();
    }
    
    updateProfileCard() {
        const profileCard = document.getElementById("userProfileCard");
        if (profileCard) {
            const accuracy = this.totalCorrect + this.totalWrong > 0 
                ? Math.round((this.totalCorrect / (this.totalCorrect + this.totalWrong)) * 100) 
                : 0;
            profileCard.innerHTML = `
                <div style="display:flex;align-items:center;gap:15px;margin-bottom:15px;">
                    <div style="width:60px;height:60px;background:linear-gradient(135deg,#4f46e5,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;">
                        <i class="fas fa-user-graduate" style="font-size:30px;color:white;"></i>
                    </div>
                    <div>
                        <h3 style="margin:0;">${this.firstName} ${this.lastName}</h3>
                        <p style="margin:0;color:#64748b;"><i class="fas fa-chart-line"></i> Daraja: ${this.level}/10</p>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
                    <div><strong>${this.totalTests}</strong><br><small>Testlar</small></div>
                    <div><strong>${this.totalCorrect}</strong><br><small>To'g'ri</small></div>
                    <div><strong>${accuracy}%</strong><br><small>Aniqlik</small></div>
                </div>
                <div style="margin-top:15px;">
                    <div class="progress-bar" style="background:#e2e8f0;height:10px;border-radius:10px;">
                        <div style="width:${(this.level/10)*100}%;background:linear-gradient(90deg,#4f46e5,#7c3aed);height:100%;border-radius:10px;"></div>
                    </div>
                    <p style="text-align:center;margin-top:10px;font-size:12px;">Keyingi daraja: ${this.level + 1}/10</p>
                </div>
            `;
        }
    }
    
    addTestResult(score, total, weakTopics, timeSpent) {
        this.totalTests++;
        const percent = Math.round((score/total)*100);
        this.testHistory.unshift({
            date: new Date().toISOString(),
            score: score,
            total: total,
            percent: percent,
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
        
        // Natijadan keyin darajani qayta hisoblash
        this.updateGlobalLevel();
        this.saveProgress();
    }
}

// ============= YORDAMCHI FUNKSIYALAR =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============= SAVOL YARATISH =============
function generateQuestionForTopic(topic, userLevel) {
    const topicName = topic.name;
    let question = { text: "", answer: 0, topic: topicName };
    
    switch(topicName) {
        case "Butun sonlar":
            let a = randomInt(10, 100);
            let b = randomInt(10, 100);
            question.text = `${a} + ${b}`;
            question.answer = a + b;
            break;
        case "Kasrlar":
            let n1 = randomInt(1, 5);
            let d1 = randomInt(2, 6);
            let n2 = randomInt(1, 5);
            let d2 = randomInt(2, 6);
            question.text = `${n1}/${d1} + ${n2}/${d2}`;
            question.answer = Math.round(((n1*d2 + n2*d1) / (d1*d2)) * 100) / 100;
            break;
        case "Foizlar":
            let total = randomInt(100, 300);
            let percent = randomInt(10, 30);
            question.text = `${percent}% of ${total}`;
            question.answer = (percent * total) / 100;
            break;
        case "Daraja":
            let base = randomInt(2, 4);
            let exp = randomInt(2, 3);
            question.text = `${base}^${exp}`;
            question.answer = Math.pow(base, exp);
            break;
        case "Ildiz":
            let squares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            let val = squares[randomInt(0, squares.length - 1)];
            question.text = `√${val}`;
            question.answer = Math.sqrt(val);
            break;
        case "Proportsiya":
            let a1 = randomInt(2, 5);
            let b1 = randomInt(2, 5);
            let c1 = randomInt(2, 5);
            question.text = `${a1} : ${b1} = ${c1} : x`;
            question.answer = (b1 * c1) / a1;
            break;
        case "Bir noma'lumli tenglama":
            let a2 = randomInt(2, 4);
            let b2 = randomInt(3, 8);
            let c2 = randomInt(15, 25);
            question.text = `${a2}x + ${b2} = ${c2}`;
            question.answer = (c2 - b2) / a2;
            break;
        case "Ikki noma'lumli tenglama":
            let xVal = randomInt(2, 5);
            let yVal = randomInt(2, 5);
            question.text = `x + y = ${xVal + yVal}, x - y = ${xVal - yVal} (x = ?)`;
            question.answer = xVal;
            break;
        case "Kvadrat tenglama":
            let r1 = randomInt(2, 3);
            let r2 = randomInt(3, 4);
            question.text = `x² - ${r1 + r2}x + ${r1 * r2} = 0 (kichik ildiz)`;
            question.answer = Math.min(r1, r2);
            break;
        case "Logarifm (asosiy)":
            let lb = randomInt(2, 3);
            let lp = randomInt(2, 3);
            question.text = `log${lb}(${Math.pow(lb, lp)})`;
            question.answer = lp;
            break;
        case "Logarifmik tenglama":
            let lb2 = randomInt(2, 3);
            let lp2 = randomInt(2, 3);
            question.text = `log${lb2}(x) = ${lp2}`;
            question.answer = Math.pow(lb2, lp2);
            break;
        case "Trigonometriya (sin, cos)":
            let angles = [30, 45, 60];
            let angle = angles[randomInt(0, angles.length - 1)];
            let rad = angle * Math.PI / 180;
            question.text = `sin(${angle}°)`;
            question.answer = Math.round(Math.sin(rad) * 100) / 100;
            break;
        case "Arifmetik progressiya":
            let a1_ap = randomInt(2, 4);
            let d = randomInt(2, 3);
            let n = randomInt(4, 5);
            question.text = `a₁ = ${a1_ap}, d = ${d}, a_${n} = ?`;
            question.answer = a1_ap + (n - 1) * d;
            break;
        case "Geometrik progressiya":
            let a1_gp = randomInt(2, 3);
            let q = randomInt(2, 2);
            let n_gp = randomInt(3, 4);
            question.text = `a₁ = ${a1_gp}, q = ${q}, a_${n_gp} = ?`;
            question.answer = a1_gp * Math.pow(q, n_gp - 1);
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
    for (let i = 0; i < TOPICS.length; i++) {
        let question = generateQuestionForTopic(TOPICS[i], currentUser ? currentUser.level : 1);
        currentQuestions.push(question);
        currentAnswers.push(question.answer);
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
    
    // Yangi foydalanuvchi yaratish yoki mavjudini yuklash
    currentUser = new UserProfile(firstName, lastName);
    currentUser.saveProgress();
    
    // Registratsiya oynasini yashirish
    document.getElementById("registrationSection").style.display = "none";
    document.getElementById("mainAppSection").style.display = "block";
    
    // Profil kartasini ko'rsatish
    currentUser.updateProfileCard();
    currentUser.updateUI();
    
    showToast(`👋 Xush kelibsiz, ${firstName}! Darajangiz: ${currentUser.level}`, "success");
}

function initTest() {
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
    container.innerHTML = `
        <div class="question-text">
            <strong>${currentQuestionIndex + 1}-savol (${question.topic})</strong><br>
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

function submitAnswer() {
    const input = document.getElementById("currentAnswer");
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
        currentUser.updateTopicMastery(currentTopic, true);
        showToast("✅ To'g'ri javob!", "success");
    } else {
        currentUser.updateTopicMastery(currentTopic, false);
        showToast(`❌ Xato! To'g'ri javob: ${correctAnswer}`, "error");
        showLesson(currentTopic);
    }
    
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
    currentUser.updateTopicMastery(currentTopic, false);
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    showLesson(currentTopic);
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
    toast.className = 'toast';
    const bgColor = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#ef4444');
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:12px;color:white;font-weight:500;z-index:2000;background:${bgColor};animation:slideIn 0.3s ease;`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle')}"></i> ${message}`;
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
        weakHtml = `<h4>📖 O'rganishingiz kerak bo'lgan mavzular:</h4><div class="weak-topics-list">${weakTopics.map(t => `<span class="weak-topic" onclick="showLesson('${t}')">${t}</span>`).join('')}</div>`;
    } else {
        weakHtml = `<p class="success-text">🎉 A'lo! Barcha mavzularni o'zlashtirgansiz!</p>`;
    }
    document.getElementById("weakTopicsList").innerHTML = weakHtml;
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${timeText}</p>`;
    
    // Darajani yangilash
    currentUser.updateUI();
    updateStatisticsPage();
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
}

// ============= SHAXSIY STATISTIKA =============
function updateStatisticsPage() {
    if (!currentUser) return;
    
    // Mavzular bo'yicha o'zlashtirish
    const topics = Object.keys(currentUser.topicMastery);
    const masteryLevels = topics.map(t => Math.round(currentUser.topicMastery[t].level * 10));
    
    const topicsChart = document.getElementById("topicsChart");
    if (topicsChart && typeof Chart !== 'undefined') {
        let existingChart = Chart.getChart(topicsChart);
        if (existingChart) existingChart.destroy();
        
        new Chart(topicsChart, {
            type: 'bar',
            data: {
                labels: topics,
                datasets: [{
                    label: 'Sizning o\'zlashtirishingiz (%)',
                    data: masteryLevels,
                    backgroundColor: '#4f46e5',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: { y: { min: 0, max: 100, title: { display: true, text: 'O\'zlashtirish %' } } }
            }
        });
    }
    
    // So'nggi testlar
    const recentTests = document.getElementById("recentTestsList");
    if (recentTests) {
        if (currentUser.testHistory.length > 0) {
            recentTests.innerHTML = currentUser.testHistory.slice(0, 10).map((test, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #e2e8f0;">
                    <div><strong>#${idx + 1}</strong> <small>${new Date(test.date).toLocaleDateString('uz-UZ')}</small></div>
                    <div><span style="background:${test.percent >= 70 ? '#10b981' : (test.percent >= 40 ? '#f59e0b' : '#ef4444')}; padding:4px 12px; border-radius:20px; color:white;">${test.score}/${test.total} (${test.percent}%)</span></div>
                </div>
            `).join('');
        } else {
            recentTests.innerHTML = `<div style="text-align:center; padding:40px;">Hali hech qanday test topshirilmagan</div>`;
        }
    }
}

// ============= MAVZU O'RGANISH =============
function showLesson(topicName) {
    const topic = TOPICS_DATA[topicName];
    if (!topic) return;
    
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="formula-box"><strong>📐 Formula:</strong><br>${topic.formula}</div>
            <div class="formula-box"><strong>📏 Qoidalar:</strong><br>${topic.rules}</div>
            <div class="example-box"><strong>📝 Misol:</strong><br>${topic.example}</div>
            <div class="example-box"><strong>✏️ Amaliy topshiriq:</strong><br>${topic.practice}</div>
            <div><strong>📖 Batafsil:</strong><br><p>${topic.explanation}</p></div>
            <button class="btn btn-primary" onclick="closeLessonModal()" style="margin-top:20px; width:100%;">Tushunildi</button>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${topic.title}`;
    if (modal) modal.style.display = "flex";
}

function closeLessonModal() {
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "none";
}

function closeExplanation() {
    document.getElementById("explanationBox").style.display = "none";
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
            loadingMessage.querySelector(".message-content").innerHTML = `<p>${aiResponse.replace(/\n/g, '<br>')}</p>`;
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
    if (!messagesContainer) return "";
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    if (isTemp) messageDiv.id = "temp_" + Date.now();
    messageDiv.innerHTML = `<div class="message-avatar"><i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div><div class="message-content">${content}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv.id;
}

// ============= SAHIFALAR =============
function switchToPage(pageName) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) targetPage.classList.add("active");
    
    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (activeNav) activeNav.classList.add("active");
    
    const titles = { home: "MathAI", test: "Test topshirish", statistics: "Mening statistikam", lessons: "Darslar", ai: "AI yordamchi" };
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) pageTitle.innerText = titles[pageName] || "MathAI";
    
    if (pageName === "lessons") updateLessonsPage();
    if (pageName === "statistics" && currentUser) updateStatisticsPage();
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showLesson('${topic.name}')">
            <i class="fas fa-chalkboard-user"></i>
            <h4>${topic.name}</h4>
            <small>⭐⭐⭐⭐⭐ ${topic.difficulty}/10</small>
            <button class="btn btn-outline" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); showLesson('${topic.name}')">📘 O'rganish</button>
        </div>
    `).join('');
}

function goToAdmin() {
    const password = prompt("Admin parolini kiriting:");
    if (password === "admin123") window.location.href = "admin.html";
    else alert("❌ Parol xato!");
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// ============= SAHIFANI YUKLASH =============
document.addEventListener('DOMContentLoaded', () => {
    loadDarkMode();
    updateLessonsPage();
    
    // Oldingi foydalanuvchini tekshirish
    const savedUser = localStorage.getItem("mathai_current_user");
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUser = new UserProfile(user.firstName, user.lastName);
        document.getElementById("registrationSection").style.display = "none";
        document.getElementById("mainAppSection").style.display = "block";
        currentUser.updateProfileCard();
        currentUser.updateUI();
        updateStatisticsPage();
    }
    
    // Navigatsiya
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) switchToPage(page);
        });
    });
    
    // Dark mode tugmasi
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", toggleDarkMode);
    
    // Sidebar menyu
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle && sidebar) menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    
    // Modal yopish
    window.onclick = (e) => {
        const modal = document.getElementById("lessonModal");
        if (e.target === modal) closeLessonModal();
    };
    
    console.log("✅ MathAI tayyor!");
});
