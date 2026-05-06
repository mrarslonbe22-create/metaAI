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

// API Key (sizning bergan keyingiz)
const GROQ_API_KEY = "prj_tgEaBqyCUxAwuz9cSFdOuadn44bd";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Demo rejimi (agar API ishlamasa)
let useMock = true;

// ============= GROQ AI ORQALI SAVOL-JAVOB =============
app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ success: false, error: "Savol yozilmagan" });
    }
    
    console.log(`📝 AI so'rovi: ${question}`);
    
    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
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
            console.log("⚠️ API xatosi, demo rejimga o'tish");
            useMock = true;
        }
        
    } catch (error) {
        console.error("❌ AI xatosi:", error.message);
        useMock = true;
    }
    
    // Demo rejim (API ishlamasa)
    const mockAnswers = {
        default: "📚 MathAI demo rejimda ishlayapti. Asosiy API ulanishi tekshirilmoqda. Quyida matematik masalalar yechimini ko'rib chiqishingiz mumkin:\n\n• Kvadrat tenglama: ax² + bx + c = 0\n• Yechim: x = [-b ± √(b² - 4ac)] / 2a",
        "kvadrat": "Kvadrat tenglama ax² + bx + c = 0 ko'rinishida bo'ladi. Yechim formulasi: x = [-b ± √(b² - 4ac)] / 2a",
        "sin": "sin(30°) = 1/2, sin(45°) = √2/2, sin(60°) = √3/2, sin(90°) = 1",
        "log": "Logarifm: log_a(b) = c  ⇒  a^c = b. Masalan: log₂(8) = 3, chunki 2³ = 8"
    };
    
    let answer = mockAnswers.default;
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes('kvadrat') || lowerQ.includes('tenglama')) answer = mockAnswers.kvadrat;
    else if (lowerQ.includes('sin') || lowerQ.includes('cos') || lowerQ.includes('trigonometr')) answer = mockAnswers.sin;
    else if (lowerQ.includes('log') || lowerQ.includes('logarifm')) answer = mockAnswers.log;
    
    res.json({ success: true, answer: answer + "\n\n💡 Maslahat: API to'liq ulanganida, barcha savollaringizga aniq javob olasiz!" });
});

// ============= AI MASLAHAT =============
app.post('/api/advice', async (req, res) => {
    const { weakTopics, score } = req.body;
    
    let advice = "";
    const percent = score * 5; // 20 ballik tizim
    
    if (percent >= 80) {
        advice = "🎉 Siz matematikani juda yaxshi bilasiz! Murakkab mavzularga o'tishga tayyorsiz: limit, hosila, integral. Oliygoh testlariga tayyor bo'ling!";
    } else if (percent >= 60) {
        advice = `👍 Yaxshi natija! ${weakTopics.join(", ")} mavzularida biroz kamchiliklar bor. Ushbu mavzularni qayta o'rganib chiqishni tavsiya qilaman. Har kuni 10 ta misol yeching.`;
    } else if (percent >= 40) {
        advice = `📚 O'rta daraja. ${weakTopics.join(", ")} mavzularini chuqurroq o'rganishingiz kerak. Formulalarni yozib chiqing va ko'proq amaliyot qiling.`;
    } else {
        advice = `💪 Boshlang'ich daraja. Asosiy mavzulardan boshlang: ${weakTopics.join(", ")}. Avval formulalarni o'rganing, keyin oddiy misollardan boshlang. Har kuni 30 daqiqa vaqt ajrating!`;
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
╔══════════════════════════════════════╗
║      🧠 MathAI Server ishga tushdi    ║
╠══════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  AI: ${useMock ? "🔄 Demo rejim" : "✅ Groq AI (Llama 3.3)"}   ║
║  Admin paneli: /admin.html           ║
║  Test: /                             ║
╚══════════════════════════════════════╝
    `);
});
