// State
let currentAnalysis = {
    tone: { type: 'neutral', confidence: 0 },
    emotion: { type: 'neutral', confidence: 0 }
};

// DOM Elements
const textInput = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const sentencePreview = document.getElementById('sentencePreview');
const tonebadge = document.getElementById('toneBadge');
const toneConfidence = document.getElementById('toneConfidence');
const toneProgress = document.getElementById('toneProgress');
const emotionBadge = document.getElementById('emotionBadge');
const emotionConfidence = document.getElementById('emotionConfidence');
const emotionProgress = document.getElementById('emotionProgress');
const explainBtn = document.getElementById('explainBtn');
const explanationDialog = document.getElementById('explanationDialog');
const closeDialog = document.getElementById('closeDialog');

// Simple sentiment analysis lexicon
const sentimentWords = {
    positive: ['happy', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'good', 'love', 'best', 'perfect', 'beautiful', 'awesome', 'brilliant', 'joy', 'delighted'],
    negative: ['bad', 'terrible', 'horrible', 'awful', 'hate', 'worst', 'poor', 'disappointing', 'sad', 'angry', 'frustrated', 'annoyed', 'upset', 'disgusted', 'miserable'],
    emotions: {
        happy: ['happy', 'joy', 'delighted', 'cheerful', 'pleased', 'content'],
        sad: ['sad', 'depressed', 'unhappy', 'sorrowful', 'miserable', 'gloomy'],
        angry: ['angry', 'furious', 'mad', 'irritated', 'annoyed', 'frustrated'],
        excited: ['excited', 'thrilled', 'enthusiastic', 'eager', 'energetic'],
        calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed']
    }
};

// Event Listeners
textInput.addEventListener('input', handleTextChange);
explainBtn.addEventListener('click', openExplanationDialog);
closeDialog.addEventListener('click', closeExplanationDialog);
explanationDialog.addEventListener('click', (e) => {
    if (e.target === explanationDialog) {
        closeExplanationDialog();
    }
});

// Functions
function handleTextChange(e) {
    const text = e.target.value;
    charCount.textContent = text.length;
    
    if (text.trim().length === 0) {
        resetAnalysis();
        return;
    }
    
    analyzeText(text);
}

function analyzeText(text) {
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    let emotionScores = {
        happy: 0,
        sad: 0,
        angry: 0,
        excited: 0,
        calm: 0
    };
    
    // Analyze each word
    const analyzedWords = text.split(/\s+/).map(word => {
        const lowerWord = word.toLowerCase();
        let analysis = {
            word: word,
            tone: 'neutral',
            emotion: 'neutral',
            isHighlighted: false
        };
        
        if (sentimentWords.positive.includes(lowerWord)) {
            positiveCount++;
            analysis.tone = 'positive';
            analysis.isHighlighted = true;
        } else if (sentimentWords.negative.includes(lowerWord)) {
            negativeCount++;
            analysis.tone = 'negative';
            analysis.isHighlighted = true;
        }
        
        // Check emotions
        for (const [emotion, keywords] of Object.entries(sentimentWords.emotions)) {
            if (keywords.includes(lowerWord)) {
                emotionScores[emotion]++;
                analysis.emotion = emotion;
                analysis.isHighlighted = true;
            }
        }
        
        return analysis;
    });
    
    // Determine overall tone
    const totalSentiment = positiveCount + negativeCount;
    let toneType = 'neutral';
    let toneConf = 50;
    
    if (totalSentiment > 0) {
        if (positiveCount > negativeCount) {
            toneType = 'positive';
            toneConf = Math.min(95, 60 + (positiveCount / totalSentiment) * 35);
        } else if (negativeCount > positiveCount) {
            toneType = 'negative';
            toneConf = Math.min(95, 60 + (negativeCount / totalSentiment) * 35);
        } else {
            toneConf = 65;
        }
    }
    
    // Determine primary emotion
    let primaryEmotion = 'neutral';
    let emotionConf = 50;
    let maxEmotionScore = 0;
    
    for (const [emotion, score] of Object.entries(emotionScores)) {
        if (score > maxEmotionScore) {
            maxEmotionScore = score;
            primaryEmotion = emotion;
            emotionConf = Math.min(95, 55 + score * 15);
        }
    }
    
    // Update state
    currentAnalysis = {
        tone: { type: toneType, confidence: Math.round(toneConf) },
        emotion: { type: primaryEmotion, confidence: Math.round(emotionConf) }
    };
    
    // Update UI
    updateSentencePreview(analyzedWords);
    updateToneAnalysis();
    updateEmotionAnalysis();
}

