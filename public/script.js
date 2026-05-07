// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin;

// ============= 20 TA MAVZU =============
const TOPICS = [
    "Butun sonlar", "Kasrlar", "Foizlar", "Daraja", "Ildiz",
    "Proportsiya", "Bir noma'lumli tenglama", "Ikki noma'lumli tenglama",
    "Kvadrat tenglama", "Kvadrat funksiya", "Logarifm (asosiy)",
    "Logarifmik tenglama", "Trigonometriya", "Trigonometrik tenglama",
    "Arifmetik progressiya", "Geometrik progressiya", "Limit",
    "Hosila", "Integral (asosiy)", "Aniq integral"
];

// ============= RANDOM SON YARATISH =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
    const value = min + Math.random() * (max - min);
    return parseFloat(value.toFixed(decimals));
}

// ============= HAR BIR MAVZU UCHUN RANDOM SAVOL YARATISH =============
function generateRandomQuestion(topicName, level) {
    let question = { text: "", answer: 0, topic: topicName };
    
    // Qiyinlik darajasi (1-10)
    const difficulty = Math.min(10, Math.max(1, level));
    
    switch(topicName) {
        // ============ 1. BUTUN SONLAR ============
        case "Butun sonlar":
            let a = randomInt(10 * difficulty, 100 * difficulty);
            let b = randomInt(10 * difficulty, 100 * difficulty);
            let op = randomInt(1, 4);
            
            if (op === 1) {
                question.text = `${a} + ${b} = ?`;
                question.answer = a + b;
            } else if (op === 2) {
                if (a < b) [a, b] = [b, a];
                question.text = `${a} - ${b} = ?`;
                question.answer = a - b;
            } else if (op === 3) {
                a = randomInt(2, 20 * difficulty);
                b = randomInt(2, 15 * difficulty);
                question.text = `${a} × ${b} = ?`;
                question.answer = a * b;
            } else {
                b = randomInt(2, 15 * difficulty);
                a = b * randomInt(2, 20);
                question.text = `${a} ÷ ${b} = ?`;
                question.answer = a / b;
            }
            break;
            
        // ============ 2. KASRLAR ============
        case "Kasrlar":
            let num1 = randomInt(1, 8);
            let den1 = randomInt(2, 9);
            let num2 = randomInt(1, 8);
            let den2 = randomInt(2, 9);
            let opKasr = randomInt(1, 3);
            
            if (opKasr === 1) {
                // Qo'shish: a/b + c/d = (ad+bc)/bd
                let resultNum = num1 * den2 + num2 * den1;
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} + ${num2}/${den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            } else if (opKasr === 2) {
                // Ayirish
                let resultNum = num1 * den2 - num2 * den1;
                if (resultNum < 0) resultNum = -resultNum;
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} - ${num2}/${den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            } else {
                // Ko'paytirish
                let resultNum = num1 * num2;
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} × ${num2}/${den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            }
            break;
            
        // ============ 3. FOIZLAR ============
        case "Foizlar":
            let total = randomInt(100, 500 * difficulty);
            let percent = randomInt(5, 45);
            question.text = `${percent}% of ${total} = ?`;
            question.answer = (percent * total) / 100;
            break;
            
        // ============ 4. DARAJA ============
        case "Daraja":
            let base = randomInt(2, Math.min(8, difficulty + 2));
            let exp = randomInt(2, Math.min(4, difficulty));
            question.text = `${base}^${exp} = ?`;
            question.answer = Math.pow(base, exp);
            break;
            
        // ============ 5. ILDIZ ============
        case "Ildiz":
            let sqrtVal = randomInt(2, 15) ** 2;
            question.text = `√${sqrtVal} = ?`;
            question.answer = Math.sqrt(sqrtVal);
            break;
            
        // ============ 6. PROPORTSIYA ============
        case "Proportsiya":
            let a1 = randomInt(2, 8);
            let b1 = randomInt(2, 8);
            let c1 = randomInt(2, 8);
            let xProp = (b1 * c1) / a1;
            question.text = `${a1} : ${b1} = ${c1} : x, x = ?`;
            question.answer = parseFloat(xProp.toFixed(2));
            break;
            
        // ============ 7. BIR NOMA'LUMLI TENGLAMA ============
        case "Bir noma'lumli tenglama":
            let a2 = randomInt(2, 5);
            let b2 = randomInt(3, 12);
            let c2 = randomInt(15, 40);
            let xEq = (c2 - b2) / a2;
            question.text = `${a2}x + ${b2} = ${c2}, x = ?`;
            question.answer = parseFloat(xEq.toFixed(2));
            break;
            
        // ============ 8. IKKI NOMA'LUMLI TENGLAMA ============
        case "Ikki noma'lumli tenglama":
            let xVal = randomInt(2, 8);
            let yVal = randomInt(2, 8);
            let sum = xVal + yVal;
            let diff = xVal - yVal;
            question.text = `x + y = ${sum}, x - y = ${diff}, x = ?`;
            question.answer = xVal;
            break;
            
        // ============ 9. KVADRAT TENGLAMA ============
        case "Kvadrat tenglama":
            let root1 = randomInt(2, 5);
            let root2 = randomInt(3, 6);
            let bQuad = -(root1 + root2);
            let cQuad = root1 * root2;
            question.text = `x² ${bQuad >= 0 ? '+' : ''}${bQuad}x ${cQuad >= 0 ? '+' : ''}${cQuad} = 0 (kichik ildiz)`;
            question.answer = Math.min(root1, root2);
            break;
            
        // ============ 10. KVADRAT FUNKSIYA ============
        case "Kvadrat funksiya":
            let aQuad = randomInt(1, 3);
            let bQuadF = -randomInt(4, 10);
            let vertexX = -bQuadF / (2 * aQuad);
            question.text = `y = ${aQuad}x² ${bQuadF >= 0 ? '+' : ''}${bQuadF}x funksiyaning tepa nuqtasi x = ?`;
            question.answer = parseFloat(vertexX.toFixed(1));
            break;
            
        // ============ 11. LOGARIFM (ASOSIY) ============
        case "Logarifm (asosiy)":
            let logBase = randomInt(2, 4);
            let logPower = randomInt(2, 4);
            let logValue = Math.pow(logBase, logPower);
            question.text = `log${logBase}(${logValue}) = ?`;
            question.answer = logPower;
            break;
            
        // ============ 12. LOGARIFMIK TENGLAMA ============
        case "Logarifmik tenglama":
            let lgBase = randomInt(2, 4);
            let lgPower = randomInt(2, 4);
            let lgAnswer = Math.pow(lgBase, lgPower);
            question.text = `log${lgBase}(x) = ${lgPower}, x = ?`;
            question.answer = lgAnswer;
            break;
            
        // ============ 13. TRIGONOMETRIYA ============
        case "Trigonometriya":
            let angles = [0, 30, 45, 60, 90];
            let angle = angles[randomInt(0, angles.length - 1)];
            let trigFunc = randomInt(1, 4);
            let rad = angle * Math.PI / 180;
            
            if (trigFunc === 1) {
                question.text = `sin(${angle}°) = ?`;
                question.answer = parseFloat(Math.sin(rad).toFixed(4));
            } else if (trigFunc === 2) {
                question.text = `cos(${angle}°) = ?`;
                question.answer = parseFloat(Math.cos(rad).toFixed(4));
            } else if (trigFunc === 3) {
                question.text = `tan(${angle}°) = ?`;
                question.answer = parseFloat(Math.tan(rad).toFixed(4));
            } else {
                question.text = `cot(${angle}°) = ?`;
                let tan = Math.tan(rad);
                question.answer = tan !== 0 ? parseFloat((1 / tan).toFixed(4)) : 0;
            }
            break;
            
        // ============ 14. TRIGONOMETRIK TENGLAMA ============
        case "Trigonometrik tenglama":
            let targetAngle = [30, 45, 60][randomInt(0, 2)];
            let targetRad = targetAngle * Math.PI / 180;
            let targetSin = parseFloat(Math.sin(targetRad).toFixed(3));
            question.text = `sin(x) = ${targetSin} (0° < x < 90°), x = ?`;
            question.answer = targetAngle;
            break;
            
        // ============ 15. ARIFMETIK PROGRESSIYA ============
        case "Arifmetik progressiya":
            let a1_ap = randomInt(2, 8);
            let d = randomInt(2, 5);
            let n_ap = randomInt(4, 8);
            let an_ap = a1_ap + (n_ap - 1) * d;
            question.text = `a₁ = ${a1_ap}, d = ${d}, a_${n_ap} = ?`;
            question.answer = an_ap;
            break;
            
        // ============ 16. GEOMETRIK PROGRESSIYA ============
        case "Geometrik progressiya":
            let a1_gp = randomInt(2, 5);
            let q = randomInt(2, 4);
            let n_gp = randomInt(3, 6);
            let gn = a1_gp * Math.pow(q, n_gp - 1);
            question.text = `a₁ = ${a1_gp}, q = ${q}, a_${n_gp} = ?`;
            question.answer = gn;
            break;
            
        // ============ 17. LIMIT ============
        case "Limit":
            let limX = randomInt(2, 5);
            let limAns = 2 * limX;
            question.text = `lim(x→${limX}) (x² - ${limX*limX})/(x - ${limX}) = ?`;
            question.answer = limAns;
            break;
            
        // ============ 18. HOSILA ============
        case "Hosila":
            let power = randomInt(2, 3);
            let coeff = randomInt(2, 4);
            let xDer = randomInt(1, 3);
            let deriv = coeff * power * Math.pow(xDer, power - 1);
            question.text = `f(x) = ${coeff}x^${power}, f'(${xDer}) = ?`;
            question.answer = deriv;
            break;
            
        // ============ 19. INTEGRAL (ASOSIY) ============
        case "Integral (asosiy)":
            let aInt = randomInt(0, 1);
            let bInt = randomInt(2, 4);
            let intPow = randomInt(1, 2);
            let integralVal = (Math.pow(bInt, intPow + 1) - Math.pow(aInt, intPow + 1)) / (intPow + 1);
            question.text = `∫${aInt} to ${bInt} x^${intPow} dx = ?`;
            question.answer = parseFloat(integralVal.toFixed(3));
            break;
            
        // ============ 20. ANIQ INTEGRAL ============
        case "Aniq integral":
            let aInt2 = randomInt(0, 1);
            let bInt2 = randomInt(2, 3);
            let intPow2 = randomInt(1, 2);
            let integralVal2 = (Math.pow(bInt2, intPow2 + 1) - Math.pow(aInt2, intPow2 + 1)) / (intPow2 + 1);
            question.text = `∫${aInt2} to ${bInt2} x^${intPow2} dx = ?`;
            question.answer = parseFloat(integralVal2.toFixed(3));
            break;
            
        default:
            question.text = `${randomInt(10, 50)} + ${randomInt(10, 50)} = ?`;
            question.answer = eval(question.text.split('=')[0]);
    }
    
    return question;
}

