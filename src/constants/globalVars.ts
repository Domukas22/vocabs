//
//
//

export const GET_langFlagUrl = (lang: string) =>
  `https://nmqzljcpoczrlruijbbk.supabase.co/storage/v1/object/public/lang_images/${lang}.png`;

export const vocabLimit = 100;
export const minVocabTranslations = 1;
export const maxVocabTranslations = 5;

export const level_0_limits = { lists: 15, vocabs: 100 };
export const level_1_limits = { lists: 50, vocabs: 1000 };
export const level_2_limits = { lists: 100, vocabs: 5000 };
export const level_3_limits = { lists: 150, vocabs: 3000 };
export const level_4_limits = { lists: 200, vocabs: 4000 };
export const level_5_limits = { lists: 250, vocabs: 5000 };
export const level_6_limits = { lists: 300, vocabs: 6000 };
export const level_7_limits = { lists: 350, vocabs: 7000 };
export const level_8_limits = { lists: 400, vocabs: 8000 };
export const level_9_limits = { lists: 450, vocabs: 9000 };
export const level_10_limits = { lists: 500, vocabs: 10000 };
