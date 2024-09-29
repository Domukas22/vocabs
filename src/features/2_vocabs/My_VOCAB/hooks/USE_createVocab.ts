import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
import {
  TranslationCreation_PROPS,
  Vocab_MODEL,
  Translation_MODEL,
} from "@/src/db/models";

interface VocabCreation_MODEL {
  user_id?: string | null | undefined;
  list_id?: string | null | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "" | null | undefined;
  translations: TranslationCreation_PROPS[] | undefined | [] | null;
  is_public?: boolean;
  IS_admin?: boolean;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);

  const CREATE_vocab = async (
    props: VocabCreation_MODEL
  ): Promise<{ success: boolean; data?: any; msg?: string }> => {
    const {
      user_id,
      list_id,
      difficulty,
      description,
      image,
      translations,
      is_public = false,
      IS_admin = false,
    } = props;

    console.log("PUBLIC: ", is_public);

    // Initial checks
    if (is_public) {
      if (!IS_admin) {
        console.log("🔴 Only admins can create public vocabs 🔴");
        return {
          success: false,
          msg: "🔴 Only admins can create public vocabs 🔴",
        };
      }
      // Set user_id and list_id to null for public vocabs
    } else {
      if (!user_id) {
        console.log("🔴 User not defined when creating private vocab 🔴");
        return {
          success: false,
          msg: "🔴 User not defined when creating private vocab 🔴",
        };
      }
      if (!list_id) {
        console.log("🔴 List not defined when creating private vocab 🔴");
        return {
          success: false,
          msg: "🔴 List not defined when creating private vocab 🔴",
        };
      }
    }

    try {
      SET_isCreatingVocab(true);

      // Insert vocab
      const vocabResponse = await HANDLE_vocabCreation({
        user_id: is_public ? null : user_id, // user_id null for public vocabs
        list_id: is_public ? null : list_id, // list_id null for public vocabs
        difficulty,
        description,
        image,
        is_public,
      });

      if (!vocabResponse.success) return vocabResponse;

      const vocabData = vocabResponse.data;

      // Handle translation insertion if translations exist
      const finalVocab = await HANDLE_translationInsertion({
        vocabData,
        translations,
        user_id: is_public ? null : user_id, // user_id null for public translations
        is_public,
      });

      return { success: true, data: finalVocab };
    } catch (error) {
      console.log("🔴 Error creating vocab or translations 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error creating vocab or translations 🔴",
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_vocab, IS_creatingVocab };
}

// Helper function to insert vocab
async function HANDLE_vocabCreation(vocab_DATA: {
  user_id: string | null | undefined;
  list_id: string | null | undefined;
  difficulty?: number;
  description?: string;
  image?: string;
  is_public: boolean;
}): Promise<{ success: boolean; data?: any; msg?: string }> {
  try {
    const { data, error } = await supabase
      .from("vocabs")
      .insert([vocab_DATA])
      .select()
      .single();

    if (error) {
      console.log("🔴 Error creating vocab 🔴 : ", error);
      return { success: false, msg: error.message };
    }
    console.log("🟢 Vocab created 🟢");
    return { success: true, data };
  } catch (error) {
    console.log("🔴 Error inserting vocab 🔴", error);
    return { success: false, msg: "🔴 Error inserting vocab 🔴" };
  }
}

// Helper function to insert translations and return final vocab
async function HANDLE_translationInsertion({
  vocabData,
  translations,
  user_id,
  is_public,
}: {
  vocabData: Vocab_MODEL;
  translations: TranslationCreation_PROPS[] | undefined;
  user_id: string | null | undefined;
  is_public: boolean;
}): Promise<Vocab_MODEL> {
  if (translations && translations.length > 0) {
    const { success: transSuccess, data: insertedTranslations } =
      await db_INSERT_translations(
        vocabData.id,
        user_id,
        translations,
        is_public
      );

    if (!transSuccess) throw new Error("🔴 Error inserting translations 🔴");

    console.log("🟢 Translations created 🟢");
    return { ...vocabData, translations: insertedTranslations };
  }

  // Return vocab without translations if none provided
  return { ...vocabData, translations: [] };
}

// Insert translations into the database
async function db_INSERT_translations(
  vocab_id: string,
  user_id: string | null | undefined,
  translations: TranslationCreation_PROPS[],
  is_public: boolean
) {
  try {
    const translationPromises = translations.map((translation) => {
      const translation_DATA = {
        vocab_id,
        user_id,
        lang_id: translation.lang_id,
        text: translation.text,
        highlights: translation.highlights,
        is_public, // Set is_public according to vocab setting
      };

      return supabase.from("translations").insert([translation_DATA]).select();
    });

    const results = await Promise.all(translationPromises);

    const failedTranslations = results.filter(({ error }) => error);
    if (failedTranslations.length > 0) {
      console.log("🔴 Error creating some translations 🔴", failedTranslations);
      return { success: false, failedTranslations };
    }

    const insertedTranslations = results.flatMap((x) => x.data);
    return { success: true, data: insertedTranslations };
  } catch (error) {
    console.log("🔴 Error inserting translations 🔴", error);
    return { success: false, error };
  }
}
