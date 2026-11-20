// backend/src/services/aiService.js
// Note: .env is loaded by index.js on startup — no need to re-load here.

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// MiniMax configuration
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.chat';

// Enhanced System prompt for exciting pickup lines
const SYSTEM_PROMPT = `You are a CREATIVE, EXCITING pickup line generator for Myanmar (Burmese) speakers. Your job is to create SUPER ENGAGING pickup lines that make people smile, laugh, or feel special!

🔥 CRITICAL RULES - FOLLOW THESE EXACTLY:
1. Write 100% in Burmese/Myanmar language (မြန်မာစာ)
2. Make it EXCITING, FUN, and MEMORABLE - not boring!
3. The pickup line MUST relate to the user's specific interest (movies, tech, gaming, etc.)
4. Use creative comparisons, movie quotes, tech metaphors, game references, or fun facts related to the interest
5. Be playful and flirty but NEVER inappropriate or offensive
6. Add emoji where appropriate for extra charm
7. Keep it 1-2 short sentences max

🎬 FOR MOVIES/FILM GEEKS:
- Reference famous movie scenes, dialogue, or characters
- Use cinematography terms metaphorically
- Compare them to iconic movie moments

💻 FOR TECH/GAMING GEEKS:
- Use coding, AI, or gaming metaphors
- Reference famous tech quotes or Silicon Valley
- Gaming pickup lines (level up, power up, respawn, etc.)

🎵 FOR MUSIC LOVERS:
- Reference songs, artists, or concert moments
- Use song lyrics creatively
- Musical instrument metaphors

⚽ FOR SPORTS FANS:
- Use sports terminology
- Reference famous games/matches
- Team loyalty metaphors

🌍 FOR TRAVELERS:
- Dream destination references
- Adventure metaphors
- World wonders

🍜 FOR FOODIES:
- Delicious food comparisons
- Cooking/m cooking metaphors
- Restaurant/dining references

🌿 FOR NATURE LOVERS:
- Beautiful nature metaphors
- Animal comparisons
- Sunset/star references

For LGBTQ+: Be extra creative and inclusive! Reference Pride, rainbow, love is love concepts!

STYLE GUIDE:
- funny: Hilarious and unexpected
- romantic: Heart-melting sweet
- flirty: Playful teasing with a wink 😏
- cute: Adorable and endearing
- cheesy: Classic cheesy but clever
- poetic: Lyrically beautiful
- sarcastic: Witty with a twist
- sweet: Gentle and caring
- bold: Confident and direct

OUTPUT: Just the pickup line in Burmese with emoji. Make it SURPRISE and DELIGHT!`;

