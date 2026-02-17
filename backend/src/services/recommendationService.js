const STYLE_INSIGHTS = {
  funny: {
    whyItWorks: 'ဟာသနဲ့စတင်ရင် တင်းမာမှုလျော့ပြီး စကားဆက်လွယ်ပါတယ်။',
    followUp: 'ဒီထဲကတစ်ခုနဲ့ စပြီး ရယ်သံပြန်လာရင် casual မေးခွန်းလေး ဆက်မေးပါ။'
  },
  romantic: {
    whyItWorks: 'ပျော့ပျောင်းတဲ့ အချစ်အသံပေးစာတွေက အာရုံစိုက်မှုရစေပါတယ်။',
    followUp: 'မိမိစိတ်ရင်းကို တိုတိုချုံးချုံး ပြန်ဖြည့်ပြီး စကားဆက်ပါ။'
  },
  flirty: {
    whyItWorks: 'ဖလတ်တီးလေသံက စိတ်ဝင်စားမှုရှိတယ်ဆိုတာကို ပျော်ပျော်ပါးပါး ပြသနိုင်ပါတယ်။',
    followUp: 'တစ်ဖက်လူ react ကောင်းရင် ပေါ့ပေါ့ပါးပါး compliment လေး ထပ်ပေးပါ။'
  },
  cute: {
    whyItWorks: 'နူးညံ့တဲ့ tone က friendly နဲ့ safe feeling ပေးနိုင်ပါတယ်။',
    followUp: 'Sticker/emoji လေးနဲ့ soft follow-up မေးခွန်းတစ်ခု ဆက်ပေးပါ။'
  },
  cheesy: {
    whyItWorks: 'Cheesy line တွေက intentionally funny ဖြစ်လို့ ice-breaker ကောင်းပါတယ်။',
    followUp: '“cheesy ပဲနော် 😄” လို့ self-aware ပြန်ပြောပြီး လှည့်ကွက်ပေးပါ။'
  },
  poetic: {
    whyItWorks: 'ကဗျာဆန်တဲ့စာပုံစံက မှတ်မိလွယ်ပြီး personal touch ပိုပေးနိုင်ပါတယ်။',
    followUp: 'အသံပေါင်းမကောင်းလွန်းပဲ သဘာဝကျကျ စကားခွင့်တိုးပေးပါ။'
  },
  sarcastic: {
    whyItWorks: 'အပြုံးဖျော် sarcasm က chemistry ရှိတဲ့ conversation မှာ အရမ်းကောင်းပါတယ်။',
    followUp: 'တစ်ဖက်လူ humour ကိုသေချာဖတ်ပြီး tone soft လုပ်ကာ ဆက်ပါ။'
  },
  sweet: {
    whyItWorks: 'ချိုသာတဲ့အသံ tone က trust နဲ့ comfort ကိုမြန်မြန်တည်ဆောက်ပေးပါတယ်။',
    followUp: 'မိမိပုံမှန်စကားလုံးနဲ့ ပိုတိကျတဲ့ compliment တစ်ခု ထပ်ပြောပါ။'
  },
  bold: {
    whyItWorks: 'ယုံကြည်မှုပြည့်တဲ့ ပြောစကားက တိုက်ရိုက်ပြီး စိတ်ဝင်စားမှုကို ဖော်ပြပေးပါတယ်။',
    followUp: 'Bold ဖြစ်ပေမယ့် respectful ဖြစ်အောင် tone ကိုထိန်းပါ။'
  },
  other: {
    whyItWorks: 'လိုချင်တဲ့ vibe ကို ပြောင်းလဲရွေးလို့ conversation ထဲ flexibility ရပါတယ်။',
    followUp: 'တစ်ဖက်လူအကြိုက်အတိုင်း style ပြောင်းပြီး တစ်ကြောင်းထပ်ပို့ပါ။'
  }
};

