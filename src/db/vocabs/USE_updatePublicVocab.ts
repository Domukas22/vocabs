//
//
//
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import { TranslationCreation_PROPS } from "../models";

interface UpdatePublicVocab_PROPS {
  public_vocab_id: string; // Added vocab_id for identifying the vocab to update
  description?: string | "";
  image?: string | "";
  translations: TranslationCreation_PROPS[];
}

export default function USE_updatePublicVocab() {
  const [IS_updatingPublicVocab, SET_isUpdatingPublicVocab] = useState(false);

  const UPDATE_publicVocab = async (
    props: UpdatePublicVocab_PROPS
  ): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    const { public_vocab_id, description, image, translations } = props;

    if (!public_vocab_id) {
      console.log("🔴 Vocab ID not defined when updating public vocab 🔴");
      return {
        success: false,
        msg: "🔴 Vocab ID not defined when updating public vocab 🔴",
      };
    }

    const vocab_DATA: {
      difficulty?: number;
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
        .eq("id", public_vocab_id) // Find vocab by its ID
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
          .from("translations")
          .select("id")
          .eq("public_vocab_id", public_vocab_id)
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
                public_vocab_id,
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
          "🔴 Error updating some public translations 🔴",
          failedTranslations
        );
        return {
          success: false,
          msg: "🔴 Error updating some public translations 🔴",
        };
      }

      return {
        success: true,
        data: { updatedVocabData, translations: translationResults },
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
