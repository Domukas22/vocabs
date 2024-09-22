import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS } from "../models";

interface VocabCreation_MODEL {
  user_id: string;
  list_id: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
  toggleFn: () => void;
}

export default function USE_upsertVocab() {
  const [IS_upsertingVocab, SET_isCreatingVocab] = useState(false);

  const UPSERT_vocabAndTranslations = async (
    props: VocabCreation_MODEL
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const {
      user_id,
      list_id,
      difficulty,
      description,
      image,
      translations,
      toggleFn = () => {},
    } = props;

    if (!user_id) {
      console.log("🔴 User not defined when upserting vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when upserting vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when upserting vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when upserting vocab 🔴",
      };
    }

    const vocab_DATA: {
      list_id: string;
      user_id: string;
      difficulty?: number;
      description?: string;
      image?: string;
    } = {
      list_id,
      user_id,
      difficulty,
      description,
      image,
    };

    try {
      SET_isCreatingVocab(true);

      // Upsert vocab (either insert new or update existing based on unique constraints)
      const { data: vocabData, error: vocabError } = await supabase
        .from("vocabs")
        .upsert(vocab_DATA, { onConflict: ["list_id", "user_id"] }) // Adjust conflict keys based on your table
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error upserting vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error upserting vocab 🔴",
        };
      }

      // For each translation, either insert new or update existing ones
      const translationPromises = translations.map(async (translation) => {
        const translation_DATA = {
          vocab_id: vocabData.id, // Link translation to the created or updated vocab
          user_id: user_id,
          lang_id: translation.lang_id,
          text: translation.text,
          highlights: translation.highlights,
        };

        // Upsert translation (either insert new or update based on vocab_id and lang_id)
        const { data: translationResult, error: translationError } =
          await supabase
            .from("translations")
            .upsert(translation_DATA, {
              onConflict: ["vocab_id", "lang_id"], // Check if vocab_id and lang_id already exist
            })
            .select();

        if (translationError) {
          console.log(
            `🔴 Error upserting translation for lang_id ${translation.lang_id} 🔴 : `,
            translationError
          );
          return {
            success: false,
            msg: `🔴 Error upserting translation for lang_id ${translation.lang_id} 🔴`,
          };
        }

        return translationResult;
      });

      const translationResults = await Promise.all(translationPromises);

      // Check if any translation upserts failed
      const failedTranslations = translationResults.filter(
        (result) => result.success === false
      );

      if (failedTranslations.length > 0) {
        console.log(
          "🔴 Error upserting some translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error upserting some translations 🔴",
        };
      }

      toggleFn();
      return {
        success: true,
        data: { vocabData, translations: translationResults },
      };
    } catch (error) {
      console.log("🔴 Error upserting vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error upserting vocab or translations 🔴",
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { UPSERT_vocabAndTranslations, IS_upsertingVocab };
}
