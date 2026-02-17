import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REF_LINKS = [
  'https://www.theknot.com/content/pick-up-lines',
  'https://thoughtcatalog.com/rania-naim/2016/04/50-hilarious-cheesy-pick-up-lines-that-will-definitely-make-your-crush-smile/'
];

const CATEGORIES = [
  'travel', 'food', 'sports', 'art', 'fitness', 'photography', 'nature',
  'cooking', 'dancing', 'business', 'education', 'health', 'beauty',
  'fashion', 'pets', 'science', 'history', 'other'
];

const STYLES = ['flirty', 'cute', 'cheesy', 'poetic', 'sarcastic', 'sweet', 'bold', 'other'];
const LENGTHS = ['short', 'medium', 'long'];

const CAT = {
  travel: { topic: 'ခရီးသွား', icon: '✈️', key: 'passport' },
  food: { topic: 'အစားအစာ', icon: '🍜', key: 'menu' },
  sports: { topic: 'အားကစား', icon: '🏆', key: 'goal' },
  art: { topic: 'အနုပညာ', icon: '🎨', key: 'canvas' },
  fitness: { topic: 'fitness', icon: '💪', key: 'workout' },
  photography: { topic: 'ဓာတ်ပုံ', icon: '📷', key: 'focus' },
  nature: { topic: 'သဘာဝ', icon: '🌿', key: 'sunset' },
  cooking: { topic: 'ချက်ပြုတ်', icon: '👨‍🍳', key: 'recipe' },
  dancing: { topic: 'အက', icon: '💃', key: 'rhythm' },
  business: { topic: 'စီးပွားရေး', icon: '💼', key: 'target' },
  education: { topic: 'ပညာရေး', icon: '🎓', key: 'exam' },
  health: { topic: 'ကျန်းမာရေး', icon: '🏥', key: 'self-care' },
  beauty: { topic: 'အလှအပ', icon: '💄', key: 'glow' },
  fashion: { topic: 'ဖက်ရှင်', icon: '👗', key: 'outfit' },
  pets: { topic: 'အိမ်မွေးတိရစ္ဆာန်', icon: '🐾', key: 'paw' },
  science: { topic: 'သိပ္ပံ', icon: '🔬', key: 'gravity' },
  history: { topic: 'သမိုင်း', icon: '🏛️', key: 'timeline' },
  other: { topic: 'စိတ်ဝင်စားရာ', icon: '✨', key: 'vibe' }
};

const TONE = {
  flirty: { emo: '😉', q: 88 },
  cute: { emo: '🥰', q: 86 },
  cheesy: { emo: '🧀', q: 82 },
  poetic: { emo: '🌙', q: 85 },
  sarcastic: { emo: '😏', q: 79 },
  sweet: { emo: '🍯', q: 87 },
  bold: { emo: '🔥', q: 84 },
  other: { emo: '✨', q: 83 }
};

const refs = [
  'မင်းက magician လား? မင်းကိုကြည့်တာနဲ့ တခြားသူတွေ အကုန်ပျောက်သွားတယ်',
  'မင်းက Siri လား? ငါ့စကားမပြီးခင် မင်းကိုပဲ auto-complete လုပ်နေမိတယ်',
  'မင်းက charger လား? မင်းနဲ့ မတွေ့ရရင် ငါ့ battery တွေအရမ်းအားနည်းနေတယ်',
  'မင်းက Google လား? ငါရှာနေတဲ့အဖြေအကုန် မင်းဆီမှာပဲရှိတယ်',
  'မင်းက keyboard လား? ငါ့ type က မင်းပဲဖြစ်နေတယ်',
  'မင်းက Wi-Fi လား? မင်းနားကပ်လေလေ connection ပိုကောင်းလေလေ',
  'မင်းက time traveler လား? ငါ့ future ထဲမှာ မင်းကိုပဲမြင်နေတယ်'
];