// ============= TEST SAVOLLARINI YARATISH =============
function generateTestQuestions() {
    if (!currentUser) return;
    
    currentQuestions = [];
    currentAnswers = [];
    
    // Darajaga qarab qiyinlik (1-10 oralig'ida)
    let level = Math.min(10, Math.max(1, Math.floor(currentUser.globalLevel)));
    
    console.log(`📚 Yangi test! Daraja: ${currentUser.globalLevel} → Qiyinlik: ${level}`);
    
    for (let i = 0; i < TOPICS.length; i++) {
        const topic = TOPICS[i];
        const randomQuestion = generateRandomQuestion(topic, level);
        
        currentQuestions.push({
            text: randomQuestion.text,
            answer: randomQuestion.answer,
            topic: topic,
            level: level
        });
        currentAnswers.push(randomQuestion.answer);
    }
    
    console.log(`✅ ${currentQuestions.length} ta random savol yaratildi!`);
}

// ============ QOLGAN KOD (FOYDALANUVCHI, TEST, UI) ============
// ... (oldingi kodning qolgan qismlari o'zgarishsiz qoladi) ...

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
        this.globalLevel = 1;
        this.totalTests = 0;
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
            this.testHistory = data.testHistory || [];
            this.streak = data.streak || 0;
            this.lastTestDate = data.lastTestDate || null;
        }
    }
    
    saveProgress() {
        const users = JSON.parse(localStorage.getItem("mathai_users")) || {};
        users[this.fullName] = {
            firstName: this.firstName,
            lastName: this.lastName,
            globalLevel: this.globalLevel,
            totalTests: this.totalTests,
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
    
    updateLevelFromTest(percent) {
        let oldLevel = this.globalLevel;
        let levelIncrease = 0;
        
        if (percent >= 90) levelIncrease = 1.0;
        else if (percent >= 75) levelIncrease = 0.75;
        else if (percent >= 65) levelIncrease = 0.5;
        else if (percent >= 50) levelIncrease = 0.25;
        else levelIncrease = 0;
        
        let newLevel = Math.min(10, oldLevel + levelIncrease);
        this.globalLevel = newLevel;
        
        if (newLevel > oldLevel) {
            this.showLevelUpToast(oldLevel, newLevel);
        }
        
        return levelIncrease;
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
        if (levelSpan) levelSpan.innerHTML = `🎯 Daraja ${this.globalLevel.toFixed(1)}`;
        const currentLevelSpan = document.getElementById("currentLevel");
        if (currentLevelSpan) currentLevelSpan.innerText = this.globalLevel.toFixed(1);
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
            newLevel: this.globalLevel,
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

// ============= REGISTRATSIYA VA TEST FUNKSIYALARI =============
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
    showToast(`👋 Xush kelibsiz, ${firstName}! Sizning darajangiz: ${currentUser.globalLevel}`, "success");
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

function initTest() {
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
    document.getElementById("currentLevelBadge").innerText = currentUser.globalLevel.toFixed(1);
    
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
                <span style="font-size:14px; color:#4f46e5;">⭐ Qiyinlik: ${question.level}/10</span><br><br>
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
        showToast("✅ To'g'ri javob!", "success");
    } else {
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
    if (currentQuestionIndex >= TOPICS.length) return;
    
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    userAnswers.push({
        isCorrect: false,
        topic: currentTopic,
        skipped: true
    });
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) {
        finishTest();
    } else {
        showCurrentQuestion();
    }
}

function showExplanation(topicName, correctAnswer) {
    const explanation = getTopicExplanation(topicName);
    const box = document.getElementById("explanationBox");
    const content = document.getElementById("explanationContent");
    if (content) {
        content.innerHTML = `
            <h4>📘 ${topicName}</h4>
            <p>${explanation}</p>
            <p><strong>✅ To'g'ri javob:</strong> ${correctAnswer}</p>
            <button class="btn btn-primary" onclick="closeExplanation()" style="margin-top:10px;">Tushunildi</button>
        `;
    }
    if (box) box.style.display = "block";
}

function getTopicExplanation(topicName) {
    const explanations = {
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
        "Trigonometriya": "sin²α + cos²α = 1",
        "Trigonometrik tenglama": "sin(x) = a → x = arcsin(a)",
        "Arifmetik progressiya": "a_n = a₁ + (n-1)d",
        "Geometrik progressiya": "a_n = a₁ × q^(n-1)",
        "Limit": "lim(x→a) f(x) = L",
        "Hosila": "f'(x) = n·x^(n-1)",
        "Integral (asosiy)": "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        "Aniq integral": "∫_a^b f(x)dx = F(b)-F(a)"
    };
    return explanations[topicName] || `${topicName} mavzusini qayta o'rganing.`;
}

function closeExplanation() {
    document.getElementById("explanationBox").style.display = "none";
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
        levelAfter: currentUser.globalLevel,
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
    document.getElementById("resultDetails").innerHTML = `
        <p>⏱ Sarflangan vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p>
        <p>🎯 Yangi darajangiz: <strong>${currentUser.globalLevel.toFixed(1)}/10</strong></p>
    `;
    
    let weakHtml = "";
    const weakTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.topic);
    if (weakTopics.length > 0) {
        weakHtml = `<h4>📖 O'rganishingiz kerak:</h4><div class="weak-topics-list">${weakTopics.slice(0, 5).map(t => `<span class="weak-topic" onclick="showLesson('${t}')">${t}</span>`).join('')}</div>`;
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
            data: {
                labels: labels,
                datasets: [{
                    label: 'Natijalar (%)',
                    data: data,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: { y: { min: 0, max: 100 } }
            }
        });
    }
    
    const recent = document.getElementById("recentTestsList");
    if (recent) {
        if (currentUser.testHistory.length > 0) {
            recent.innerHTML = currentUser.testHistory.slice(0, 10).map((t, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #e2e8f0;">
                    <div>
                        <strong>#${i + 1}</strong>
                        <small style="margin-left:10px;">${new Date(t.date).toLocaleDateString('uz-UZ')}</small>
                    </div>
                    <div>
                        <span style="background:${t.percent >= 75 ? '#10b981' : (t.percent >= 50 ? '#f59e0b' : '#ef4444')}; padding:4px 12px; border-radius:20px; color:white;">
                            ${t.score}/${t.total} (${t.percent}%)
                        </span>
                        ${t.levelIncrease > 0 ? `<span style="margin-left:10px; color:#10b981;">+${t.levelIncrease}</span>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            recent.innerHTML = `<div style="padding:40px; text-align:center;">Hali test topshirilmagan</div>`;
        }
    }
}

// ============= DARSLAR =============
function updateTopicsGrid() {
    const grid = document.getElementById("topicsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showLesson('${topic}')">
            <i class="fas fa-chalkboard-user"></i>
            <h4>${topic}</h4>
            <small>⭐ Darajangiz: ${currentUser ? currentUser.globalLevel.toFixed(1) : 1}/10</small>
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
    const explanation = getTopicExplanation(topicName);
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
    
    console.log("✅ MathAI (Random qiymatlar tizimi) tayyor!");
});
