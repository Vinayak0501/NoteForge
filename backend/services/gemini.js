const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
});


async function generateFlashCards(content){

    const prompt = `From this text, generate 8 flashcards as a JSON array. Return ONLY the JSON array, no extra text, no markdown, no backticks.
    Format: [{
        "front": "question here",
        "back": "answer here"
    }]
    Text: ${content}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);

}


async function generateQuiz(content){

    const prompt = `Generate 5 multiple choice questions from this text as a JSON array. Return ONLY the JSON array, no extra text, no markdown, no backticks.
    Format: [{
        "question": "question here",
        "options": ["A", "B", "C", "D"],
        "answer": "correct option here"
    }]
    Text: ${content}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);

}

async function generateSummary(content){

    const prompt = `Summarise this text in 5 bullet points, each maximum 20 words. Return ONLY the bullet point, no extra text.
    Text: ${content}`;

    const result = await model.generateContent(prompt);
    const text= result.response.text();
    return text;

}


module.exports = { generateFlashCards, generateQuiz, generateSummary };