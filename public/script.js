// ============= API SOZLAMALARI =============
const API_BASE = window.location.origin;

// ============= 20 TA MAVZU VA ULARNING TO'LIQ MA'LUMOTLARI =============
const TOPICS_DATA = {
    "Butun sonlar": {
        name: "Butun sonlar",
        formula: "Butun sonlar: ..., -3, -2, -1, 0, 1, 2, 3, ...",
        rules: ["Qo'shish: a + b", "Ayirish: a - b", "Ko'paytirish: a × b", "Bo'lish: a ÷ b (b ≠ 0)", "Manfiy sonlar: (−a) + (−b) = −(a+b)", "Manfiy va musbat: (−a) + b = b − a"],
        examples: ["25 + 17 = 42", "100 - 35 = 65", "12 × 8 = 96", "144 ÷ 12 = 12", "(-15) + (-20) = -35"],
        practice: "345 + 278 = ?\n1000 - 647 = ?\n25 × 16 = ?\n625 ÷ 25 = ?",
        explanation: "Butun sonlar - bu manfiy, nol va musbat sonlarni o'z ichiga oladi."
    },
    "Kasrlar": {
        name: "Kasrlar",
        formula: "a/b + c/d = (ad + bc)/bd\na/b × c/d = ac/bd",
        rules: ["Surat - kasrning yuqori qismi", "Maxraj - kasrning pastki qismi", "Kasrlarni qo'shish: umumiy maxrajga keltirish", "Kasrlarni ko'paytirish: suratlarni va maxrajlarni ko'paytirish"],
        examples: ["1/2 + 1/3 = (3+2)/6 = 5/6", "2/3 × 3/4 = 6/12 = 1/2", "3/4 - 1/2 = (3-2)/4 = 1/4"],
        practice: "3/4 + 2/5 = ?\n7/8 - 1/4 = ?\n2/3 × 3/5 = ?",
        explanation: "Kasr - sonning bo'linma ko'rinishi. Surat va maxrajdan tashkil topadi."
    },
    "Foizlar": {
        name: "Foizlar",
        formula: "P% = P/100\nP% of X = (P/100) × X",
        rules: ["Foizni kasrga aylantirish: P% = P/100", "Foizni hisoblash: (qism/butun) × 100%", "Qiymatni foizga oshirish: X × (1 + P/100)", "Qiymatni foizga kamaytirish: X × (1 - P/100)"],
        examples: ["20% of 150 = (20/100) × 150 = 30", "30% of 200 = 60", "50 ni 20% ga oshirish: 50 × 1.2 = 60"],
        practice: "30% of 200 = ?\n15% of 80 = ?\n45 dan 9 necha foiz?",
        explanation: "Foiz - yuzdan bir qism. Foizlarni hisoblashda asosiy formula: (qism/butun) × 100%."
    },
    "Daraja": {
        name: "Daraja",
        formula: "aⁿ = a × a × ... × a (n marta)\naᵐ × aⁿ = aᵐ⁺ⁿ\naᵐ ÷ aⁿ = aᵐ⁻ⁿ\n(aᵐ)ⁿ = aᵐⁿ",
        rules: ["a⁰ = 1 (a ≠ 0)", "a¹ = a", "a⁻ⁿ = 1/aⁿ", "(ab)ⁿ = aⁿ × bⁿ", "(a/b)ⁿ = aⁿ/bⁿ"],
        examples: ["2³ = 2 × 2 × 2 = 8", "5² = 25", "10⁴ = 10000", "3² × 3³ = 3⁵ = 243"],
        practice: "3⁴ = ?\n4³ = ?\n2⁵ = ?",
        explanation: "Daraja - sonning o'ziga necha marta ko'paytirilishi. a - asos, n - daraja ko'rsatkichi."
    },
    "Ildiz": {
        name: "Kvadrat ildiz",
        formula: "√a = b, agar b² = a\n√(a×b) = √a × √b\n√(a/b) = √a / √b",
        rules: ["(√a)² = a", "√(a²) = |a|", "√0 = 0", "√1 = 1"],
        examples: ["√64 = 8, chunki 8² = 64", "√(25×4) = √25 × √4 = 5 × 2 = 10", "√(100/25) = √100 / √25 = 10/5 = 2"],
        practice: "√169 = ?\n√400 = ?\n√81 = ?",
        explanation: "Kvadrat ildiz - o'ziga ko'paytirilganda berilgan sonni beradigan son."
    },
    "Proportsiya": {
        name: "Proportsiya",
        formula: "a/b = c/d → ad = bc\na : b = c : d",
        rules: ["Teskari proportsiya: xy = k", "To'g'ri proportsiya: y = kx", "Proportsiyaning asosiy xossasi: a·d = b·c"],
        examples: ["x/5 = 10/25 → 25x = 50 → x = 2", "3/4 = 9/x → 3x = 36 → x = 12"],
        practice: "x/8 = 5/20, x = ?\n3/4 = 9/x, x = ?",
        explanation: "Proportsiya - ikki nisbatning tengligi. a:b = c:d ko'rinishida yoziladi."
    },
    "Bir noma'lumli tenglama": {
        name: "Bir noma'lumli tenglama",
        formula: "ax + b = c → x = (c - b)/a",
        rules: ["Noma'lumni bir tomonga o'tkazish", "Ikkala tomonni a ga bo'lish", "Tenglamaning ildizini topish"],
        examples: ["3x + 5 = 20 → 3x = 15 → x = 5", "4x - 7 = 21 → 4x = 28 → x = 7"],
        practice: "4x + 7 = 31\n5x - 8 = 22\n2x + 9 = 25",
        explanation: "Bir noma'lumli chiziqli tenglama - noma'lum birinchi darajada qatnashgan tenglama."
    },
    "Ikki noma'lumli tenglama": {
        name: "Ikki noma'lumli tenglama",
        formula: "Sistema: {a₁x + b₁y = c₁, a₂x + b₂y = c₂}",
        rules: ["Qo'shish usuli", "Almashtirish usuli", "Kramer usuli", "Grafik usul"],
        examples: ["x + y = 10, x - y = 4 → 2x = 14 → x = 7, y = 3", "2x + y = 7, x - y = 2 → 3x = 9 → x = 3, y = 1"],
        practice: "x + y = 15, x - y = 5\n2x + y = 10, x - y = 2",
        explanation: "Ikki noma'lumli tenglamalar sistemasi - ikki tenglamadan tashkil topgan sistema."
    },
    "Kvadrat tenglama": {
        name: "Kvadrat tenglama",
        formula: "ax² + bx + c = 0\nD = b² - 4ac\nx = [-b ± √(b² - 4ac)]/2a",
        rules: ["D > 0 → 2 ta haqiqiy ildiz", "D = 0 → 1 ta ildiz (ikki karrali)", "D < 0 → haqiqiy ildiz yo'q", "Vyeta teoremasi: x₁ + x₂ = -b/a, x₁·x₂ = c/a"],
        examples: ["x² - 5x + 6 = 0 → D = 25 - 24 = 1 → x = (5 ± 1)/2 → x₁ = 3, x₂ = 2", "x² - 4x + 4 = 0 → D = 16 - 16 = 0 → x = 2"],
        practice: "x² - 7x + 12 = 0\nx² - 4x - 5 = 0",
        explanation: "Kvadrat tenglama - noma'lum ikkinchi darajada qatnashgan tenglama."
    },
    "Kvadrat funksiya": {
        name: "Kvadrat funksiya",
        formula: "y = ax² + bx + c, a ≠ 0\ntepa nuqta: x₀ = -b/(2a), y₀ = c - b²/(4a)",
        rules: ["a > 0 → parabola yuqoriga ochiladi", "a < 0 → parabola pastga ochiladi", "Parabolaning simmetriya o'qi: x = -b/(2a)"],
        examples: ["y = x² - 4x + 3 → tepa nuqta: x = 2, y = -1", "y = -x² + 4x - 3 → tepa nuqta: x = 2, y = 1"],
        practice: "y = x² - 6x + 5 tepa nuqtasini toping\ny = -x² + 4x funksiyaning maksimumini toping",
        explanation: "Kvadrat funksiya - grafigi parabola bo'lgan funksiya."
    },
    "Logarifm (asosiy)": {
        name: "Logarifm",
        formula: "log_a(b) = c → a^c = b\nlg(x) = log₁₀(x)\nln(x) = log_e(x)",
        rules: ["log_a(m·n) = log_a(m) + log_a(n)", "log_a(m/n) = log_a(m) - log_a(n)", "log_a(mⁿ) = n·log_a(m)", "log_a(a) = 1", "log_a(1) = 0"],
        examples: ["log₂(8) = 3, chunki 2³ = 8", "log₃(81) = 4, chunki 3⁴ = 81", "log₂(16) = 4", "lg(100) = 2", "ln(e) = 1"],
        practice: "log₄(64) = ?\nlog₃(81) = ?\nlog₂(32) = ?",
        explanation: "Logarifm - darajaning teskari funksiyasi. log_a(b) = c degani a^c = b."
    },
    "Logarifmik tenglama": {
        name: "Logarifmik tenglama",
        formula: "log_a(x) = b → x = a^b\nlog_a(f(x)) = log_a(g(x)) → f(x) = g(x)",
        rules: ["Aniqlanish sohasi: x > 0", "Asos: a > 0, a ≠ 1", "Logarifmik tenglamani yechishda potensirlash usuli"],
        examples: ["log₂(x) = 3 → x = 2³ = 8", "log₃(x - 1) = 2 → x - 1 = 9 → x = 10"],
        practice: "log₃(x) = 4\nlog₅(x) = 2\nlog₂(x - 1) = 3",
        explanation: "Logarifmik tenglamalar - noma'lum logarifm ichida qatnashgan tenglamalar."
    },
    "Trigonometriya": {
        name: "Trigonometriya",
        formula: "sin²α + cos²α = 1\nsin(α ± β) = sinα·cosβ ± cosα·sinβ\ncos(α ± β) = cosα·cosβ ∓ sinα·sinβ",
        rules: ["sin(0°) = 0, cos(0°) = 1", "sin(30°) = 1/2, cos(30°) = √3/2", "sin(45°) = √2/2, cos(45°) = √2/2", "sin(60°) = √3/2, cos(60°) = 1/2", "sin(90°) = 1, cos(90°) = 0"],
        examples: ["sin(30°) = 0.5", "cos(60°) = 0.5", "tan(45°) = 1", "sin²30° + cos²30° = 0.25 + 0.75 = 1"],
        practice: "sin(45°) = ?\ncos(30°) = ?\ntan(45°) = ?",
        explanation: "Trigonometriya - to'g'ri burchakli uchburchak tomonlari va burchaklari orasidagi munosabatlarni o'rganadi."
    },
    "Trigonometrik tenglama": {
        name: "Trigonometrik tenglama",
        formula: "sin(x) = a → x = arcsin(a) + 360°·k\ncos(x) = a → x = arccos(a) + 360°·k\ntan(x) = a → x = arctan(a) + 180°·k",
        rules: ["sin(x) = 0 → x = 180°·k", "cos(x) = 0 → x = 90° + 180°·k", "sin(x) = 1 → x = 90° + 360°·k", "sin(x) = -1 → x = 270° + 360°·k"],
        examples: ["sin(x) = 0.5 → x = 30° + 360°·k yoki x = 150° + 360°·k", "cos(x) = 0 → x = 90° + 180°·k"],
        practice: "cos(x) = 0.5\nsin(x) = √3/2\ntan(x) = 1",
        explanation: "Trigonometrik tenglamalar - noma'lum trigonometrik funksiya ichida qatnashadi."
    },
    "Arifmetik progressiya": {
        name: "Arifmetik progressiya",
        formula: "a_n = a₁ + (n-1)d\nS_n = n(a₁ + a_n)/2 = n(2a₁ + (n-1)d)/2",
        rules: ["d = a₂ - a₁ (ayirma)", "aₙ - aₙ₋₁ = d", "Har bir had o'zidan oldingi haddan doimiy songa farq qiladi"],
        examples: ["a₁=2, d=3 → a₅ = 2 + 4×3 = 14", "a₁=5, d=4 → S₁₀ = 10(5 + 41)/2 = 230"],
        practice: "a₁=5, d=4, a₁₀ = ?\na₁=10, d=-2, a₆ = ?",
        explanation: "Arifmetik progressiya - har bir had o'zidan oldingi hadga doimiy son (d) qo'shish orqali hosil qilinadi."
    },
    "Geometrik progressiya": {
        name: "Geometrik progressiya",
        formula: "a_n = a₁ × q^(n-1)\nS_n = a₁(qⁿ - 1)/(q - 1), q ≠ 1",
        rules: ["q = a₂/a₁ (maxraj)", "aₙ / aₙ₋₁ = q", "|q| < 1 bo'lsa, cheksiz kamayuvchi progressiya: S = a₁/(1-q)"],
        examples: ["a₁=3, q=2 → a₄ = 3 × 2³ = 24", "a₁=2, q=3 → S₄ = 2(81 - 1)/(3 - 1) = 80"],
        practice: "a₁=2, q=3, a₅ = ?\na₁=5, q=1/2, a₄ = ?",
        explanation: "Geometrik progressiya - har bir had o'zidan oldingi hadga doimiy son (q) ko'paytirish orqali hosil qilinadi."
    },
    "Limit": {
        name: "Limit",
        formula: "lim(x→a) f(x) = L\nlim(x→0) sin(x)/x = 1\nlim(x→±∞) (1 + 1/x)^x = e",
        rules: ["Cheksizlikda limit: lim(x→∞) 1/x = 0", "Limitning linear xossasi", "L'Hopital qoidasi (0/0 yoki ∞/∞ ko'rinishlarda)"],
        examples: ["lim(x→2) (x² - 4)/(x - 2) = lim(x→2) (x + 2) = 4", "lim(x→∞) 1/x = 0"],
        practice: "lim(x→1) (x² - 1)/(x - 1)\nlim(x→0) sin(x)/x",
        explanation: "Limit - funksiyaning argument biror qiymatga intilgandagi qiymati."
    },
    "Hosila": {
        name: "Hosila",
        formula: "f'(x) = lim(h→0) [f(x+h) - f(x)]/h\n(xⁿ)' = n·xⁿ⁻¹\n(sin x)' = cos x\n(cos x)' = -sin x",
        rules: ["Doimiyning hosilasi: (c)' = 0", "(cf(x))' = c·f'(x)", "(f±g)' = f' ± g'", "(f·g)' = f'·g + f·g'", "(f/g)' = (f'·g - f·g')/g²"],
        examples: ["f(x) = x² → f'(x) = 2x", "f(x) = sin(x) → f'(x) = cos(x)", "f(x) = 3x³ → f'(x) = 9x²"],
        practice: "f(x) = x³ → f'(x) = ?\nf(x) = sin(x) → f'(x) = ?\nf(x) = 2x² + 3x → f'(x) = ?",
        explanation: "Hosila - funksiyaning o'zgarish tezligi."
    },
    "Integral (asosiy)": {
        name: "Integral (asosiy)",
        formula: "∫ xⁿ dx = xⁿ⁺¹/(n+1) + C\n∫ sin(x) dx = -cos(x) + C\n∫ cos(x) dx = sin(x) + C\n∫ 1/x dx = ln|x| + C",
        rules: ["∫ cf(x)dx = c∫ f(x)dx", "∫ [f(x)±g(x)]dx = ∫ f(x)dx ± ∫ g(x)dx", "∫ a dx = ax + C"],
        examples: ["∫ x² dx = x³/3 + C", "∫ 5 dx = 5x + C", "∫ sin(x) dx = -cos(x) + C"],
        practice: "∫ x³ dx = ?\n∫ 5 dx = ?\n∫ (2x + 3) dx = ?",
        explanation: "Integral - hosilaning teskari amali."
    },
    "Aniq integral": {
        name: "Aniq integral",
        formula: "∫_a^b f(x)dx = F(b) - F(a)\n∫_a^b f(x)dx = -∫_b^a f(x)dx\n∫_a^b cf(x)dx = c∫_a^b f(x)dx",
        rules: ["∫_a^b f(x)dx = ∫_a^c f(x)dx + ∫_c^b f(x)dx", "∫_a^a f(x)dx = 0", "Nyuton-Leybnis formulasi"],
        examples: ["∫₀¹ x² dx = [x³/3]₀¹ = 1/3 - 0 = 1/3", "∫₀² x dx = [x²/2]₀² = 4/2 - 0 = 2"],
        practice: "∫₀² x dx = ?\n∫₁² x² dx = ?\n∫₀^π sin(x) dx = ?",
        explanation: "Aniq integral - egri chiziq ostidagi yuzani hisoblaydi."
    }
};