function updateSentencePreview(analyzedWords) {
    if (analyzedWords.length === 0 || (analyzedWords.length === 1 && !analyzedWords[0].word)) {
        sentencePreview.innerHTML = '<p class="empty-state">Enter text to see analysis...</p>';
        return;
    }
    
    const html = analyzedWords.map(word => {
        if (!word.isHighlighted) {
            return `<span class="word">${word.word}</span>`;
        }
        return `<span class="word ${word.tone}" title="Tone: ${word.tone}, Emotion: ${word.emotion}">${word.word}</span>`;
    }).join(' ');
    
    sentencePreview.innerHTML = html;
}

function updateToneAnalysis() {
    const { type, confidence } = currentAnalysis.tone;
    
    toneBadge.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    toneBadge.className = `badge ${type}`;
    
    toneConfidence.textContent = `${confidence}%`;
    toneProgress.style.width = `${confidence}%`;
    toneProgress.className = `progress-fill ${type}`;
}

function updateEmotionAnalysis() {
    const { type, confidence } = currentAnalysis.emotion;
    
    emotionBadge.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    emotionConfidence.textContent = `${confidence}%`;
    emotionProgress.style.width = `${confidence}%`;
}

function resetAnalysis() {
    sentencePreview.innerHTML = '<p class="empty-state">Enter text to see analysis...</p>';
    
    currentAnalysis = {
        tone: { type: 'neutral', confidence: 0 },
        emotion: { type: 'neutral', confidence: 0 }
    };
    
    toneBadge.textContent = '-';
    toneBadge.className = 'badge';
    toneConfidence.textContent = '0%';
    toneProgress.style.width = '0%';
    
    emotionBadge.textContent = '-';
    emotionConfidence.textContent = '0%';
    emotionProgress.style.width = '0%';
}

function openExplanationDialog() {
    const { tone, emotion } = currentAnalysis;
    
    // Update dialog content
    const dialogToneBadge = document.getElementById('dialogToneBadge');
    const dialogEmotionBadge = document.getElementById('dialogEmotionBadge');
    const toneExplanation = document.getElementById('toneExplanation');
    const emotionExplanation = document.getElementById('emotionExplanation');
    
    dialogToneBadge.textContent = tone.type.charAt(0).toUpperCase() + tone.type.slice(1);
    dialogToneBadge.className = `badge ${tone.type}`;
    
    dialogEmotionBadge.textContent = emotion.type.charAt(0).toUpperCase() + emotion.type.slice(1);
    
    toneExplanation.textContent = getToneExplanation(tone.type);
    emotionExplanation.textContent = getEmotionExplanation(emotion.type);
    
    explanationDialog.classList.add('active');
}

function closeExplanationDialog() {
    explanationDialog.classList.remove('active');
}

function getToneExplanation(toneType) {
    switch (toneType) {
        case 'positive':
            return "The text contains uplifting language, optimistic phrases, or words that convey enthusiasm and positivity.";
        case 'negative':
            return "The text includes words or phrases that express criticism, sadness, anger, or other negative sentiments.";
        default:
            return "The text maintains a balanced or factual tone without strong emotional indicators in either direction.";
    }
}

function getEmotionExplanation(emotionType) {
    switch (emotionType.toLowerCase()) {
        case 'happy':
            return "Words indicating joy, contentment, or satisfaction were detected.";
        case 'sad':
            return "Language expressing sorrow, disappointment, or melancholy was identified.";
        case 'angry':
            return "Aggressive or frustrated language patterns were found.";
        case 'excited':
            return "High-energy, enthusiastic expressions were detected.";
        case 'calm':
            return "Peaceful, serene, or tranquil language was identified.";
        default:
            return "The emotional content appears balanced without strong indicators of specific emotions.";
    }
}