const CATEGORY_BEST_USE = {
  movies: 'ရုပ်ရှင်အကြောင်းပြောနေတဲ့ချိန်',
  music: 'သီချင်း/playlist share လုပ်နေတဲ့ချိန်',
  books: 'စာအုပ်/ဝတ္ထုအကြောင်းစကားဝိုင်း',
  tech: 'tech joke သို့ gadget chat လုပ်နေတဲ့ချိန်',
  football: 'ပွဲကြည့်ပြီးချက်ချင်း',
  gaming: 'game session ပြီးပြီးချိန်',
  travel: 'trip plan ပြောနေတဲ့အချိန်',
  food: 'စားသောက်ဆိုင်/မီနူးပြောနေတဲ့ချိန်',
  sports: 'အားကစားအကြောင်းယုံကြည်ချက်ဝေမျှချိန်',
  art: 'အနုပညာ post/comment အောက်မှာ',
  fitness: 'workout ပြီး encourage လုပ်တဲ့အချိန်',
  photography: 'ဓာတ်ပုံတင်ပြီး reaction ပြန်ပေးချိန်',
  nature: 'sunset/အပြင်လေထဲ content share ချိန်',
  cooking: 'ဟင်းချက်ထားတာပြထားတဲ့အချိန်',
  dancing: 'dance reel/story တင်ပြီးနောက်',
  business: 'အလုပ်အောင်မြင်မှု share လုပ်ချိန်',
  education: 'စာမေးပွဲ/class stress ချိန် ice-breaker',
  health: 'self-care chat မှာ soft support ပေးချိန်',
  beauty: 'look compliment ပြောတဲ့ timing',
  fashion: 'outfit post အပေါ် playful comment',
  pets: 'pet pic တင်တဲ့မိနစ်',
  science: 'science fact share လုပ်ပြီးနောက်',
  history: 'history fun fact discussion အတွင်း',
  other: 'ပေါ့ပေါ့ပါးပါး small talk အစ'
};

const shuffle = (items) => {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const weightedScore = (line, requestedStyle) => {
  const quality = Number(line.quality_score ?? 70) * 0.6;
  const safety = Number(line.safety_score ?? 95) * 0.3;
  const styleBoost = line.style === requestedStyle ? 8 : 0;
  const randomness = Math.random() * 5;
  return quality + safety + styleBoost + randomness;
};

const approvedOrLegacyFilter = {
  $or: [
    { review_status: 'approved' },
    { review_status: { $exists: false } }
  ]
};

const findCandidates = async (PickupLine, { interest, style, language }) => {
  const baseQuery = {
    ...approvedOrLegacyFilter,
    category: interest
  };

  if (language) {
    baseQuery.language = language;
  }

  const levels = [
    { ...baseQuery, style, length: 'short' },
    { ...baseQuery, style },
    { ...baseQuery, length: 'short' },
    { ...baseQuery },
    { ...approvedOrLegacyFilter, style, length: 'short' },
    { ...approvedOrLegacyFilter, style },
    { ...approvedOrLegacyFilter, length: 'short' },
    { ...approvedOrLegacyFilter }
  ];

  for (const query of levels) {
    const rows = await PickupLine.find(query).limit(150);
    if (rows.length) return rows;
  }

  return [];
};

export const recommendPickupLine = async (PickupLine, params) => {
  const {
    interest,
    style,
    language = 'my'
  } = params;

  const candidates = await findCandidates(PickupLine, { interest, style, language });
  if (!candidates.length) return null;

  const ranked = candidates
    .map((line) => ({ line, score: weightedScore(line, style) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ line }) => line);

  const selected = shuffle(ranked)[0];
  const insightBase = STYLE_INSIGHTS[selected.style] || STYLE_INSIGHTS.other;

  return {
    text: selected.burmese_text || selected.text,
    source: 'database_curated',
    isAI: false,
    category: selected.category,
    style: selected.style,
    length: 'short',
    insight: {
      whyItWorks: insightBase.whyItWorks,
      bestUsedWhen: CATEGORY_BEST_USE[selected.category] || CATEGORY_BEST_USE.other,
      followUp: insightBase.followUp
    }
  };
};
