//
//
//
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS, Vocab_MODEL } from "../../../../db/models";

interface PublicVocabUpdate_MODEL {
  vocab_id: string;
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
}

export default function USE_updateMyVocab() {
  const [IS_updatingPublicVocab, SET_isUpdatingPublicVocab] = useState(false);

  const UPDATE_publicVocab = async (
    props: PublicVocabUpdate_MODEL
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const {
      vocab_id, // Used to identify the vocab to update
      description,
      image,
      translations,
    } = props;

    if (!vocab_id) {
      console.log("🔴 Vocab ID not defined when updating public vocab 🔴");
      return {
        success: false,
        msg: "🔴 Vocab ID not defined when updating public vocab 🔴",
      };
    }

    const vocab_DATA: {
      description?: string;
      image?: string;
    } = {};

    if (description) vocab_DATA.description = description;
    if (image) vocab_DATA.image = image;

    try {
      SET_isUpdatingPublicVocab(true);

      // Update the vocab
      const { data: updatedVocabData, error: vocabError } = await supabase
        .from("public_vocabs")
        .update(vocab_DATA)
        .eq("id", vocab_id)
        .select()
        .single();

      if (vocabError) {
        console.log("🔴 Error updating public vocab 🔴 : ", vocabError);
        return {
          success: false,
          msg: "🔴 Error updating public vocab 🔴",
        };
      }

      // Upsert (insert or update) translations
      const translationPromises = translations.map(async (translation) => {
        const existingTranslation = await supabase
          .from("public_translations")
          .select("id")
          .eq("public_vocab_id", vocab_id)
          .eq("lang_id", translation.lang_id)
          .single();

        if (existingTranslation.data) {
          // Update the existing translation
          return supabase
            .from("public_translations")
            .update({
              text: translation.text,
              highlights: translation.highlights,
            })
            .eq("id", existingTranslation.data.id)
            .select();
        } else {
          // Insert a new translation if it doesn't exist
          return supabase
            .from("public_translations")
            .insert([
              {
                public_vocab_id: vocab_id,
                lang_id: translation.lang_id,
                text: translation.text,
                highlights: translation.highlights,
              },
            ])
            .select();
        }
      });

      const translationResults = await Promise.all(translationPromises);

      // Check for any translation errors
      const failedTranslations = translationResults.filter(
        ({ error }) => error
      );

      if (failedTranslations.length > 0) {
        console.log(
          "🔴 Error updating some translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error updating some translations 🔴",
        };
      }

      const updatedVocab: Vocab_MODEL = {
        ...updatedVocabData,
        translations: translationResults.flatMap((x) => x.data),
      };

      return {
        success: true,
        data: updatedVocab,
      };
    } catch (error) {
      console.log(
        "🔴 Error updating public vocab or translations 🔴 : ",
        error
      );
      return {
        success: false,
        msg: "🔴 Error updating public vocab or translations 🔴",
      };
    } finally {
      SET_isUpdatingPublicVocab(false);
    }
  };

  return { UPDATE_publicVocab, IS_updatingPublicVocab };
}