// ============= 20 TA MAVZU RO'YXATI =============
const TOPICS = Object.keys(TOPICS_DATA);

// ============= RANDOM SON YARATISH =============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============= HAR BIR MAVZU UCHUN RANDOM SAVOL YARATISH =============
function generateRandomQuestion(topicName, level) {
    let question = { text: "", answer: 0, topic: topicName };
    const difficulty = Math.min(10, Math.max(1, level));
    
    switch(topicName) {
        case "Butun sonlar":
            let a = randomInt(10 * difficulty, 100 * difficulty);
            let b = randomInt(10 * difficulty, 100 * difficulty);
            let op = randomInt(1, 4);
            if (op === 1) { question.text = `${a} + ${b} = ?`; question.answer = a + b; }
            else if (op === 2) { if (a < b) [a, b] = [b, a]; question.text = `${a} - ${b} = ?`; question.answer = a - b; }
            else if (op === 3) { a = randomInt(2, 20 * difficulty); b = randomInt(2, 15 * difficulty); question.text = `${a} × ${b} = ?`; question.answer = a * b; }
            else { b = randomInt(2, 15 * difficulty); a = b * randomInt(2, 20); question.text = `${a} ÷ ${b} = ?`; question.answer = a / b; }
            break;
        case "Kasrlar":
            let num1 = randomInt(1, 8), den1 = randomInt(2, 9), num2 = randomInt(1, 8), den2 = randomInt(2, 9);
            let opKasr = randomInt(1, 3);
            if (opKasr === 1) {
                let resultNum = num1 * den2 + num2 * den1;
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} + ${num2}/${den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            } else if (opKasr === 2) {
                let resultNum = Math.abs(num1 * den2 - num2 * den1);
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} - ${num2}/${den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            } else {
                let resultNum = num1 * num2;
                let resultDen = den1 * den2;
                question.text = `${num1}/${den1} × ${num2}/{den2} = ? (o'nlik)`;
                question.answer = parseFloat((resultNum / resultDen).toFixed(3));
            }
            break;
        case "Foizlar":
            let total = randomInt(100, 500 * difficulty);
            let percent = randomInt(5, 45);
            question.text = `${percent}% of ${total} = ?`;
            question.answer = (percent * total) / 100;
            break;
        case "Daraja":
            let base = randomInt(2, Math.min(8, difficulty + 2));
            let exp = randomInt(2, Math.min(4, difficulty));
            question.text = `${base}^${exp} = ?`;
            question.answer = Math.pow(base, exp);
            break;
        case "Ildiz":
            let sqrtVal = randomInt(2, 15) ** 2;
            question.text = `√${sqrtVal} = ?`;
            question.answer = Math.sqrt(sqrtVal);
            break;
        case "Proportsiya":
            let a1 = randomInt(2, 8), b1 = randomInt(2, 8), c1 = randomInt(2, 8);
            let xProp = (b1 * c1) / a1;
            question.text = `${a1} : ${b1} = ${c1} : x, x = ?`;
            question.answer = parseFloat(xProp.toFixed(2));
            break;
        case "Bir noma'lumli tenglama":
            let a2 = randomInt(2, 5), b2 = randomInt(3, 12), c2 = randomInt(15, 40);
            let xEq = (c2 - b2) / a2;
            question.text = `${a2}x + ${b2} = ${c2}, x = ?`;
            question.answer = parseFloat(xEq.toFixed(2));
            break;
        case "Ikki noma'lumli tenglama":
            let xVal = randomInt(2, 8), yVal = randomInt(2, 8);
            let sum = xVal + yVal, diff = xVal - yVal;
            question.text = `x + y = ${sum}, x - y = ${diff}, x = ?`;
            question.answer = xVal;
            break;
        case "Kvadrat tenglama":
            let root1 = randomInt(2, 5), root2 = randomInt(3, 6);
            let bQuad = -(root1 + root2), cQuad = root1 * root2;
            question.text = `x² ${bQuad >= 0 ? '+' : ''}${bQuad}x ${cQuad >= 0 ? '+' : ''}${cQuad} = 0 (kichik ildiz)`;
            question.answer = Math.min(root1, root2);
            break;
        case "Kvadrat funksiya":
            let aQuad = randomInt(1, 3), bQuadF = -randomInt(4, 10);
            let vertexX = -bQuadF / (2 * aQuad);
            question.text = `y = ${aQuad}x² ${bQuadF >= 0 ? '+' : ''}${bQuadF}x funksiyaning tepa nuqtasi x = ?`;
            question.answer = parseFloat(vertexX.toFixed(1));
            break;
        case "Logarifm (asosiy)":
            let logBase = randomInt(2, 4), logPower = randomInt(2, 4);
            let logValue = Math.pow(logBase, logPower);
            question.text = `log${logBase}(${logValue}) = ?`;
            question.answer = logPower;
            break;
        case "Logarifmik tenglama":
            let lgBase = randomInt(2, 4), lgPower = randomInt(2, 4);
            let lgAnswer = Math.pow(lgBase, lgPower);
            question.text = `log${lgBase}(x) = ${lgPower}, x = ?`;
            question.answer = lgAnswer;
            break;
        case "Trigonometriya":
            let angles = [0, 30, 45, 60, 90];
            let angle = angles[randomInt(0, angles.length - 1)];
            let trigFunc = randomInt(1, 2);
            let rad = angle * Math.PI / 180;
            if (trigFunc === 1) { question.text = `sin(${angle}°) = ?`; question.answer = parseFloat(Math.sin(rad).toFixed(4)); }
            else { question.text = `cos(${angle}°) = ?`; question.answer = parseFloat(Math.cos(rad).toFixed(4)); }
            break;
        case "Trigonometrik tenglama":
            let targetAngle = [30, 45, 60][randomInt(0, 2)];
            let targetRad = targetAngle * Math.PI / 180;
            let targetSin = parseFloat(Math.sin(targetRad).toFixed(3));
            question.text = `sin(x) = ${targetSin} (0° < x < 90°), x = ?`;
            question.answer = targetAngle;
            break;
        case "Arifmetik progressiya":
            let a1_ap = randomInt(2, 8), d = randomInt(2, 5), n_ap = randomInt(4, 8);
            let an_ap = a1_ap + (n_ap - 1) * d;
            question.text = `a₁ = ${a1_ap}, d = ${d}, a_${n_ap} = ?`;
            question.answer = an_ap;
            break;
        case "Geometrik progressiya":
            let a1_gp = randomInt(2, 5), q = randomInt(2, 4), n_gp = randomInt(3, 6);
            let gn = a1_gp * Math.pow(q, n_gp - 1);
            question.text = `a₁ = ${a1_gp}, q = ${q}, a_${n_gp} = ?`;
            question.answer = gn;
            break;
        case "Limit":
            let limX = randomInt(2, 5);
            question.text = `lim(x→${limX}) (x² - ${limX*limX})/(x - ${limX}) = ?`;
            question.answer = 2 * limX;
            break;
        case "Hosila":
            let power = randomInt(2, 3), coeff = randomInt(2, 4), xDer = randomInt(1, 3);
            let deriv = coeff * power * Math.pow(xDer, power - 1);
            question.text = `f(x) = ${coeff}x^${power}, f'(${xDer}) = ?`;
            question.answer = deriv;
            break;
        case "Integral (asosiy)":
            let aInt = randomInt(0, 1), bInt = randomInt(2, 4), intPow = randomInt(1, 2);
            let integralVal = (Math.pow(bInt, intPow + 1) - Math.pow(aInt, intPow + 1)) / (intPow + 1);
            question.text = `∫${aInt} to ${bInt} x^${intPow} dx = ?`;
            question.answer = parseFloat(integralVal.toFixed(3));
            break;
        case "Aniq integral":
            let aInt2 = randomInt(0, 1), bInt2 = randomInt(2, 3), intPow2 = randomInt(1, 2);
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
        this.globalLevel = 1;
        this.totalTests = 0;
        this.testHistory = [];
        this.streak = 0;
        this.lastTestDate = null;
        this.masteredTopics = {};
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
            this.masteredTopics = data.masteredTopics || {};
        }
        TOPICS.forEach(topic => {
            if (!this.masteredTopics[topic]) this.masteredTopics[topic] = 0;
        });
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
            lastTestDate: this.lastTestDate,
            masteredTopics: this.masteredTopics
        };
        localStorage.setItem("mathai_users", JSON.stringify(users));
        localStorage.setItem("mathai_current_user", JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName
        }));
        this.updateUI();
    }
    
    updateTopicMastery(topicName, isCorrect) {
        if (isCorrect && this.masteredTopics[topicName] < 10) {
            this.masteredTopics[topicName] = Math.min(10, this.masteredTopics[topicName] + 0.5);
        } else if (!isCorrect && this.masteredTopics[topicName] > 0) {
            this.masteredTopics[topicName] = Math.max(0, this.masteredTopics[topicName] - 0.3);
        }
        this.saveProgress();
        return this.masteredTopics[topicName];
    }
    
    updateLevelFromTest(percent) {
        let oldLevel = this.globalLevel;
        let levelIncrease = 0;
        if (percent >= 90) levelIncrease = 1.0;
        else if (percent >= 75) levelIncrease = 0.75;
        else if (percent >= 65) levelIncrease = 0.5;
        else if (percent >= 50) levelIncrease = 0.25;
        let newLevel = Math.min(10, oldLevel + levelIncrease);
        this.globalLevel = newLevel;
        if (newLevel > oldLevel) this.showLevelUpToast(oldLevel, newLevel);
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

// ============= TEST SAVOLLARINI YARATISH =============
function generateTestQuestions() {
    if (!currentUser) return;
    currentQuestions = [];
    currentAnswers = [];
    let level = Math.min(10, Math.max(1, Math.floor(currentUser.globalLevel)));
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
}

// ============= TOAST XABARI =============
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.background = type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#ef4444');
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
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
    showToast(`👋 Xush kelibsiz, ${firstName}! Sizning darajangiz: ${currentUser.globalLevel}`, "success");
}

