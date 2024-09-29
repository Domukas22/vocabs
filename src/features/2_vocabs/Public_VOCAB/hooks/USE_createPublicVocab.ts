import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import {
  PublicVocab_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";

interface PublicVocabCreation_MODEL {
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[] | undefined | [];
}

export default function USE_createPublicVocab() {
  const [IS_creatingPublicVocab, SET_isCreatingPublicVocab] = useState(false);

  const CREATE_publicVocab = async (
    props: PublicVocabCreation_MODEL
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const { description, image, translations } = props;

    const vocab_DATA: {
      description?: string;
      image?: string;
    } = {};

    if (description) vocab_DATA.description = description;
    if (image) vocab_DATA.image = image;

    console.log("🔴🔴🔴", vocab_DATA);

    try {
      SET_isCreatingPublicVocab(true);

      // Insert new vocab
      const { data: vocabData, error: vocabError } = await supabase
        .from("public_vocabs")
        .insert([vocab_DATA])
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error creating public vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error creating public vocab 🔴",
        };
      }

      // Check if translations exist before processing them
      if (translations && translations.length > 0) {
        // Create translations
        const translationPromises = translations.map((translation) => {
          const translation_DATA = {
            public_vocab_id: vocabData.id,
            lang_id: translation.lang_id,
            text: translation.text,
            highlights: translation.highlights,
          };

          return supabase
            .from("public_translations")
            .insert([translation_DATA])
            .select();
        });

        const translationResults = await Promise.all(translationPromises);

        // Check if any translation insertions failed
        const failedTranslations = translationResults.filter(
          ({ error }) => error
        );

        if (failedTranslations.length > 0) {
          console.log(
            "🔴 Error creating some translations 🔴",
            failedTranslations
          );
          return {
            success: false,
            msg: "🔴 Error creating some translations 🔴",
          };
        }

        const newVocab: PublicVocab_MODEL = {
          ...vocabData,
          translations: translationResults.flatMap((x) => x.data),
        };

        return {
          success: true,
          data: newVocab,
        };
      } else {
        // No translations provided, return vocab data without translations
        const newVocab: PublicVocab_MODEL = {
          ...vocabData,
          translations: [],
        };

        return {
          success: true,
          data: newVocab,
        };
      }
    } catch (error) {
      console.log(
        "🔴 Error creating public vocab or translations 🔴 : ",
        error
      );
      return {
        success: false,
        msg: "🔴 Error creating public vocab or translations 🔴",
      };
    } finally {
      SET_isCreatingPublicVocab(false);
    }
  };

  return { CREATE_publicVocab, IS_creatingPublicVocab };
}
