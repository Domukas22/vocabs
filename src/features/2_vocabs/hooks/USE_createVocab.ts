import db, { Translations_DB, Vocabs_DB } from "@/src/db";
import { useCallback, useMemo, useState } from "react";
import {
  TranslationCreation_PROPS,
  User_PROPS,
  Vocab_PROPS,
} from "@/src/db/props";
import {
  Vocab_MODEL,
  Translation_MODEL,
  List_MODEL,
} from "@/src/db/watermelon_MODELS";

interface VocabCreation_MODEL {
  user?: User_PROPS | undefined;
  list?: List_MODEL | undefined;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  translations: TranslationCreation_PROPS[] | undefined;
  is_public?: boolean;
  onSuccess: (new_VOCAB: Vocab_PROPS) => void;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);
  const [db_ERROR, SET_error] = useState<string | null>(null);
  const RESET_dbError = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to create the vocab. This is an issue on our side. Please try to reload the app and see if the problem persists. The issue has been recorded and will be reviewed by developers. We apologize for the trouble.",
    []
  );

  const CREATE_vocab = async ({
    user,
    list,
    difficulty,
    description,
    translations,
    is_public = false,
    onSuccess,
  }: VocabCreation_MODEL): Promise<{
    success: boolean;
    data?: any;
    msg?: string;
  }> => {
    SET_error(null); // Clear any previous error

    // Initial validation checks
    if (is_public && !user?.is_admin) {
      SET_error("Only admins can create public vocabs.");
      return {
        success: false,
        msg: "🔴 Only admins can create public vocabs 🔴",
      };
    }

    if (!is_public) {
      if (!user?.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 User ID is required for creating private vocabs 🔴",
        };
      }

      if (!list || !list.id) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: "🔴 List is required for creating private vocabs 🔴",
        };
      }
    }

    try {
      SET_isCreatingVocab(true);

      const newVocab = await db.write(async () => {
        const vocab = await Vocabs_DB.create((vocab: Vocab_MODEL) => {
          vocab.user_id = is_public ? null : user?.id;
          vocab.list?.set(is_public ? null : list);
          vocab.difficulty = difficulty || 3;
          vocab.description = description || "";
          vocab.is_public = is_public;

          vocab.lang_ids = // ["en", "de"]
            translations && translations.length > 0
              ? translations?.reduce((acc, tr) => {
                  if (!acc.includes(tr.lang_id)) acc.push(tr.lang_id);
                  return acc;
                }, [] as string[])
              : [];
        });

        if (translations) {
          translations.map(async (translation) => {
            return await Translations_DB.create((trans) => {
              trans.vocab.set(vocab);
              trans.user_id = is_public ? undefined : user?.id;
              trans.lang_id = translation.lang_id;
              trans.text = translation.text;
              trans.highlights = translation.highlights;
              trans.is_public = is_public;
            });
          });
        }

        return vocab;
      });

      // Success handling
      if (onSuccess) {
        onSuccess(newVocab);
      }
      console.log("🟢 Vocab created successfully 🟢");

      return { success: true, data: newVocab };
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        SET_error(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during vocab creation 🔴: ${error.message}`,
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_vocab, IS_creatingVocab, db_ERROR, RESET_dbError };
}
