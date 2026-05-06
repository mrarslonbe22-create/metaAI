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
    "Butun sonlar": {
        title: "Butun sonlar",
        formula: "a + b = c, a - b = c, a × b = c, a ÷ b = c",
        rules: "1. Qo'shish: a + b\n2. Ayirish: a - b\n3. Ko'paytirish: a × b\n4. Bo'lish: a ÷ b",
        example: "25 + 17 = 42, 100 - 35 = 65, 12 × 8 = 96, 144 ÷ 12 = 12",
        practice: "345 + 278 = ?\n1000 - 647 = ?\n25 × 16 = ?\n625 ÷ 25 = ?",
        explanation: "Butun sonlar - manfiy, nol va musbat sonlarni o'z ichiga oladi."
    },
    "Kasrlar": {
        title: "Kasrlar",
        formula: "a/b + c/d = (ad+bc)/bd",
        rules: "1. Qo'shish: (ad+bc)/bd\n2. Ayirish: (ad-bc)/bd\n3. Ko'paytirish: ac/bd",
        example: "1/2 + 1/3 = 5/6, 2/3 × 3/4 = 1/2",
        practice: "3/4 + 2/5 = ?\n7/8 - 1/4 = ?\n2/3 × 3/5 = ?",
        explanation: "Kasr - sonning bo'linma ko'rinishi. Surat va maxrajdan tashkil topadi."
    },
    "Foizlar": {
        title: "Foizlar",
        formula: "P% = P/100, P% of X = (P/100) × X",
        rules: "1. Foizni kasrga aylantirish: P/100\n2. Foizni hisoblash: (qism/butun) × 100%",
        example: "20% of 150 = (20/100) × 150 = 30",
        practice: "30% of 200 = ?\n15% of 80 = ?\n45 dan 9 necha foiz?",
        explanation: "Foiz - yuzdan bir qism."
    },
    "Daraja": {
        title: "Daraja",
        formula: "aⁿ = a × a × ... × a (n marta)",
        rules: "1. aᵐ × aⁿ = aᵐ⁺ⁿ\n2. aᵐ ÷ aⁿ = aᵐ⁻ⁿ\n3. (aᵐ)ⁿ = aᵐⁿ\n4. a⁰ = 1",
        example: "2³ = 8, 5² = 25, 10⁴ = 10000",
        practice: "3⁴ = ?\n4³ = ?\n2⁵ = ?",
        explanation: "Daraja - sonning o'ziga necha marta ko'paytirilishi."
    },
    "Ildiz": {
        title: "Kvadrat ildiz",
        formula: "√a = b, agar b² = a",
        rules: "1. √(a×b) = √a × √b\n2. √(a/b) = √a / √b\n3. (√a)² = a",
        example: "√64 = 8, √144 = 12, √225 = 15",
        practice: "√169 = ?\n√400 = ?\n√81 = ?",
        explanation: "Kvadrat ildiz - o'ziga ko'paytirilganda berilgan sonni beradigan son."
    },
    "Proportsiya": {
        title: "Proportsiya",
        formula: "a/b = c/d → ad = bc",
        rules: "1. a : b = c : d\n2. a × d = b × c\n3. x = (b × c) / a",
        example: "x/5 = 10/25 → 25x = 50 → x = 2",
        practice: "x/8 = 5/20, x = ?\n3/4 = 9/x, x = ?",
        explanation: "Proportsiya - ikki nisbatning tengligi."
    },
    "Bir noma'lumli tenglama": {
        title: "Bir noma'lumli tenglama",
        formula: "ax + b = c → x = (c - b)/a",
        rules: "1. Noma'lumni bir tomonga o'tkazish\n2. Ikkala tomonni a ga bo'lish",
        example: "3x + 5 = 20 → 3x = 15 → x = 5",
        practice: "4x + 7 = 31\n5x - 8 = 22\n2x + 9 = 25",
        explanation: "Bir noma'lumli chiziqli tenglama - noma'lum birinchi darajada qatnashgan tenglama."
    },
    "Ikki noma'lumli tenglama": {
        title: "Ikki noma'lumli tenglama",
        formula: "Sistema: {a₁x + b₁y = c₁, a₂x + b₂y = c₂}",
        rules: "1. Qo'shish usuli\n2. Almashtirish usuli\n3. Kramer usuli",
        example: "x + y = 10, x - y = 4 → x = 7, y = 3",
        practice: "x + y = 15, x - y = 5\n2x + y = 10, x - y = 2",
        explanation: "Ikki noma'lumli tenglamalar sistemasi."
    },
    "Kvadrat tenglama": {
        title: "Kvadrat tenglama",
        formula: "ax² + bx + c = 0 → x = [-b ± √(b²-4ac)]/2a",
        rules: "D = b² - 4ac (Diskriminant)\nD > 0: 2 ta yechim\nD = 0: 1 ta yechim\nD < 0: yechim yo'q",
        example: "x² - 5x + 6 = 0 → x = 2, 3",
        practice: "x² - 7x + 12 = 0\nx² - 4x - 5 = 0",
        explanation: "Kvadrat tenglama - noma'lum ikkinchi darajada qatnashgan tenglama."
    },
    "Kvadrat funksiya": {
        title: "Kvadrat funksiya",
        formula: "y = ax² + bx + c, tepa nuqta: x = -b/(2a)",
        rules: "a > 0: parabola yuqoriga\n a < 0: parabola pastga",
        example: "y = x² - 4x + 3 → tepa nuqta (2, -1)",
        practice: "y = x² - 6x + 5 tepa nuqtasini toping",
        explanation: "Kvadrat funksiya - grafigi parabola bo'lgan funksiya."
    },
    "Logarifm (asosiy)": {
        title: "Logarifm",
        formula: "log_a(b) = c → a^c = b",
        rules: "1. log_a(m×n) = log_a(m) + log_a(n)\n2. log_a(m/n) = log_a(m) - log_a(n)\n3. log_a(m^n) = n·log_a(m)",
        example: "log₂(8) = 3, log₃(27) = 3",
        practice: "log₄(64) = ?\nlog₃(81) = ?\nlog₂(32) = ?",
        explanation: "Logarifm - darajaning teskari funksiyasi."
    },
    "Logarifmik tenglama": {
        title: "Logarifmik tenglama",
        formula: "log_a(x) = b → x = a^b",
        rules: "1. Logarifmning ta'rifidan foydalanish\n2. Aniqlanish sohasini hisobga olish",
        example: "log₂(x) = 3 → x = 2³ = 8",
        practice: "log₃(x) = 4\nlog₅(x) = 2",
        explanation: "Logarifmik tenglamalar - noma'lum logarifm ichida qatnashgan tenglamalar."
    },
    "Trigonometriya (sin, cos)": {
        title: "Trigonometriya",
        formula: "sin²α + cos²α = 1",
        rules: "sin(α) = qarama-qarshi/gipotenuza\ncos(α) = yopishgan/gipotenuza\ntan(α) = sin/cos",
        example: "sin(30°) = 0.5, cos(60°) = 0.5",
        practice: "sin(45°) = ?\ncos(30°) = ?\ntan(45°) = ?",
        explanation: "Trigonometriya - to'g'ri burchakli uchburchak tomonlari va burchaklari orasidagi munosabatlar."
    },
    "Trigonometrik tenglama": {
        title: "Trigonometrik tenglama",
        formula: "sin(x) = a → x = arcsin(a) + 360°·k",
        rules: "1. Asosiy yechimni topish\n2. Davriylikni hisobga olish",
        example: "sin(x) = 0.5 → x = 30° + 360°·k yoki x = 150° + 360°·k",
        practice: "cos(x) = 0.5\nsin(x) = √3/2",
        explanation: "Trigonometrik tenglamalar - noma'lum trigonometrik funksiya ichida qatnashadi."
    },
    "Arifmetik progressiya": {
        title: "Arifmetik progressiya",
        formula: "a_n = a₁ + (n-1)d, S_n = n(a₁ + a_n)/2",
        rules: "1. Ayirma d = a₂ - a₁\n2. n-had formulasi",
        example: "a₁=2, d=3 → a₅ = 2 + 4×3 = 14",
        practice: "a₁=5, d=4, a₁₀ = ?\na₁=10, d=-2, a₆ = ?",
        explanation: "Arifmetik progressiya - har bir had o'zidan oldingi hadga doimiy son qo'shish orqali hosil qilinadi."
    },
    "Geometrik progressiya": {
        title: "Geometrik progressiya",
        formula: "a_n = a₁ × q^(n-1), S_n = a₁(qⁿ - 1)/(q - 1)",
        rules: "1. Maxraj q = a₂/a₁\n2. n-had formulasi",
        example: "a₁=3, q=2 → a₄ = 3 × 2³ = 24",
        practice: "a₁=2, q=3, a₅ = ?\na₁=5, q=1/2, a₄ = ?",
        explanation: "Geometrik progressiya - har bir had o'zidan oldingi hadga doimiy son ko'paytirish orqali hosil qilinadi."
    },
    "Limit": {
        title: "Limit",
        formula: "lim(x→a) f(x) = L",
        rules: "1. To'g'ridan-to'g'ri qo'yish\n2. Ko'paytuvchilarga ajratish\n3. L'Hopital qoidasi",
        example: "lim(x→2) (x² - 4)/(x - 2) = 4",
        practice: "lim(x→1) (x² - 1)/(x - 1)\nlim(x→0) sin(x)/x",
        explanation: "Limit - funksiyaning argument biror qiymatga intilgandagi qiymati."
    },
    "Hosila": {
        title: "Hosila",
        formula: "f'(x) = lim(h→0) [f(x+h) - f(x)]/h",
        rules: "1. (xⁿ)' = n·xⁿ⁻¹\n2. (c)' = 0\n3. (sin x)' = cos x\n4. (cos x)' = -sin x",
        example: "f(x) = x² → f'(x) = 2x",
        practice: "f(x) = x³ → f'(x) = ?\nf(x) = sin(x) → f'(x) = ?",
        explanation: "Hosila - funksiyaning o'zgarish tezligi."
    },
    "Integral (asosiy)": {
        title: "Integral",
        formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
        rules: "1. ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C\n2. ∫ cf(x)dx = c∫ f(x)dx",
        example: "∫ x² dx = x³/3 + C",
        practice: "∫ x³ dx = ?\n∫ 5 dx = ?",
        explanation: "Integral - hosilaning teskari amali. Yuzani, hajmni hisoblashda ishlatiladi."
    },
    "Aniq integral": {
        title: "Aniq integral",
        formula: "∫_a^b f(x)dx = F(b) - F(a)",
        rules: "1. Boshlang'ich funksiyani topish\n2. Chegaralarni qo'yish",
        example: "∫₀¹ x² dx = 1/3",
        practice: "∫₀² x dx = ?\n∫₁² x² dx = ?",
        explanation: "Aniq integral - egri chiziq ostidagi yuzani hisoblaydi."
    }
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
        let totalLevel = 0, count = 0;
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

