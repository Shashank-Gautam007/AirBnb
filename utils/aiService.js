const { marked } = require('marked');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports.generateTripPlan = async (destination, days, preferences, budget, language) => {
    let languageInstruction = `Respond entirely in ${language || 'English'} language.`;

    if (language === 'Hinglish') {
        languageInstruction = `Respond in Hinglish — that means Hindi conversational tone but written in Roman/English script (not Devanagari), mixing common Hindi and English words naturally, the way people casually text or speak in India. Example style: "Subah sabse pehle Gateway of India jao, phir local train se Colaba ghumo."`;
    }

    const prompt = `Act as a travel expert. Create a detailed ${days}-day itinerary for ${destination}.
    Budget: ${budget || 'moderate'}. Preferences: ${preferences || 'general sightseeing'}.
    Format as day-wise breakdown with morning/afternoon/evening activities. Keep it practical and local.
    ${languageInstruction}`;

    
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
    });

    return marked(response.text);
};