function logout() {
    localStorage.removeItem("mathai_current_user");
    location.reload();
}

// ============= TEST FUNKSIYALARI =============
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
                <span style="font-size:14px; color:#4f46e5;">⭐ Qiyinlik: ${question.level}/10</span><br><br>
                ${question.text}
            </div>
            <input type="number" id="currentAnswer" class="question-input" placeholder="Javobingizni yozing" step="any">
        `;
    }
    document.getElementById("questionCounter").innerText = currentQuestionIndex + 1;
    document.getElementById("explanationBox").style.display = "none";
    setTimeout(() => { const input = document.getElementById("currentAnswer"); if (input) input.focus(); }, 100);
}

function submitAnswer() {
    const input = document.getElementById("currentAnswer");
    if (!input) return;
    const userAnswer = parseFloat(input.value);
    const correctAnswer = currentAnswers[currentQuestionIndex];
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    if (isNaN(userAnswer)) { alert("Iltimos, javobingizni raqam bilan yozing!"); return; }
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;
    userAnswers.push({ userAnswer: userAnswer, correctAnswer: correctAnswer, isCorrect: isCorrect, topic: currentTopic });
    currentUser.updateTopicMastery(currentTopic, isCorrect);
    if (isCorrect) {
        userScore++;
        showToast("✅ To'g'ri javob!", "success");
    } else {
        showToast(`❌ Xato! To'g'ri javob: ${correctAnswer}`, "error");
        showTopicLesson(currentTopic);
    }
    currentQuestionIndex++;
    if (currentQuestionIndex >= TOPICS.length) finishTest();
    else showCurrentQuestion();
}

function skipQuestion() {
    if (currentQuestionIndex >= TOPICS.length) return;
    const currentTopic = currentQuestions[currentQuestionIndex].topic;
    userAnswers.push({ isCorrect: false, topic: currentTopic, skipped: true });
    currentUser.updateTopicMastery(currentTopic, false);
    showToast("⏭ Savol o'tkazib yuborildi", "warning");
    showTopicLesson(currentTopic);
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
    document.getElementById("resultDetails").innerHTML = `<p>⏱ Sarflangan vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p><p>🎯 Yangi darajangiz: <strong>${currentUser.globalLevel.toFixed(1)}/10</strong></p>`;
    let weakHtml = "";
    const weakTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.topic);
    if (weakTopics.length > 0) {
        weakHtml = `<h4>📖 O'rganishingiz kerak:</h4><div class="weak-topics-list">${weakTopics.slice(0, 5).map(t => `<span class="weak-topic" onclick="showTopicLesson('${t}')">${t}</span>`).join('')}</div>`;
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