// ============= YORDAMCHI FUNKSIYALAR =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// ============= SAVOL YARATISH =============
function generateQuestionForTopic(topic, userLevel) {
    const topicName = topic.name;
    let question = { text: "", answer: 0, topic: topicName };
    
    switch(topicName) {
        case "Butun sonlar":
            let a = randomInt(10, 100);
            let b = randomInt(10, 100);
            let op = randomInt(0, 1) ? '+' : '-';
            if (op === '+') {
                question.text = `${a} + ${b}`;
                question.answer = a + b;
            } else {
                if (a < b) [a, b] = [b, a];
                question.text = `${a} - ${b}`;
                question.answer = a - b;
            }
            break;
        case "Kasrlar":
            let n1 = randomInt(1, 8);
            let d1 = randomInt(2, 9);
            let n2 = randomInt(1, 8);
            let d2 = randomInt(2, 9);
            let kOp = randomInt(0, 2);
            if (kOp === 0) {
                let rn = n1 * d2 + n2 * d1;
                let rd = d1 * d2;
                question.text = `${n1}/${d1} + ${n2}/${d2}`;
                question.answer = Math.round((rn / rd) * 100) / 100;
            } else if (kOp === 1) {
                let rn = n1 * d2 - n2 * d1;
                if (rn < 0) rn = -rn;
                let rd = d1 * d2;
                question.text = `${n1}/${d1} - ${n2}/${d2}`;
                question.answer = Math.round((rn / rd) * 100) / 100;
            } else {
                let rn = n1 * n2;
                let rd = d1 * d2;
                question.text = `${n1}/${d1} × ${n2}/${d2}`;
                question.answer = Math.round((rn / rd) * 100) / 100;
            }
            break;
        case "Foizlar":
            let total = randomInt(100, 500);
            let percent = randomInt(10, 50);
            question.text = `${percent}% of ${total}`;
            question.answer = (percent * total) / 100;
            break;
        case "Daraja":
            let base = randomInt(2, 5);
            let exp = randomInt(2, 4);
            question.text = `${base}^${exp}`;
            question.answer = Math.pow(base, exp);
            break;
        case "Ildiz":
            let squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
            let val = squares[randomInt(0, squares.length - 1)];
            question.text = `√${val}`;
            question.answer = Math.sqrt(val);
            break;
        case "Proportsiya":
            let a1 = randomInt(2, 8);
            let b1 = randomInt(2, 8);
            let c1 = randomInt(2, 8);
            let xProp = (b1 * c1) / a1;
            question.text = `${a1} : ${b1} = ${c1} : x`;
            question.answer = Math.round(xProp * 100) / 100;
            break;
        case "Bir noma'lumli tenglama":
            let a2 = randomInt(2, 5);
            let b2 = randomInt(3, 10);
            let c2 = randomInt(15, 30);
            let xEq = (c2 - b2) / a2;
            question.text = `${a2}x + ${b2} = ${c2}`;
            question.answer = Math.round(xEq * 100) / 100;
            break;
        case "Ikki noma'lumli tenglama":
            let xVal = randomInt(2, 6);
            let yVal = randomInt(2, 6);
            let sum = xVal + yVal;
            let diff = xVal - yVal;
            question.text = `x + y = ${sum}, x - y = ${diff} (x ni toping)`;
            question.answer = xVal;
            break;
        case "Kvadrat tenglama":
            let root1 = randomInt(2, 4);
            let root2 = randomInt(3, 5);
            let bQuad = -(root1 + root2);
            let cQuad = root1 * root2;
            question.text = `x² ${bQuad >= 0 ? '+' : ''}${bQuad}x ${cQuad >= 0 ? '+' : ''}${cQuad} = 0 (kichik ildizni toping)`;
            question.answer = Math.min(root1, root2);
            break;
        case "Kvadrat funksiya":
            let aQuad = randomInt(1, 2);
            let bQuadF = -randomInt(4, 8);
            let cQuadF = randomInt(1, 5);
            let vertexX = -bQuadF / (2 * aQuad);
            question.text = `y = ${aQuad}x² ${bQuadF >= 0 ? '+' : ''}${bQuadF}x ${cQuadF >= 0 ? '+' : ''}${cQuadF} funksiyaning tepa nuqtasi x = ?`;
            question.answer = Math.round(vertexX * 10) / 10;
            break;
        case "Logarifm (asosiy)":
            let logBase = randomInt(2, 4);
            let logPower = randomInt(2, 4);
            let logValue = Math.pow(logBase, logPower);
            question.text = `log${logBase}(${logValue})`;
            question.answer = logPower;
            break;
        case "Logarifmik tenglama":
            let lb = randomInt(2, 4);
            let lp = randomInt(2, 4);
            let lv = Math.pow(lb, lp);
            question.text = `log${lb}(x) = ${lp}`;
            question.answer = lv;
            break;
        case "Trigonometriya (sin, cos)":
            let angles = [0, 30, 45, 60, 90];
            let angle = angles[randomInt(0, angles.length - 1)];
            let trigFunc = randomInt(0, 1) ? 'sin' : 'cos';
            let rad = angle * Math.PI / 180;
            let trigValue = trigFunc === 'sin' ? Math.sin(rad) : Math.cos(rad);
            question.text = `${trigFunc}(${angle}°)`;
            question.answer = Math.round(trigValue * 100) / 100;
            break;
        case "Trigonometrik tenglama":
            let targetAngle = [30, 45, 60][randomInt(0, 2)];
            let targetRad = targetAngle * Math.PI / 180;
            let targetSin = Math.sin(targetRad);
            question.text = `sin(x) = ${targetSin} (0° < x < 90°, x = ?)`;
            question.answer = targetAngle;
            break;
        case "Arifmetik progressiya":
            let a1_ap = randomInt(2, 5);
            let d = randomInt(2, 4);
            let n_ap = randomInt(4, 7);
            let an_ap = a1_ap + (n_ap - 1) * d;
            question.text = `a₁ = ${a1_ap}, d = ${d}, a_${n_ap} = ?`;
            question.answer = an_ap;
            break;
        case "Geometrik progressiya":
            let a1_gp = randomInt(2, 4);
            let q = randomInt(2, 3);
            let n_gp = randomInt(3, 5);
            let gn = a1_gp * Math.pow(q, n_gp - 1);
            question.text = `a₁ = ${a1_gp}, q = ${q}, a_${n_gp} = ?`;
            question.answer = gn;
            break;
        case "Limit":
            let limX = randomInt(2, 4);
            let limAns = 2 * limX;
            question.text = `lim(x→${limX}) (x² - ${limX*limX})/(x - ${limX})`;
            question.answer = limAns;
            break;
        case "Hosila":
            let pow = randomInt(2, 3);
            let coeff = randomInt(2, 4);
            let xValDer = randomInt(1, 2);
            let deriv = coeff * pow * Math.pow(xValDer, pow - 1);
            question.text = `f(x) = ${coeff}x^${pow}, f'(${xValDer}) = ?`;
            question.answer = deriv;
            break;
        case "Integral (asosiy)":
            let intPow = randomInt(1, 2);
            let intX = randomInt(1, 2);
            let intVal = Math.pow(intX, intPow + 1) / (intPow + 1);
            question.text = `∫₀${intX} x^${intPow} dx = ?`;
            question.answer = Math.round(intVal * 100) / 100;
            break;
        case "Aniq integral":
            let aInt = randomInt(0, 1);
            let bInt = randomInt(2, 3);
            let intP = randomInt(1, 2);
            let integralVal = (Math.pow(bInt, intP + 1) - Math.pow(aInt, intP + 1)) / (intP + 1);
            question.text = `∫${aInt} to ${bInt} x^${intP} dx = ?`;
            question.answer = Math.round(integralVal * 100) / 100;
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
    toast.className = `toast`;
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
        if (!answer.isCorrect && !weakTopics.includes(answer.topic)) weakTopics.push(answer.topic);
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
}

function restartTest() {
    document.getElementById("testStartSection").style.display = "block";
    document.getElementById("testActiveSection").style.display = "none";
    document.getElementById("testResultSection").style.display = "none";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
}

// ============= MAVZU O'RGANISH =============
function showLesson(topicName) {
    const topic = TOPICS_DATA[topicName];
    if (!topic) return;
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="formula-box"><strong>📐 Asosiy formula:</strong><br>${topic.formula}</div>
            <div class="formula-box"><strong>📏 Qoidalar:</strong><br>${topic.rules.replace(/\n/g, '<br>')}</div>
            <div class="example-box"><strong>📝 Misol:</strong><br>${topic.example}</div>
            <div class="example-box"><strong>✏️ Amaliy topshiriq:</strong><br>${topic.practice.replace(/\n/g, '<br>')}</div>
            <div><strong>📖 Batafsil:</strong><br><p>${topic.explanation}</p></div>
            <div style="margin-top:20px;"><button class="btn btn-primary" onclick="closeLessonModal()" style="width:100%;">Tushunildi</button></div>
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

function updateStatisticsPage() {
    if (!currentUser) return;
    const topics = Object.keys(currentUser.topicMastery);
    const masteryLevels = topics.map(t => currentUser.topicMastery[t].level);
    const topicsChart = document.getElementById("topicsChart");
    if (topicsChart && typeof Chart !== 'undefined') {
        new Chart(topicsChart, {
            type: 'bar',
            data: { labels: topics, datasets: [{ label: 'O\'zlashtirish darajasi (1-10)', data: masteryLevels, backgroundColor: '#4f46e5', borderRadius: 8 }] },
            options: { responsive: true, scales: { y: { min: 0, max: 10 } } }
        });
    }
    const recentTests = document.getElementById("recentTestsList");
    if (recentTests && currentUser.testHistory.length > 0) {
        recentTests.innerHTML = currentUser.testHistory.slice(0, 10).map(test => `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #e2e8f0;">
                <span>${new Date(test.date).toLocaleDateString('uz-UZ')}</span>
                <span style="background:${test.percent>=70?'#10b981':(test.percent>=40?'#f59e0b':'#ef4444')}; padding:2px 8px; border-radius:20px; color:white;">${test.score}/${test.total} (${test.percent}%)</span>
            </div>
        `).join('');
    }
}

function goToAdmin() {
    const password = prompt("Admin parolini kiriting:");
    if (password === "admin123") window.location.href = "admin.html";
    else alert("❌ Parol xato!");
}

// ============= DARK MODE =============
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    showToast(isDark ? "🌙 Qorong'u rejim" : "🌞 Yorug' rejim", "success");
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
    const topicsGrid = document.getElementById("topicsGrid");
    if (topicsGrid) {
        topicsGrid.innerHTML = TOPICS.map(topic => `<div class="topic-card" onclick="showLesson('${topic.name}')"><i class="fas fa-chalkboard-user"></i><span>${topic.name}</span></div>`).join('');
    }
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    if (menuToggle && sidebar) menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", toggleDarkMode);
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) switchToPage(page);
        });
    });
    window.onclick = (e) => {
        const modal = document.getElementById("lessonModal");
        if (e.target === modal) closeLessonModal();
    };
    console.log("✅ MathAI tayyor!");
});
