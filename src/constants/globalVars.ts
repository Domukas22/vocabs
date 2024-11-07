//
//
//

export const GET_langFlagUrl = (lang: string) =>
  `https://nmqzljcpoczrlruijbbk.supabase.co/storage/v1/object/public/lang_images/${lang}.png`;

export const USER_ID = "ui0ZA9iKNBO3nupc";

export const vocabLimit = 100;
export const minVocabTranslations = 1;
export const maxVocabTranslations = 5;

export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_TRANSLATION_LENGTH = 200;

export const HEADER_MARGIN = 80;

export const VOCAB_PAGINATION = 20;
export const LIST_PAGINATION = 20;

export const VOCAB_PRICING = {
  1: {
    amount: 500,
    descritpion: "5 words daily for 100 days",
    price: 4.99,
    discount: 0,
    priceProVocab: 0.01,
  },
  2: {
    amount: 1000,
    descritpion: "10 words daily for 100 days",
    price: 7.99,
    discount: 15,
    priceProVocab: 0.007,
  },
  3: {
    amount: 2000,
    descritpion: "20 words daily for 100 days",
    price: 9.99,
    discount: 30,
    priceProVocab: 0.0035,
  },
};