// ============= DARSLAR VA O'RGATISH FUNKSIYALARI =============
function showTopicLesson(topicName) {
    const data = TOPICS_DATA[topicName];
    if (!data) return;
    const modal = document.getElementById("lessonModal");
    const modalBody = document.getElementById("modalBody");
    const mastery = currentUser ? currentUser.masteredTopics[topicName] : 0;
    if (modalBody) {
        modalBody.innerHTML = `
            <div style="max-height:70vh; overflow-y:auto;">
                <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white; padding:15px; border-radius:12px; margin-bottom:20px; text-align:center;">
                    <i class="fas fa-chalkboard-user" style="font-size:40px;"></i>
                    <h2>${data.name}</h2>
                    <div style="margin-top:10px;"><div class="progress-bar" style="background:rgba(255,255,255,0.3); height:8px; border-radius:10px;"><div style="width:${mastery * 10}%; background:white; height:100%; border-radius:10px;"></div></div><div>O'zlashtirish: ${Math.round(mastery * 10)}%</div></div>
                </div>
                <div class="formula-box" style="background:#f0fdf4; padding:15px; border-radius:12px; margin-bottom:15px;"><h3>📐 Asosiy formulalar</h3><p>${data.formula}</p></div>
                <div class="formula-box" style="background:#eef2ff; padding:15px; border-radius:12px; margin-bottom:15px;"><h3>📏 Qoidalar</h3><ul>${data.rules.map(r => `<li>${r}</li>`).join('')}</ul></div>
                <div class="formula-box" style="background:#fff3e0; padding:15px; border-radius:12px; margin-bottom:15px;"><h3>📝 Misollar</h3><ul>${data.examples.map(e => `<li>${e}</li>`).join('')}</ul></div>
                <div class="formula-box" style="background:#f3e8ff; padding:15px; border-radius:12px; margin-bottom:15px;"><h3>✏️ Amaliy topshiriqlar</h3><pre style="white-space:pre-wrap;">${data.practice}</pre></div>
                <div class="formula-box" style="background:#e8f0fe; padding:15px; border-radius:12px; margin-bottom:15px;"><h3>📖 Batafsil</h3><p>${data.explanation}</p></div>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="btn btn-primary" onclick="startTopicPractice('${topicName}')" style="flex:1;">🎯 Amaliy mashq</button>
                    <button class="btn btn-outline" onclick="closeLessonModal()" style="flex:1;">Tushunildi</button>
                </div>
            </div>
        `;
    }
    document.getElementById("modalTitle").innerHTML = `<i class="fas fa-book-open"></i> ${data.name}`;
    const modal = document.getElementById("lessonModal");
    if (modal) modal.style.display = "flex";
}

