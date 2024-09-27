///
///
///
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS } from "../models";
interface PublicVocabCreation_MODEL {
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
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
      difficulty?: number;
      description?: string;
      image?: string;
    } = {};

    if (description) vocab_DATA.description = description;
    if (image) vocab_DATA.image = image;

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

      // Create translations
      const translationPromises = translations.map((translation) => {
        const translation_DATA = {
          public_vocab_id: vocabData.id, // Link translation to the created vocab
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
          "🔴 Error creating some public translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error creating some public translations 🔴",
        };
      }

      return {
        success: true,
        data: { vocabData, translations: translationResults },
      };
    } catch (error) {
      console.log(
        "🔴 Error creating public vocab or public translations 🔴 : ",
        error
      );
      return {
        success: false,
        msg: "🔴 Error creating public vocab or public translations 🔴",
      };
    } finally {
      SET_isCreatingPublicVocab(false);
    }
  };

  return { CREATE_publicVocab, IS_creatingPublicVocab };
}
