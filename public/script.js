// ============= VERCELLA ISHLAYDI =============
(function() {
    console.log("🚀 MathAI Vercel versiyasi ishga tushdi");

    // ============= MAVZULAR =============
    const TOPICS = [
        "Butun sonlar", "Kasrlar", "Foizlar", "Daraja", "Ildiz",
        "Proportsiya", "Bir noma'lumli tenglama", "Ikki noma'lumli tenglama",
        "Kvadrat tenglama", "Kvadrat funksiya", "Logarifm (asosiy)",
        "Logarifmik tenglama", "Trigonometriya", "Trigonometrik tenglama",
        "Arifmetik progressiya", "Geometrik progressiya", "Limit",
        "Hosila", "Integral", "Aniq integral"
    ];

    // ============= GLOBAL O'ZGARUVCHILAR =============
    let currentUser = null;
    let currentQuestions = [];
    let currentAnswers = [];
    let currentQuestionIndex = 0;
    let userScore = 0;
    let userAnswers = [];
    let timerInterval = null;
    let timeLeft = 900;
    let currentTestLevel = 1;

    // ============= FOYDALANUVCHI KLASSI =============
    class UserProfile {
        constructor(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.fullName = `${firstName} ${lastName}`;
            this.level = 1;
            this.totalTests = 0;
            this.testHistory = [];
            this.streak = 0;
            this.lastTestDate = null;
            this.topicMastery = {};
            this.loadProgress();
        }

        loadProgress() {
            const saved = localStorage.getItem("mathai_user_" + this.fullName);
            if (saved) {
                const data = JSON.parse(saved);
                this.level = data.level || 1;
                this.totalTests = data.totalTests || 0;
                this.testHistory = data.testHistory || [];
                this.streak = data.streak || 0;
                this.topicMastery = data.topicMastery || {};
            }
        }

        saveProgress() {
            const data = {
                firstName: this.firstName,
                lastName: this.lastName,
                level: this.level,
                totalTests: this.totalTests,
                testHistory: this.testHistory,
                streak: this.streak,
                topicMastery: this.topicMastery
            };
            localStorage.setItem("mathai_user_" + this.fullName, JSON.stringify(data));
            localStorage.setItem("mathai_current_user", JSON.stringify({
                firstName: this.firstName,
                lastName: this.lastName,
                fullName: this.fullName
            }));
            this.updateUI();
        }

        updateLevelFromTest(percent) {
            let increase = 0;
            if (percent >= 90) increase = 1.0;
            else if (percent >= 75) increase = 0.75;
            else if (percent >= 60) increase = 0.5;
            else if (percent >= 50) increase = 0.25;
            
            let oldLevel = this.level;
            this.level = Math.min(10, this.level + increase);
            
            if (Math.floor(this.level) > Math.floor(oldLevel)) {
                this.showLevelUpToast(oldLevel, this.level);
            }
            return increase;
        }

        showLevelUpToast(oldLevel, newLevel) {
            showToast(`🎉 DARAJA OSDI! ${oldLevel.toFixed(1)} → ${newLevel.toFixed(1)}`, "success");
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
            
            // Streak hisoblash
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

        updateTopicMastery(topic, isCorrect) {
            if (!this.topicMastery[topic]) {
                this.topicMastery[topic] = { correct: 0, total: 0, level: 0 };
            }
            this.topicMastery[topic].total++;
            if (isCorrect) this.topicMastery[topic].correct++;
            this.topicMastery[topic].level = (this.topicMastery[topic].correct / this.topicMastery[topic].total) * 100;
            this.saveProgress();
        }
    }

    // ============= YORDAMCHI FUNKSIYALAR =============
    function showToast(message, type = "info") {
        const toast = document.createElement('div');
        toast.className = 'toast';
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = "slideOut 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // ============= SAVOL YARATISH =============
    function generateQuestion(topic, level) {
        // Darajaga mos savol yaratish
        const levelMod = Math.min(10, Math.max(1, Math.floor(level)));
        
        switch(topic) {
            case "Butun sonlar":
                if (levelMod <= 3) {
                    let a = randomInt(1, 20);
                    let b = randomInt(1, 20);
                    return { text: `${a} + ${b} = ?`, answer: a + b };
                } else if (levelMod <= 6) {
                    let a = randomInt(10, 100);
                    let b = randomInt(10, 100);
                    return { text: `${a} - ${b} = ?`, answer: a - b };
                } else {
                    let a = randomInt(10, 50);
                    let b = randomInt(2, 10);
                    return { text: `${a} × ${b} = ?`, answer: a * b };
                }
                
            case "Kasrlar":
                if (levelMod <= 3) {
                    let a = randomInt(1, 5);
                    let b = randomInt(2, 6);
                    return { text: `${a}/${b} + ${a}/${b} = ? (kasr ko'rinishida)`, answer: `${2*a}/${b}` };
                } else {
                    let a = randomInt(1, 3);
                    let b = randomInt(2, 4);
                    let c = randomInt(1, 3);
                    let d = randomInt(2, 4);
                    return { text: `${a}/${b} × ${c}/${d} = ? (kasr ko'rinishida)`, answer: `${a*c}/${b*d}` };
                }
                
            case "Foizlar":
                let percent = randomInt(10, 50);
                let number = randomInt(100, 500);
                return { text: `${percent}% of ${number} = ?`, answer: (percent * number) / 100 };
                
            case "Daraja":
                let base = randomInt(2, 5);
                let exp = randomInt(2, 4);
                return { text: `${base}^${exp} = ?`, answer: Math.pow(base, exp) };
                
            case "Ildiz":
                let perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
                let sq = perfectSquares[randomInt(0, perfectSquares.length - 1)];
                return { text: `√${sq} = ?`, answer: Math.sqrt(sq) };
                
            case "Proportsiya":
                let a = randomInt(2, 10);
                let b = randomInt(2, 10);
                let c = randomInt(2, 10);
                let x = (b * c) / a;
                if (Number.isInteger(x)) {
                    return { text: `${a} : ${b} = ${c} : x, x = ?`, answer: x };
                }
                return generateQuestion(topic, level);
                
            case "Bir noma'lumli tenglama":
                let coeff = randomInt(2, 10);
                let constTerm = randomInt(5, 20);
                let result = randomInt(10, 50);
                let xVal = (result - constTerm) / coeff;
                if (Number.isInteger(xVal)) {
                    return { text: `${coeff}x + ${constTerm} = ${result}, x = ?`, answer: xVal };
                }
                return generateQuestion(topic, level);
                
            case "Kvadrat tenglama":
                let roots = [2, 3, 4, 5, 6];
                let r1 = roots[randomInt(0, roots.length - 1)];
                let r2 = roots[randomInt(0, roots.length - 1)];
                let bVal = -(r1 + r2);
                let cVal = r1 * r2;
                return { text: `x² + ${bVal}x + ${cVal} = 0, x₁ = ? (katta ildiz)`, answer: Math.max(r1, r2) };
                
            case "Logarifm (asosiy)":
                let logBase = randomInt(2, 4);
                let logArg = Math.pow(logBase, randomInt(2, 4));
                return { text: `log${logBase}(${logArg}) = ?`, answer: Math.log(logArg) / Math.log(logBase) };
                
            case "Trigonometriya":
                let angles = [0, 30, 45, 60, 90];
                let angle = angles[randomInt(0, angles.length - 1)];
                let sinValues = {0:0, 30:0.5, 45:0.707, 60:0.866, 90:1};
                return { text: `sin(${angle}°) = ? (0.001 gacha)`, answer: sinValues[angle] };
                
            default:
                let num1 = randomInt(1, 20);
                let num2 = randomInt(1, 20);
                return { text: `${num1} + ${num2} = ?`, answer: num1 + num2 };
        }
    }

    // ============= TEST SAVOLLARINI YARATISH =============
    async function generateTestQuestions() {
        if (!currentUser) return [];
        
        currentTestLevel = Math.min(10, Math.max(1, Math.floor(currentUser.level)));
        showToast(`🤖 ${currentTestLevel}-darajaga mos savollar tayyorlanmoqda...`, "info");
        
        const questions = [];
        const answers = [];
        
        for (let i = 0; i < TOPICS.length; i++) {
            const topic = TOPICS[i];
            let level = currentTestLevel;
            
            // O'zlashtirilmagan mavzular uchun qiyinlikni oshirish
            if (currentUser.topicMastery[topic] && currentUser.topicMastery[topic].level < 50) {
                level = Math.min(10, level + 1);
            }
            
            const q = generateQuestion(topic, level);
            questions.push({
                text: q.text,
                answer: q.answer,
                topic: topic,
                level: level
            });
            answers.push(q.answer);
            
            // UI bloklanmasligi uchun kichik delay
            await new Promise(r => setTimeout(r, 50));
        }
        
        showToast(`✅ ${TOPICS.length} ta savol tayyor!`, "success");
        return { questions, answers };
    }

    // ============= REGISTRATSIYA =============
    window.registerUser = function() {
        const firstName = document.getElementById("regFirstName")?.value.trim();
        const lastName = document.getElementById("regLastName")?.value.trim();
        
        if (!firstName || !lastName) {
            showToast("Iltimos, ism va familiyangizni kiriting!", "error");
            return;
        }
        
        currentUser = new UserProfile(firstName, lastName);
        currentUser.saveProgress();
        
        const regPage = document.getElementById("registrationPage");
        const homePage = document.getElementById("homePage");
        if (regPage) regPage.style.display = "none";
        if (homePage) homePage.classList.add("active");
        
        updateTopicsGrid();
        updateLessonsGrid();
        currentUser.updateUI();
        showToast(`👋 Xush kelibsiz, ${firstName}! Darajangiz: ${currentUser.level.toFixed(1)}`, "success");
    };

    window.logout = function() {
        localStorage.removeItem("mathai_current_user");
        location.reload();
    };

    // ============= TEST FUNKSIYALARI =============
    window.initTest = async function() {
        if (!currentUser) {
            showToast("Iltimos, avval ro'yxatdan o'ting!", "error");
            window.switchToPage('home');
            return;
        }
        
        const { questions, answers } = await generateTestQuestions();
        currentQuestions = questions;
        currentAnswers = answers;
        currentQuestionIndex = 0;
        userScore = 0;
        userAnswers = [];
        timeLeft = 900;
        
        const testStart = document.getElementById("testStartSection");
        const testActive = document.getElementById("testActiveSection");
        const testResult = document.getElementById("testResultSection");
        
        if (testStart) testStart.style.display = "none";
        if (testActive) testActive.style.display = "block";
        if (testResult) testResult.style.display = "none";
        
        const totalSpan = document.getElementById("totalQuestions");
        if (totalSpan) totalSpan.innerText = TOPICS.length;
        
        const levelBadge = document.getElementById("currentLevelBadge");
        if (levelBadge) levelBadge.innerText = currentUser.level.toFixed(1);
        
        window.startTimer();
        window.showCurrentQuestion();
    };

    window.startTimer = function() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                window.finishTest();
            } else {
                timeLeft--;
                window.updateTimerDisplay();
            }
        }, 1000);
    };

    window.updateTimerDisplay = function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const timerEl = document.getElementById("timer");
        if (timerEl) timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const progressPercent = (currentQuestionIndex / TOPICS.length) * 100;
        const progressBar = document.getElementById("testProgressBar");
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
    };

    window.showCurrentQuestion = function() {
        if (currentQuestionIndex >= TOPICS.length) {
            window.finishTest();
            return;
        }
        
        const question = currentQuestions[currentQuestionIndex];
        const container = document.getElementById("questionContainer");
        
        if (container) {
            container.innerHTML = `
                <div class="question-text">
                    <strong>📚 ${question.topic}</strong><br>
                    <span style="font-size: 14px; color: #4f46e5;">⭐ Daraja: ${question.level}/10</span><br><br>
                    ${question.text}
                </div>
                <input type="text" id="currentAnswer" class="question-input" placeholder="Javobingizni yozing" autocomplete="off">
            `;
        }
        
        const counterSpan = document.getElementById("questionCounter");
        if (counterSpan) counterSpan.innerText = currentQuestionIndex + 1;
        
        const explanationBox = document.getElementById("explanationBox");
        if (explanationBox) explanationBox.style.display = "none";
        
        setTimeout(() => {
            const input = document.getElementById("currentAnswer");
            if (input) input.focus();
        }, 100);
    };

    window.submitAnswer = function() {
        const input = document.getElementById("currentAnswer");
        if (!input) return;
        
        let userAnswer = input.value.trim();
        const correctAnswer = currentAnswers[currentQuestionIndex];
        const currentTopic = currentQuestions[currentQuestionIndex].topic;
        const questionLevel = currentQuestions[currentQuestionIndex].level;
        
        if (userAnswer === "") {
            showToast("Iltimos, javobingizni yozing!", "warning");
            return;
        }
        
        // Javobni raqamga o'tkazish (kasrlar uchun)
        let numericAnswer;
        if (userAnswer.includes('/')) {
            const parts = userAnswer.split('/');
            if (parts.length === 2) {
                numericAnswer = parseFloat(parts[0]) / parseFloat(parts[1]);
            } else {
                numericAnswer = parseFloat(userAnswer);
            }
        } else {
            numericAnswer = parseFloat(userAnswer);
        }
        
        const isCorrect = !isNaN(numericAnswer) && Math.abs(numericAnswer - correctAnswer) < 0.01;
        
        userAnswers.push({
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            topic: currentTopic
        });
        
        if (currentUser) {
            currentUser.updateTopicMastery(currentTopic, isCorrect);
        }
        
        if (isCorrect) {
            userScore++;
            showToast("✅ To'g'ri javob!", "success");
            currentQuestionIndex++;
            if (currentQuestionIndex >= TOPICS.length) {
                window.finishTest();
            } else {
                window.showCurrentQuestion();
            }
        } else {
            showToast(`❌ Xato javob! To'g'ri javob: ${correctAnswer}`, "error");
            
            // Xato javobda tushuntirish ko'rsatish
            const explanationBox = document.getElementById("explanationBox");
            const explanationContent = document.getElementById("explanationContent");
            if (explanationBox && explanationContent) {
                explanationContent.innerHTML = `
                    <strong>📖 Tushuntirish:</strong><br>
                    To'g'ri javob: ${correctAnswer}<br>
                    Mavzu: ${currentTopic}<br><br>
                    <button class="btn btn-primary" onclick="window.continueAfterExplanation()">Keyingi savol</button>
                `;
                explanationBox.style.display = "block";
            }
        }
    };

    window.continueAfterExplanation = function() {
        currentQuestionIndex++;
        if (currentQuestionIndex >= TOPICS.length) {
            window.finishTest();
        } else {
            window.showCurrentQuestion();
        }
    };

    window.skipQuestion = function() {
        if (currentQuestionIndex >= TOPICS.length) return;
        
        const currentTopic = currentQuestions[currentQuestionIndex].topic;
        userAnswers.push({
            isCorrect: false,
            topic: currentTopic,
            skipped: true
        });
        
        if (currentUser) {
            currentUser.updateTopicMastery(currentTopic, false);
        }
        
        showToast("⏭ Savol o'tkazib yuborildi", "warning");
        currentQuestionIndex++;
        
        if (currentQuestionIndex >= TOPICS.length) {
            window.finishTest();
        } else {
            window.showCurrentQuestion();
        }
    };

    window.finishTest = function() {
        clearInterval(timerInterval);
        
        const timeSpent = 900 - timeLeft;
        const percent = Math.round((userScore / TOPICS.length) * 100);
        
        if (currentUser) {
            currentUser.addTestResult(userScore, TOPICS.length, percent, timeSpent);
        }
        
        // Natijalarni saqlash
        const results = JSON.parse(localStorage.getItem("mathai_results") || "[]");
        results.push({
            id: Date.now(),
            name: currentUser ? currentUser.fullName : "Unknown",
            score: userScore,
            maxScore: TOPICS.length,
            percent: percent,
            levelAfter: currentUser ? currentUser.level : 1,
            timeSpent: timeSpent,
            date: new Date().toLocaleString('uz-UZ')
        });
        localStorage.setItem("mathai_results", JSON.stringify(results));
        
        const testActive = document.getElementById("testActiveSection");
        const testResult = document.getElementById("testResultSection");
        
        if (testActive) testActive.style.display = "none";
        if (testResult) testResult.style.display = "block";
        
        const greetingEl = document.getElementById("resultGreeting");
        if (greetingEl && currentUser) {
            greetingEl.innerHTML = `👋 Salom, <strong>${currentUser.firstName}</strong>!`;
        }
        
        const scoreEl = document.getElementById("resultScore");
        if (scoreEl) scoreEl.innerText = userScore;
        
        const percentEl = document.getElementById("resultPercentage");
        if (percentEl) percentEl.innerHTML = `${percent}%`;
        
        const iconEl = document.getElementById("resultIcon");
        if (iconEl) {
            if (percent >= 90) iconEl.innerHTML = "🏆";
            else if (percent >= 75) iconEl.innerHTML = "🎉";
            else if (percent >= 60) iconEl.innerHTML = "👍";
            else iconEl.innerHTML = "📚";
        }
        
        const detailsEl = document.getElementById("resultDetails");
        if (detailsEl && currentUser) {
            const minutes = Math.floor(timeSpent / 60);
            const seconds = timeSpent % 60;
            detailsEl.innerHTML = `
                <p>⏱ Vaqt: ${minutes > 0 ? `${minutes} daqiqa ${seconds} soniya` : `${seconds} soniya`}</p>
                <p>🎯 Darajangiz: <strong>${currentUser.level.toFixed(1)}/10</strong></p>
            `;
        }
        
        const weakTopics = userAnswers.filter(a => !a.isCorrect).map(a => a.topic);
        const weakListEl = document.getElementById("weakTopicsList");
        if (weakListEl) {
            if (weakTopics.length > 0) {
                const uniqueWeak = [...new Set(weakTopics)].slice(0, 5);
                weakListEl.innerHTML = `
                    <h4>📖 O'rganishingiz kerak:</h4>
                    <div class="weak-topics-list">
                        ${uniqueWeak.map(t => `<span class="weak-topic" onclick="window.openAILesson('${t}')">${t}</span>`).join('')}
                    </div>
                `;
            } else {
                weakListEl.innerHTML = `<p>🎉 A'lo! Barcha savollarga to'g'ri javob berdingiz!</p>`;
            }
        }
        
        window.updateStatistics();
    };

    window.restartTest = function() {
        const testStart = document.getElementById("testStartSection");
        const testResult = document.getElementById("testResultSection");
        
        if (testStart) testStart.style.display = "block";
        if (testResult) testResult.style.display = "none";
    };

    // ============= DARSLAR =============
    window.updateTopicsGrid = function() {
        const grid = document.getElementById("topicsGrid");
        if (!grid) return;
        
        grid.innerHTML = TOPICS.map(topic => {
            let mastered = currentUser && currentUser.topicMastery[topic] 
                ? Math.round(currentUser.topicMastery[topic].level) 
                : 0;
            return `
                <div class="topic-card" onclick="window.openAILesson('${topic}')">
                    <i class="fas fa-chalkboard-user" style="font-size: 32px; color: #4f46e5;"></i>
                    <h4>${topic}</h4>
                    ${mastered > 0 ? `<div class="mastery-level" style="font-size: 12px; color: #10b981;">✅ O'zlashtirish: ${mastered}%</div>` : ''}
                    <button class="btn btn-primary" style="margin-top: 10px;" onclick="event.stopPropagation(); window.openAILesson('${topic}')">📚 AI dars</button>
                </div>
            `;
        }).join('');
    };

    window.updateLessonsGrid = function() {
        const grid = document.getElementById("lessonsGrid");
        if (!grid) return;
        
        grid.innerHTML = TOPICS.map(topic => `
            <div class="topic-card" onclick="window.openAILesson('${topic}')">
                <i class="fas fa-book-open" style="font-size: 32px; color: #4f46e5;"></i>
                <h4>${topic}</h4>
                <p style="font-size: 12px; margin-top: 10px; color: #666;">Formulalar va misollar</p>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="event.stopPropagation(); window.openAILesson('${topic}')">📚 O'qish</button>
            </div>
        `).join('');
    };

    window.openAILesson = function(topicName) {
        const modal = document.getElementById("lessonModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalBody = document.getElementById("modalBody");
        
        if (!modal || !modalBody) return;
        
        // Mavzu bo'yicha ma'lumot
        const topicData = {
            "Butun sonlar": "Butun sonlar - manfiy, nol va musbat sonlar. Masalan: -5, 0, 7. Qo'shish, ayirish, ko'paytirish va bo'lish amallari bajariladi.",
            "Kasrlar": "Kasr - a/b ko'rinishidagi son. a - surat, b - maxraj. Kasrlarni qo'shish uchun umumiy maxrajga keltiriladi.",
            "Foizlar": "Foiz - yuzdan bir qism. P% = P/100. Foizni topish: (qism/butun) × 100%",
            "Daraja": "aⁿ = a × a × ... × a (n marta). a⁰=1, a⁻ⁿ=1/aⁿ, (aᵐ)ⁿ=aᵐⁿ",
            "Ildiz": "√a = b, agar b² = a. (√a)² = a, √(a×b) = √a × √b",
            "Proportsiya": "a:b = c:d → ad = bc. a/b = c/d → x = (b×c)/a",
            "Bir noma'lumli tenglama": "ax + b = c → x = (c-b)/a",
            "Ikki noma'lumli tenglama": "x+y=S, x-y=D → x=(S+D)/2, y=(S-D)/2",
            "Kvadrat tenglama": "ax²+bx+c=0 → D=b²-4ac → x=[-b±√D]/2a",
            "Kvadrat funksiya": "y=ax²+bx+c. Tepa nuqta: x=-b/(2a)",
            "Logarifm (asosiy)": "log_a(b)=c → a^c=b",
            "Logarifmik tenglama": "log_a(x)=b → x=a^b",
            "Trigonometriya": "sin²α+cos²α=1, sin(30°)=0.5",
            "Trigonometrik tenglama": "sin(x)=a → x=arcsin(a)+360°·k",
            "Arifmetik progressiya": "a_n = a₁ + (n-1)d",
            "Geometrik progressiya": "a_n = a₁ × q^(n-1)",
            "Limit": "lim(x→a) f(x)=L",
            "Hosila": "f'(x)=lim(h→0)[f(x+h)-f(x)]/h",
            "Integral": "∫ xⁿ dx = xⁿ⁺¹/(n+1)+C",
            "Aniq integral": "∫_a^b f(x)dx = F(b)-F(a)"
        };
        
        modalTitle.innerHTML = `<i class="fas fa-graduation-cap"></i> ${topicName}`;
        modalBody.innerHTML = `
            <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <h3>${topicName}</h3>
            </div>
            <div class="formula-box">
                <strong>📖 Mavzu haqida:</strong><br>
                <p style="margin-top: 10px;">${topicData[topicName] || `${topicName} mavzusini o'rganing.`}</p>
            </div>
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="window.closeLessonModal()" style="flex: 1;">Tushunildi</button>
                <button class="btn btn-outline" onclick="window.startPracticeForTopic('${topicName}')" style="flex: 1;">✏️ Amaliy mashq</button>
            </div>
        `;
        
        modal.style.display = "flex";
    };

    window.startPracticeForTopic = function(topicName) {
        window.closeLessonModal();
        
        const level = currentUser ? Math.floor(currentUser.level) : 1;
        const question = generateQuestion(topicName, level + 1);
        
        const userAnswer = prompt(`✏️ Amaliy mashq - ${topicName}\n\nSavol: ${question.text}\n\nJavobingizni yozing:`);
        
        if (userAnswer !== null) {
            let numericAnswer;
            if (userAnswer.includes('/')) {
                const parts = userAnswer.split('/');
                numericAnswer = parseFloat(parts[0]) / parseFloat(parts[1]);
            } else {
                numericAnswer = parseFloat(userAnswer);
            }
            
            const isCorrect = !isNaN(numericAnswer) && Math.abs(numericAnswer - question.answer) < 0.01;
            
            if (isCorrect) {
                showToast(`✅ To'g'ri javob!`, "success");
                if (currentUser) {
                    currentUser.updateTopicMastery(topicName, true);
                    window.updateTopicsGrid();
                }
            } else {
                showToast(`❌ Xato! To'g'ri javob: ${question.answer}`, "error");
                if (currentUser) {
                    currentUser.updateTopicMastery(topicName, false);
                }
                window.openAILesson(topicName);
            }
        }
    };

    window.closeLessonModal = function() {
        const modal = document.getElementById("lessonModal");
        if (modal) modal.style.display = "none";
    };

    // ============= STATISTIKA =============
    window.updateStatistics = function() {
        if (!currentUser) return;
        
        const recentList = document.getElementById("recentTestsList");
        if (recentList) {
            if (currentUser.testHistory.length > 0) {
                recentList.innerHTML = currentUser.testHistory.slice(0, 10).map(t => `
                    <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #e2e8f0;">
                        <span>${new Date(t.date).toLocaleDateString('uz-UZ')}</span>
                        <span style="background: ${t.percent >= 75 ? '#10b981' : (t.percent >= 50 ? '#f59e0b' : '#ef4444')}; padding: 4px 12px; border-radius: 20px;">
                            ${t.score}/${t.total} (${t.percent}%)
                        </span>
                    </div>
                `).join('');
            } else {
                recentList.innerHTML = `<div style="padding: 40px; text-align: center;">Hali test topshirilmagan</div>`;
            }
        }
        
        // Mavzu bo'yicha o'zlashtirish jadvali
        const masteryList = document.getElementById("topicMasteryList");
        if (masteryList && currentUser.topicMastery) {
            masteryList.innerHTML = Object.entries(currentUser.topicMastery)
                .sort((a, b) => b[1].level - a[1].level)
                .map(([topic, data]) => `
                    <div style="display: flex; justify-content: space-between; padding: 8px; border-bottom: 1px solid #ddd;">
                        <span>${topic}</span>
                        <span style="color: ${data.level >= 70 ? '#10b981' : (data.level >= 40 ? '#f59e0b' : '#ef4444')}">
                            ${Math.round(data.level)}%
                        </span>
                    </div>
                `).join('');
        }
    };

    // ============= AI CHAT =============
    window.sendChatMessage = function() {
        const input = document.getElementById("chatInput");
        const message = input.value.trim();
        
        if (!message) return;
        
        window.addChatMessage(message, "user");
        input.value = "";
        
        window.addChatMessage('<i class="fas fa-spinner fa-spin"></i> AI javob yozyapti...', "bot", true);
        
        setTimeout(() => {
            window.removeLastBotMessage();
            const reply = window.getAIResponse(message);
            window.addChatMessage(reply, "bot");
        }, 500);
    };

    window.getAIResponse = function(question) {
        const q = question.toLowerCase();
        
        if (q.includes("kvadrat") || q.includes("ildiz")) {
            return "📐 **Kvadrat ildiz** - sonning o'ziga ko'paytirilganda berilgan sonni beradigan qiymat.\n\nMasalan:\n• √16 = 4 (chunki 4×4=16)\n• √25 = 5 (5×5=25)\n• √144 = 12 (12×12=144)\n\nFormulalar:\n• √(a×b) = √a × √b\n• √(a/b) = √a / √b";
        } else if (q.includes("kasr")) {
            return "📐 **Kasrlar** - bu butun sonning bir qismi.\n\nMasalan:\n• 1/2 = 0.5\n• 3/4 = 0.75\n\nKasrlarni qo'shish:\na/b + c/d = (ad + bc)/bd\n\nMasalan: 1/2 + 1/3 = (3+2)/6 = 5/6";
        } else if (q.includes("foiz")) {
            return "📐 **Foizlar** - yuzdan bir qism.\n\nFormulalar:\n• P% = P/100\n• P% of X = (P/100) × X\n\nMasalan: 20% of 150 = (20/100) × 150 = 30\n\nFoizni topish: (qism/butun) × 100%";
        } else if (q.includes("daraja") || q.includes("kvadrat")) {
            return "📐 **Daraja** - sonning o'ziga necha marta ko'paytirilishi.\n\nFormulalar:\n• aⁿ = a × a × ... × a (n marta)\n• a⁰ = 1\n• a⁻ⁿ = 1/aⁿ\n• (aᵐ)ⁿ = aᵐⁿ\n\nMasalan:\n• 2³ = 2×2×2 = 8\n• 5² = 25\n• 10⁴ = 10000";
        } else if (q.includes("tenglama")) {
            return "📐 **Tenglama** - noma'lum o'zgaruvchini topish kerak bo'lgan matematik ifoda.\n\nBir noma'lumli tenglama:\nax + b = c → x = (c - b)/a\n\nMasalan: 3x + 5 = 20 → 3x = 15 → x = 5\n\nKvadrat tenglama:\nax² + bx + c = 0 → x = [-b ± √(b² - 4ac)]/2a";
        } else if (q.includes("salom") || q.includes("assalom")) {
            return "Assalomu alaykum! 👋 Men MathAI yordamchisiman. Matematikadan istalgan savolingizga javob beraman. Masalan: 'Kvadrat ildiz nima?', 'Kasrlarni qanday qo'shiladi?', '20% of 50 qancha?'";
        } else {
            return "📚 Men matematik mavzularda yordam bera olaman:\n\n• Kvadrat ildiz (√)\n• Kasrlar (1/2, 3/4)\n• Foizlar (%, 20% of 50)\n• Darajalar (2³, 5²)\n• Tenglamalar (3x+5=20)\n\nQaysi mavzu bo'yicha yordam kerak?";
        }
    };

    window.addChatMessage = function(content, sender, isTemp = false) {
        const container = document.getElementById("chatMessages");
        if (!container) return;
        
        const div = document.createElement("div");
        div.className = `message ${sender}`;
        if (isTemp) div.id = "tempMessage";
        div.innerHTML = `<div class="message-content">${content}</div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    };

    window.removeLastBotMessage = function() {
        const temp = document.getElementById("tempMessage");
        if (temp) temp.remove();
    };

    // ============= SAHIFALAR =============
    window.switchToPage = function(pageName) {
        const pages = ['homePage', 'testPage', 'statisticsPage', 'lessonsPage', 'aiPage'];
        pages.forEach(page => {
            const el = document.getElementById(page);
            if (el) el.classList.remove('active');
        });
        
        const target = document.getElementById(`${pageName}Page`);
        if (target) target.classList.add('active');
        
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            }
        });
        
        if (pageName === 'statistics') {
            window.updateStatistics();
        }
        if (pageName === 'home') {
            window.updateTopicsGrid();
        }
    };

    // ============= DARK MODE =============
    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    };

    function loadDarkMode() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // ============= ADMIN FUNKSIYALARI =============
    window.clearAllData = function() {
        if (confirm("⚠️ Barcha ma'lumotlar o'chiriladi! Davom etasizmi?")) {
            localStorage.clear();
            showToast("✅ Barcha ma'lumotlar tozalandi!", "success");
            setTimeout(() => location.reload(), 1500);
        }
    };

    window.exportToExcel = function() {
        const results = JSON.parse(localStorage.getItem("mathai_results") || "[]");
        let csv = "№,O'quvchi,Ball,Protsent,Sana\n";
        results.forEach((r, i) => {
            csv += `${i+1},${r.name},${r.score}/${r.maxScore},${r.percent}%,${r.date}\n`;
        });
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "mathai_results.csv";
        link.click();
        showToast("Excel fayli yuklandi!", "success");
    };

    window.updateAdminPanel = function() {
        const results = JSON.parse(localStorage.getItem("mathai_results") || "[]");
        const users = [];
        
        // Unique users
        results.forEach(r => {
            if (!users.includes(r.name)) users.push(r.name);
        });
        
        const totalStudentsSpan = document.getElementById("adminTotalStudents");
        const totalTestsSpan = document.getElementById("adminTotalTests");
        const avgScoreSpan = document.getElementById("adminAvgScore");
        const resultsTable = document.getElementById("adminResultsTable");
        
        if (totalStudentsSpan) totalStudentsSpan.innerText = users.length;
        if (totalTestsSpan) totalTestsSpan.innerText = results.length;
        
        let avg = results.length ? results.reduce((s, r) => s + r.percent, 0) / results.length : 0;
        if (avgScoreSpan) avgScoreSpan.innerText = Math.round(avg) + "%";
        
        if (resultsTable) {
            resultsTable.innerHTML = results.slice().reverse().slice(0, 50).map((r, i) => `
                <tr>
                    <td>${i + 1}</td>
                    <td>${r.name}</td>
                    <td>${r.score}/${r.maxScore}</td>
                    <td>${r.percent}%</td>
                    <td>${r.date}</td>
                </tr>
            `).join('');
        }
    };

    // ============= INIT =============
    document.addEventListener('DOMContentLoaded', () => {
        console.log("✅ MathAI Vercel versiyasi ishga tushdi!");
        
        loadDarkMode();
        
        // Dark mode toggle
        const themeToggle = document.getElementById("themeToggle");
        if (themeToggle) {
            themeToggle.addEventListener("click", window.toggleDarkMode);
        }
        
        // Menu toggle
        const menuToggle = document.getElementById("menuToggle");
        const sidebar = document.getElementById("sidebar");
        if (menuToggle && sidebar) {
            menuToggle.addEventListener("click", () => {
                sidebar.classList.toggle("open");
            });
        }
        
        // Navigation
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const page = item.getAttribute("data-page");
                if (page) window.switchToPage(page);
            });
        });
        
        // Modal click outside
        window.onclick = (e) => {
            const modal = document.getElementById("lessonModal");
            if (e.target === modal) window.closeLessonModal();
        };
        
        // Check saved user
        const savedUser = localStorage.getItem("mathai_current_user");
        if (savedUser) {
            const user = JSON.parse(savedUser);
            currentUser = new UserProfile(user.firstName, user.lastName);
            
            const regPage = document.getElementById("registrationPage");
            const homePage = document.getElementById("homePage");
            if (regPage) regPage.style.display = "none";
            if (homePage) homePage.classList.add("active");
            
            currentUser.updateUI();
            window.updateTopicsGrid();
            window.updateLessonsGrid();
            window.updateStatistics();
        }
        
        // Admin panel update if on admin page
        if (document.getElementById("adminPage")) {
            window.updateAdminPanel();
        }
        
        // Search functionality for lessons
        const searchInput = document.getElementById("lessonSearch");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const cards = document.querySelectorAll("#lessonsGrid .topic-card");
                cards.forEach(card => {
                    const title = card.querySelector("h4")?.innerText.toLowerCase() || "";
                    if (title.includes(searchTerm)) {
                        card.style.display = "block";
                    } else {
                        card.style.display = "none";
                    }
                });
            });
        }
    });
})();