// Detailed interest context with creative prompts
const INTEREST_CONTEXT = {
  movies: {
    burmese: 'ရုပ်ရှင်',
    prompts: ['ရုပ်ရှင်ဇာတ်ကား', 'မင်းသားမင်းသမီး', 'ဟောလိဝုဒ်', 'မြန်မာရုပ်ရှင်', 'ဂျာနယ်မင်းသား', 'Marvel', 'Harry Potter', 'အော်စကာ']
  },
  music: {
    burmese: 'ဂီတ',
    prompts: ['သီချင်း', 'အဆိုတော်', 'ကွန်ဆာ့်', 'ပါးဝင်းဂီတ', 'ဂီတစင်းချင်း', 'ဘန်းစကား', 'Rock', 'Pop', 'R&B']
  },
  tech: {
    burmese: 'နည်းပညာ',
    prompts: ['ပရိုဂရမ်မင်းဂျ်', 'AI', 'စက်ချပ်စက်', 'အော်စကာ', 'မိုဘိုင်း', 'အပ်ပ်', 'Tesla', 'Startup']
  },
  gaming: {
    burmese: 'ဂိမ်း',
    prompts: ['ဂိမ်းကစားခြင်း', 'PC Game', 'Mobile Game', 'PS5', 'Xbox', 'Genshin Impact', 'League of Legends', 'Fortnite', 'Minecraft']
  },
  books: {
    burmese: 'စာပေ',
    prompts: ['စာအုပ်ဖတ်ခြင်း', 'စာနယ်ဇင်း', 'ဝတ္ထု', 'ကဗျာ', 'Harry Potter', 'စပါး', 'ဖီးနေးစ်']
  },
  football: {
    burmese: 'ဘောလုံး',
    prompts: ['ဘောလုံးကစားခြင်း', 'မြန်မာ့ဘောလုံး', 'အင်္ဂလန်ပရီမီယာ', 'Messi', 'Ronaldo', 'ယူၺ်းတီးခါး']
  },
  travel: {
    burmese: 'ခရီးသွား',
    prompts: ['ခရီးသွားခြင်း', 'အပန်းဖြေခြင်း', 'နိုင်ငံခရီး', 'ပါးရှန်း', 'ထိုင်း', 'မလေးရှား', 'ဂျပန်']
  },
  food: {
    burmese: 'အစားအစာ',
    prompts: ['အစားအစာ', '�ြန်မာအစာ', 'ထမင်းချက်ခြင်း', 'မုန့်ပြုတ်', 'မုန့်ဖုတ်', 'ပေါင်းအိုး', 'ပါးရှန်းအစာ']
  },
  sports: {
    burmese: 'အားကစား',
    prompts: ['အားကစား', 'မြင်းပြိုင်ပါး', 'ဗောက်စ်', 'တင်းနစ်', 'ပြင်သောင်းကျန်း', 'မာယာသောင်း']
  },
  art: {
    burmese: 'အနုပညာ',
    prompts: ['ပန်းချီဆွဲခြင်း', 'ပန်းပုဆိုး', 'ပါတ်ဝင်း', 'ပန်းပဲ့တင်း', 'အနုပညာရှင်', 'ပန်းချီပါး']
  },
  fitness: {
    burmese: 'ကာယကံခွန်အား',
    prompts: ['အားလုံးပါး', 'တရုတ်ဂျင်း', 'ယိုးဂါ', 'လှော်ဒင်း', 'ဖီးနက်စ်', 'ကိုယ်လက်အား']
  },
  photography: {
    burmese: 'ဓာတ်ပုံ',
    prompts: ['ဓာတ်ပုံရိုက်ခြင်း', 'ကင်မရာ', 'ပေါ်တရိုက်', 'ဆယ်လ်ဖီး', 'ဓာတ်ပုံပါး', 'အိမ်မက်']
  },
  nature: {
    burmese: 'သဘာဝ',
    prompts: ['သဘာဝ', '�ော်ဝင်ပန်း', 'နေဝင်း', 'လမင်း', 'ပင်လယ်', 'တောင်ကုန်း', 'ပန်းပါး']
  },
  cooking: {
    burmese: 'ချက်ပြုတ်',
    prompts: ['ချက်ပြုတ်ခြင်း', 'မွှေးရနံ့', 'ဟင်းချက်', 'မုန့်ဖုတ်', 'မြန်မာဟင်း', 'ထမင်းချက်']
  },
  dancing: {
    burmese: 'အက',
    prompts: ['အကလာပ်', 'အိမ်အက', 'ပါတ်ဝင်း', 'မြန်မာအက', 'K-Pop', 'ဂျပန်အက']
  },
  business: {
    burmese: 'စီးပွားရေး',
    prompts: ['စီးပွားရေး', 'စမတ်ဖုန်း', 'စတားအပ်', 'မားကတ်', 'ပါရီ', 'ရှယ်ယာဝင်း']
  },
  education: {
    burmese: 'ပညာရေး',
    prompts: ['ပညာရေး', 'ကောလိပ်', 'တက္ကသိုလ်', 'စာသင်ခန်း', 'ပါမောက်ပါ', 'ပါရဂူ']
  },
  health: {
    burmese: 'ကျန်းမာရေး',
    prompts: ['ကျန်းမာရေး', 'ဆေးပါး', 'ဗီတာမင်း', 'ကိုယ်ခံအား', 'အာဟာရ', 'စိတ်ကျန်းမာ']
  },
  beauty: {
    burmese: 'အလှအပ',
    prompts: ['အလှအပ', 'မိတ်ကပ်', 'ပါးရော်', 'ဆံပါး', 'အသားအရောင်', 'မာဆေးကား']
  },
  fashion: {
    burmese: 'ဖက်ရှင်',
    prompts: ['ဖက်ရှင်', 'အဝတ်အစား', 'ဖက်ရှင်ဒီဇိုင်း', 'ဗရင်းမား', 'Louis Vuitton', 'Gucci', 'K-Pop fashion']
  },
  pets: {
    burmese: 'အိမ်မွေး',
    prompts: ['ခွေး', 'ကြောင်', 'ငှက်', 'မြွေ', 'ပါးတိုက်', 'အိမ်မွေးများ', 'ပါးရှန်း']
  },
  science: {
    burmese: 'သိပ္ပံ',
    prompts: ['သိပ္ပံ', 'ရူပါပါး', 'ဓာတ်ပါး', 'အာကာသ', 'သက်မွှား', 'Quantum', 'NASA']
  },
  history: {
    burmese: 'သမိုင်း',
    prompts: ['သမိုင်း', 'မြန်မာ့သမိုင်း', 'ကမ္ဘာ့သမိုင်း', 'စစ်သမိုင်း', 'မင်းမှူးမင်းမွန်း']
  }
};