let practiceQuestion = null;

async function startTopicPractice(topicName) {
    closeLessonModal();
    const level = currentUser ? Math.floor(currentUser.globalLevel) : 1;
    practiceQuestion = generateRandomQuestion(topicName, level);
    const userAnswer = prompt(`✏️ Amaliy mashq - ${topicName}\n\nSavol: ${practiceQuestion.text}\n\nJavobingizni yozing:`);
    if (userAnswer !== null) {
        const userNum = parseFloat(userAnswer);
        const isCorrect = !isNaN(userNum) && Math.abs(userNum - practiceQuestion.answer) < 0.01;
        if (isCorrect) {
            showToast(`✅ To'g'ri javob! "${topicName}" mavzusini yaxshi tushungansiz!`, "success");
            if (currentUser) currentUser.updateTopicMastery(topicName, true);
        } else {
            showToast(`❌ Xato! To'g'ri javob: ${practiceQuestion.answer}. Qayta o'rganing!`, "error");
            if (currentUser) currentUser.updateTopicMastery(topicName, false);
            showTopicLesson(topicName);
        }
        if (currentUser) {
            currentUser.saveProgress();
            updateTopicsGrid();
            updateStatisticsPage();
        }
    }
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
    grid.innerHTML = TOPICS.map(topic => {
        const mastery = currentUser ? (currentUser.masteredTopics[topic] || 0) : 0;
        return `<div class="topic-card" onclick="showTopicLesson('${topic}')"><i class="fas fa-chalkboard-user"></i><h4>${topic}</h4><div style="margin:10px 0;"><div class="progress-bar" style="height:6px;"><div style="width:${mastery * 10}%; height:100%; background:linear-gradient(90deg,#4f46e5,#10b981); border-radius:10px;"></div></div><small>O'zlashtirish: ${Math.round(mastery * 10)}%</small></div></div>`;
    }).join('');
}

