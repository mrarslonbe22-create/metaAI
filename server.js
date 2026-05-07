const express = require('express');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============= API SOZLAMALARI =============
// ✅ TO'G'RI GROQ API KEY (gsk_ bilan boshlanadi)
const GROQ_API_KEY = process.env.GROQ_API_KEY || "gsk_xxxxxxxxxxxxxxxxxxxx"; // <-- YANGI KALITNI SHU YERGA YOZING!
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

let useMock = false; // API ishlasa false, ishlamasa true

// ============= GROQ AI ORQALI SAVOL-JAVOB =============
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ success: false, error: "Savol yozilmagan" });
    }
    
    console.log(`📝 AI so'rovi: ${question}`);
    
    // API key ni tekshirish
    if (!GROQ_API_KEY || GROQ_API_KEY === "gsk_xxxxxxxxxxxxxxxxxxxx") {
        console.log("⚠️ API key kiritilmagan yoki noto'g'ri!");
        return res.json({ 
            success: true, 
            answer: "🔧 API key sozlanmagan. Iltimos, admin bilan bog'laning yoki o'z Groq API key-ingizni oling: console.groq.com" 
        });
    }
    
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Siz MathAI - matematika fanidan sun'iy intellekt yordamchisisiz. 
                        Sizning vazifangiz abituriyentlarga matematikadan yordam berish. 
                        Quyidagi qoidalarga amal qiling:
                        1. Faqat matematik mavzularda javob bering
                        2. Javoblarni o'zbek tilida bering
                        3. Formulalarni aniq va tushunarli yozing
                        4. Misollar bilan tushuntiring
                        5. Agar savol matematikaga oid bo'lmasa, "Men faqat matematik savollarga javob beraman" deb yozing`
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const answer = data.choices[0]?.message?.content || "Javob topilmadi";
            console.log("✅ AI javob berdi");
            useMock = false;
            return res.json({ success: true, answer: answer });
        } else {
            const errorText = await response.text();
            console.log("⚠️ API xatosi:", response.status, errorText);
            useMock = true;
        }
        
    } catch (error) {
        console.error("❌ AI xatosi:", error.message);
        useMock = true;
    }
    
    // Mock javob (AI ishlamasa)
    const mockAnswers = {
        default: "📚 MathAI vaqtincha offline rejimda. Asosiy matematik formulalar:\n\n• Kvadrat tenglama: ax² + bx + c = 0\n• Yechim: x = [-b ± √(b² - 4ac)] / 2a\n\n💡 Tez orada AI ulanishi tiklanadi!",
        "kvadrat": "Kvadrat tenglama ax² + bx + c = 0 ko'rinishida bo'ladi.\n\nYechim formulasi: x = [-b ± √(b² - 4ac)] / 2a\n\nMisol: x² - 5x + 6 = 0\nD = 25 - 24 = 1\nx = (5 ± 1)/2 → x₁ = 3, x₂ = 2",
        "sin": "Trigonometrik qiymatlar:\n• sin(0°) = 0\n• sin(30°) = 1/2 = 0.5\n• sin(45°) = √2/2 ≈ 0.707\n• sin(60°) = √3/2 ≈ 0.866\n• sin(90°) = 1",
        "log": "Logarifm: log_a(b) = c  ⇒  a^c = b\n\nMasalan:\n• log₂(8) = 3, chunki 2³ = 8\n• log₃(27) = 3, chunki 3³ = 27\n• log₅(125) = 3, chunki 5³ = 125",
        "ildiz": "Kvadrat ildiz: √a = b, agar b² = a\n\nMasalan:\n• √64 = 8, chunki 8² = 64\n• √144 = 12, chunki 12² = 144\n• √225 = 15, chunki 15² = 225",
        "daraja": "Daraja: aⁿ = a × a × ... × a (n marta)\n\nMasalan:\n• 2³ = 2×2×2 = 8\n• 3⁴ = 3×3×3×3 = 81\n• 5² = 25"
    };
    
    let answer = mockAnswers.default;
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('kvadrat') || lowerQ.includes('tenglama')) answer = mockAnswers.kvadrat;
    else if (lowerQ.includes('sin') || lowerQ.includes('cos') || lowerQ.includes('trigonometr')) answer = mockAnswers.sin;
    else if (lowerQ.includes('log') || lowerQ.includes('logarifm')) answer = mockAnswers.log;
    else if (lowerQ.includes('ildiz') || lowerQ.includes('kvadrat ildiz')) answer = mockAnswers.ildiz;
    else if (lowerQ.includes('daraja')) answer = mockAnswers.daraja;
    
    res.json({ success: true, answer: answer + "\n\n💡 Maslahat: AI to'liq ulanishi uchun Groq API key sozlanishi kerak." });
});

// ============= AI MASLAHAT =============
app.post('/api/advice', async (req, res) => {
    const { weakTopics, score } = req.body;
    
    let advice = "";
    const percent = score * 5;
    
    if (percent >= 80) {
        advice = "🎉 Siz matematikani juda yaxshi bilasiz! Murakkab mavzularga o'tishga tayyorsiz: limit, hosila, integral.";
    } else if (percent >= 60) {
        advice = `👍 Yaxshi natija! ${weakTopics.join(", ")} mavzularida biroz kamchiliklar bor. Ushbu mavzularni qayta o'rganib chiqishni tavsiya qilaman.`;
    } else if (percent >= 40) {
        advice = `📚 O'rta daraja. ${weakTopics.join(", ")} mavzularini chuqurroq o'rganishingiz kerak. Formulalarni yozib chiqing va ko'proq amaliyot qiling.`;
    } else {
        advice = `💪 Boshlang'ich daraja. Asosiy mavzulardan boshlang: ${weakTopics.join(", ")}. Avval formulalarni o'rganing, keyin oddiy misollardan boshlang.`;
    }
    
    res.json({ success: true, advice: advice });
});

// ============= NATIJALARNI SAQLASH =============
app.post('/api/save-result', (req, res) => {
    const result = req.body;
    console.log("📊 Natija saqlandi:", result.name, result.score, "/", result.maxScore);
    res.json({ success: true, message: "Natija saqlandi" });
});

// ============= SHABLONLAR =============
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/lesson.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lesson.html'));
});

// ============= SERVERNI ISHGA TUSHIRISH =============
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                 🧠 MathAI Server                      ║
╠══════════════════════════════════════════════════════╣
║  Port: ${PORT}                                          ║
║  AI: ${GROQ_API_KEY && GROQ_API_KEY !== "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" ? "✅ Groq AI (Llama 3.3)" : "⚠️ API key kiritilmagan"}   ║
║  Admin panel: /admin.html                            ║
║  Test: /                                             ║
╚══════════════════════════════════════════════════════╝
    `);
});