// Identity mapping with more options
const IDENTITY_CONTEXT = {
  girl: 'မိန်းမ',
  boy: 'ယောက်ျား',
  lgbtq: 'LGBTQ+ သူငယ်ချင်း',
  other: 'သူတစ်ဦးဦး'
};

// Style instructions in Burmese
const STYLE_INSTRUCTIONS = {
  funny: 'ဟာသဖန်တီးပါ။ ရယ်အောင်းသွားအောင်လုပ်ပါ။ 😂',
  romantic: 'ရိုမန်တစ်ဆန်းနူးညံ့ပါ။ နှလုံးပါးစပ်သွားအောင်လုပ်ပါ။ 💕',
  flirty: 'ပြုံးချိုဖွယ် ပါးစပ်ရယ်ပါးစပ်ဖန်တီးပါ။ မျက်လုံးပါးစပ်ပါ။ 😏',
  cute: 'ချစ်စရာကောင်းပါးစပ်ဖန်တီးပါ။ ပါးစပ်ချိုသွားအောင်လုပ်ပါ။ 🥰',
  cheesy: 'ထုံးစံနမူနာဖြစ်ပါးစပ် တော်တော်လေးဖန်တီးပါ။ 🧀',
  poetic: 'ကဗျာဆန်းလှပါးစပ်ဖန်တီးပါ။ ပါးစပ်နီသွားအောင်လုပ်ပါ။ 📝',
  sarcastic: 'အာဒိကတစ်ဆန်း ဝါကျဖန်တီးပါ။ ချွန်းချိုပါ။ 😎',
  sweet: 'သပ်ရပ်စွက်ဖြစ်ပါးစပ်ဖန်တီးပါ။ နူးညံ့ပါ။ 🍯',
  bold: 'ရဲရင့်စွက်ဖြစ်ပါးစပ်ဖန်တီးပါ။ ယုံကြည်စွက်ပါ။ 🔥',
  other: 'ထူးခြားပါးစပ်ဖန်တီးပါ။ ✨'
};

export const generateWithAI = async ({ identity, interest, style, language = 'myanmar' }) => {
  const useMiniMax = !!MINIMAX_API_KEY;
  const prompt = createPrompt({ identity, interest, style, language });

  if (useMiniMax) {
    return generateWithMiniMax(prompt, language);
  } else {
    return generateWithOllama(prompt);
  }
};

const createPrompt = ({ identity, interest, style }) => {
  const identityText = IDENTITY_CONTEXT[identity] || 'သူ';
  const interestData = INTEREST_CONTEXT[interest] || { burmese: interest, prompts: [interest] };
  const interestBurmese = interestData.burmese;
  const interestPrompts = interestData.prompts.join(', ');
  const styleInstruction = STYLE_INSTRUCTIONS[style] || STYLE_INSTRUCTIONS.funny;

  return `မြန်မာစာဖြင့် ပါးစပ်တစ်ခုဖန်တီးပါ။

${styleInstruction}

📌 သတင်းအရင်းအမြစ်: ${interestBurmese} စိတ်ဝင်စားသူ (${interestPrompts})
📌 ပါးစပ်ရည်ညွှန်းသူ: ${identityText}

အရေးကြီးပါ။
✅ မြန်မာစာဖြင့်ရေးပါ။
✅ တိုတောင်းပါးစပ်တစ်ခုဖြစ်ပါ။
✅ ${interestBurmese} နဲ့သက်ဆိုင်ပါ။
✅ ထူးခြားပါးစပ်တစ်ခုဖြစ်ပါ။
✅ စိတ်ဝင်စားစရာကောင်းပါ။

ပါးစပ်သားကိုသာ ရေးပါ။ သီချင်းသား၊ ရုပ်ရှင်သား၊ ဂိမ်းသား၊ သိပ္ပံသား၊ အစားအစာသား စတဲ့ အရင်းအမြစ်များနဲ့ နှိုင်းယှဉ်ပါ။`;
};

const generateWithOllama = async (prompt) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `${SYSTEM_PROMPT}\n\n${prompt}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return { text: data.response.trim(), source: 'ollama', model: OLLAMA_MODEL };
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

const generateWithMiniMax = async (prompt) => {
  try {
    const response = await fetch(`${MINIMAX_BASE_URL}/v1/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'MiniMax-Text-01',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      throw new Error(`MiniMax error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';

    return { text: text.trim(), source: 'minimax', model: 'MiniMax-Text-01' };
  } catch (error) {
    console.error('MiniMax generation error:', error);
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

export const isAIConfigured = () => {
  return !!MINIMAX_API_KEY || isOllamaRunning();
};

export const isOllamaRunning = async () => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
};