function updateLessonsPage() {
    const grid = document.getElementById("lessonsGrid");
    if (!grid) return;
    grid.innerHTML = TOPICS.map(topic => `
        <div class="topic-card" onclick="showTopicLesson('${topic}')">
            <i class="fas fa-book-open"></i>
            <h4>${topic}</h4>
            <p style="font-size:12px; color:#666; margin:10px 0;">${TOPICS_DATA[topic].formula.substring(0, 50)}...</p>
            <button class="btn btn-primary" style="margin-top:12px; width:100%;" onclick="event.stopPropagation(); showTopicLesson('${topic}')">📚 O'rganish</button>
        </div>
    `).join('');
}

function filterLessons() {
    const search = document.getElementById("lessonSearch")?.value.toLowerCase() || "";
    const cards = document.querySelectorAll("#lessonsGrid .topic-card");
    cards.forEach(card => {
        const title = card.querySelector("h4")?.innerText.toLowerCase() || "";
        card.style.display = title.includes(search) ? "block" : "none";
    });
}

// ============= SAHIFALAR =============
function switchToPage(pageName) {
    console.log("Sahifa o'zgartirilmoqda:", pageName);
    
    const pages = ['homePage', 'testPage', 'statisticsPage', 'lessonsPage', 'aiPage'];
    pages.forEach(page => {
        const el = document.getElementById(page);
        if (el) el.classList.remove('active');
    });
    
    const target = document.getElementById(`${pageName}Page`);
    if (target) target.classList.add('active');
    else { console.error("Sahifa topilmadi:", pageName + "Page"); return; }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageName) item.classList.add('active');
    });
    
    const titles = { home: "MathAI", test: "Test topshirish", statistics: "Mening statistikam", lessons: "Darslar", ai: "AI yordamchi" };
    const pageTitle = document.getElementById("pageTitle");
    if (pageTitle) pageTitle.innerText = titles[pageName] || "MathAI";
    
    if (pageName === "lessons") {
        const searchInput = document.getElementById("lessonSearch");
        if (searchInput && typeof filterLessons === 'function') searchInput.addEventListener('input', filterLessons);
        if (typeof updateLessonsPage === 'function') updateLessonsPage();
    }
    if (pageName === "statistics" && currentUser && typeof updateStatisticsPage === 'function') updateStatisticsPage();
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
    if(document.getElementById("lessonSearch")) document.getElementById("lessonSearch").addEventListener("input", filterLessons);
    
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
// ============= GLOBAL FUNKSIYALAR REGISTRATSIYASI =============
window.registerUser = registerUser;
window.initTest = initTest;
window.submitAnswer = submitAnswer;
window.skipQuestion = skipQuestion;
window.restartTest = restartTest;
window.logout = logout;
window.switchToPage = switchToPage;
window.showTopicLesson = showTopicLesson;
window.closeLessonModal = closeLessonModal;
window.sendChatMessage = sendChatMessage;
window.toggleDarkMode = toggleDarkMode;
window.startTopicPractice = startTopicPractice;
window.filterLessons = filterLessons;
window.updateLessonsPage = updateLessonsPage;
window.updateTopicsGrid = updateTopicsGrid;
window.updateStatisticsPage = updateStatisticsPage;
window.finishTest = finishTest;
window.showToast = showToast;

console.log("✅ Barcha funksiyalar global qilindi!");
console.log("✅ registerUser tipi:", typeof registerUser);
console.log("✅ initTest tipi:", typeof initTest);
console.log("✅ switchToPage tipi:", typeof switchToPage);
