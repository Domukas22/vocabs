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

const pricing = {
  offer1: {
    amount: 500,
    price: 4.99,
    discount: "0%",
    priceProVocab: "1 cent pro vocab",
  },
  offer2: {
    amount: 1000,
    price: 7.99,
    discount: "15%",
    priceProVocab: "0.7 cents pro vocab",
  },
  offer3: {
    amount: 2000,
    price: 9.99,
    discount: "30%",
    priceProVocab: "0.35 cents pro vocab",
  },
};