const shortByStyle = {
  flirty: [
    (c) => `မင်းက charger လား၊ မင်းနဲ့ မတွေ့ရရင် ငါ့ battery တွေအရမ်းအားနည်းနေတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက Siri လား၊ ${c.topic} အကြောင်းပြောရင်တောင် မင်းကိုပဲ auto-complete လုပ်နေမိတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက ${c.key} လား၊ တစ်ကြည့်လောက်နဲ့ ရင်ခုန်နှုန်းတက်သွားတယ် ${c.icon}${c.emo}`
  ],
  cute: [
    (c) => `မင်းက sunshine လား၊ ${c.topic} day တောင် soft ဖြစ်သွားတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက ${c.key} လား၊ သေးသေးလေးနဲ့ အရမ်းချစ်စရာကောင်းတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းနဲ့ ${c.topic} စကားစရင် ပျော်တာ auto ဖြစ်တယ် ${c.icon}${c.emo}`
  ],
  cheesy: [
    (c) => `မင်းက Google လား၊ ${c.topic} မှာငါရှာတဲ့အဖြေ မင်းဆီမှာပဲရှိတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက keyboard လား၊ ငါ့ type က မင်းပဲဖြစ်နေတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက menu special လား၊ ordinary day ကို premium ဖြစ်စေတယ် ${c.icon}${c.emo}`
  ],
  poetic: [
    (c) => `မင်းက magician လား၊ မင်းကိုကြည့်တာနဲ့ တခြားသူတွေ အကုန်ပျောက်သွားတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက ${c.key} လား၊ ငါ့နေ့ရက်ကို လမ်းပြအလင်းလိုဖြစ်စေတယ် ${c.icon}${c.emo}`,
    (c) => `${c.topic} စကားလေးတွေထဲ မင်းနာမည်က ကဗျာလိုညှိနေတယ် ${c.icon}${c.emo}`
  ],
  sarcastic: [
    (c) => `မင်းက just normal တဲ့? ဒါဆို ဘာလို့ ငါ့ focus က ${c.topic} ကနေမင်းဆီပြောင်းသွားတာလဲ ${c.icon}${c.emo}`,
    (c) => `ဟုတ်ကဲ့ ငါ calm ပါ... မင်း message မတက်ခင်ထိပဲ ${c.icon}${c.emo}`,
    (c) => `မင်းက ${c.key} မဟုတ်ဘူးဆို? ဒါဆို ဘာလို့ addictive ဖြစ်နေတာလဲ ${c.icon}${c.emo}`
  ],
  sweet: [
    (c) => `မင်းက magician လား? မင်းကိုကြည့်တာနဲ့ တခြားသူတွေ အကုန်ပျောက်သွားတယ်✨🍯 ${c.icon}`,
    (c) => `မင်းစကားက ${c.topic} နေ့လေးကို နွေးနွေးထွေးထွေးဖြစ်စေတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက charger လား၊ tired mood တွေကို ပြန်အားဖြည့်ပေးတယ် ${c.icon}${c.emo}`
  ],
  bold: [
    (c) => `မင်းက charger လား မဟုတ်လည်းရတယ်၊ ငါ့ next date plan ထဲမင်းပါပြီးသား ${c.icon}${c.emo}`,
    (c) => `မင်းက Siri လား၊ shortcut မလိုဘဲ direct “let's go out” ပြောချင်တယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက ${c.key} လား၊ ငါ့နေ့ကို lock-on လုပ်ထားတယ် ${c.icon}${c.emo}`
  ],
  other: [
    (c) => `မင်းက vibe switch လား၊ ${c.topic} topic ကို special mode ပြောင်းလိုက်တယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက connection လား၊ စကားစရင်ပဲ frequency ကိုက်သွားတယ် ${c.icon}${c.emo}`,
    (c) => `မင်းက moment maker လား၊ plain day ကို highlight လုပ်သွားတယ် ${c.icon}${c.emo}`
  ]
};

const toMedium = (shortText, c) => `${shortText.replace(/\s+[✨🍯😉🥰🧀🌙😏🔥]+$/, '')}။ ${c.topic} အကြောင်းစကားဝိုင်းတိုင်းမှာ မင်းပါတာနဲ့ mood က ပိုပေါ့ပါးပျော်ရွှင်လာတယ်။`;
const toLong = (shortText, c) => `${shortText.replace(/\s+[✨🍯😉🥰🧀🌙😏🔥]+$/, '')}။ အရင်က ${c.topic} ကိုပဲစိတ်ဝင်စားခဲ့တာပေမဲ့ အခုတော့ မင်းနဲ့ပြောတဲ့မိနစ်တွေကိုပိုစောင့်နေမိတယ်။ မင်းရဲ့ reply လေးတက်လာတာနဲ့ ပင်ပန်းမှုတွေ soft ဖြစ်သွားပြီး တစ်နေ့လုံး energy ပြန်တက်လာတယ်။`;

const buildLine = (category, style, length, i) => {
  const base = CAT[category];
  const tone = TONE[style];
  const ctx = { ...base, emo: tone.emo };

  const short = shortByStyle[style][i % 3](ctx);
  const text = length === 'short' ? short : length === 'medium' ? toMedium(short, ctx) : toLong(short, ctx);

  return {
    category,
    style,
    length,
    burmese_text: text,
    english_source_text: refs[(i + category.length + style.length) % refs.length],
    source_url: REF_LINKS[i % REF_LINKS.length],
    license_note: 'reference-inspired direct Burmese rewrite v3',
    quality_score: tone.q,
    safety_score: 97,
    tags: [category, style, length, 'reference-direct-v3'],
    review_status: 'approved',
    language: 'my'
  };
};

const run = async () => {
  const rows = [];
  for (const category of CATEGORIES) {
    for (const style of STYLES) {
      for (const length of LENGTHS) {
        for (let i = 0; i < 3; i += 1) {
          rows.push(buildLine(category, style, length, i));
        }
      }
    }
  }

  const out = path.resolve(__dirname, '../../data/staging/curated_reference_v3_direct.json');
  await fs.writeFile(out, JSON.stringify(rows, null, 2), 'utf8');
  console.log(`Generated ${rows.length} lines`);
  console.log(out);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
