///
///
///
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";
interface VocabCreation_MODEL {
  user_id: string;
  list_id: string;
  difficulty?: 1 | 2 | 3;
  description?: string | "";
  image?: string | "";
  toggleFn: () => void;
}

export default function USE_createVocab() {
  const [IS_creatingVocab, SET_isCreatingVocab] = useState(false);

  const CREATE_newVocab = async (
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
      toggleFn = () => {},
    } = props;

    if (!user_id) {
      console.log("🔴 User not defined when creating vocab 🔴");
      return {
        success: false,
        msg: "🔴 User not defined when creating vocab 🔴",
      };
    }

    if (!list_id) {
      console.log("🔴 List not defined when creating vocab 🔴");
      return {
        success: false,
        msg: "🔴 List not defined when creating vocab 🔴",
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
    };

    if (difficulty) vocab_DATA.difficulty = difficulty;
    if (description) vocab_DATA.description = description;
    if (image) vocab_DATA.image = image;

    try {
      SET_isCreatingVocab(true);

      const { data, error } = await supabase
        .from("vocabs")
        .insert([vocab_DATA])
        .select();

      if (error) {
        console.log("🔴 Error creating vocab 🔴 : ", error);
        return {
          success: false,
          msg: "🔴 Error creating vocab 🔴",
        };
      }

      toggleFn();
      return { success: true, data };
    } catch (error) {
      console.log("🔴 Error creating vocab 🔴 : ", error);
      return {
        success: false,
        msg: "🔴 Error creating vocab 🔴",
      };
    } finally {
      SET_isCreatingVocab(false);
    }
  };

  return { CREATE_newVocab, IS_creatingVocab };
}
