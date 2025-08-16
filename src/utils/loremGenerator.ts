// Lorem Ipsum генератор
const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const RUSSIAN_WORDS = [
  'съешь', 'же', 'ещё', 'этих', 'мягких', 'французских', 'булок', 'да', 'выпей',
  'чаю', 'широкая', 'электрификация', 'южных', 'губерний', 'даст', 'мощный',
  'толчок', 'подъёму', 'сельского', 'хозяйства', 'в', 'фильме', 'показан',
  'быт', 'колхозников', 'эпоха', 'застоя', 'завершилась', 'перестройкой',
  'объект', 'исследования', 'включает', 'анализ', 'данных', 'методология',
  'основана', 'на', 'принципах', 'системного', 'подхода', 'результаты',
  'показывают', 'значительное', 'улучшение', 'показателей'
];

const PANGRAMS = {
  english: [
    'The quick brown fox jumps over the lazy dog',
    'Pack my box with five dozen liquor jugs',
    'How vexingly quick daft zebras jump!',
    'Waltz, bad nymph, for quick jigs vex',
    'Sphinx of black quartz, judge my vow'
  ],
  russian: [
    'Съешь же ещё этих мягких французских булок да выпей чаю',
    'В чащах юга жил бы цитрус? Да, но фальшивый экземпляр!',
    'Щётка, лёд, юмор – всё это яд в ночи',
    'Эх, чужак! Общий съём цен шляп (юфть) – вдрызг!',
    'Шифровальщица попросту забыла ключ от сейфа'
  ]
};

export interface LoremOptions {
  type: 'words' | 'sentences' | 'paragraphs' | 'pangram';
  count: number;
  language: 'latin' | 'russian' | 'mixed';
  startWithLorem?: boolean;
}

export const generateLorem = (options: LoremOptions): string => {
  const { type, count, language, startWithLorem = true } = options;

  if (type === 'pangram') {
    const pangrams = language === 'russian' ? PANGRAMS.russian : PANGRAMS.english;
    if (language === 'mixed') {
      const allPangrams = [...PANGRAMS.english, ...PANGRAMS.russian];
      return allPangrams[Math.floor(Math.random() * allPangrams.length)];
    }
    return pangrams[Math.floor(Math.random() * pangrams.length)];
  }

  let words: string[];
  
  if (language === 'russian') {
    words = RUSSIAN_WORDS;
  } else if (language === 'mixed') {
    words = [...LOREM_WORDS, ...RUSSIAN_WORDS];
  } else {
    words = LOREM_WORDS;
  }

  const generateWords = (wordCount: number, shouldStartWithLorem: boolean = false): string[] => {
    const result: string[] = [];
    
    if (shouldStartWithLorem && language !== 'russian') {
      result.push('Lorem', 'ipsum');
      wordCount -= 2;
    }
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      result.push(randomWord);
    }
    
    return result;
  };

  const generateSentence = (): string => {
    const sentenceLength = Math.floor(Math.random() * 10) + 8; // 8-17 слов
    const words = generateWords(sentenceLength);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-6 предложений
    const sentences: string[] = [];
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    
    return sentences.join(' ');
  };

  switch (type) {
    case 'words':
      return generateWords(count, startWithLorem).join(' ');
      
    case 'sentences':
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      return sentences.join(' ');
      
    case 'paragraphs':
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      return paragraphs.join('\n\n');
      
    default:
      return generateWords(count, startWithLorem).join(' ');
  }
};

export const getPresetTexts = () => ({
  typography: {
    en: 'The quick brown fox jumps over the lazy dog\nPack my box with five dozen liquor jugs\n1234567890 !@#$%^&*()',
    ru: 'Съешь же ещё этих мягких французских булок да выпей чаю\nВ чащах юга жил бы цитрус? Да, но фальшивый экземпляр!\n1234567890 !@#$%^&*()',
    mixed: 'The quick brown fox jumps over the lazy dog\nСъешь же ещё этих мягких французских булок да выпей чаю\n1234567890 !@#$%^&*()'
  },
  sample: {
    en: 'Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.',
    ru: 'Типографика — искусство и техника расположения шрифтов для создания читаемого, понятного и привлекательного текста.',
    mixed: 'Typography — искусство оформления текста. The art of making text beautiful and readable for everyone.'
  }
});