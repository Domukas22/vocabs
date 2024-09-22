import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export default function USE_fetchOneLang() {
  const [IS_langLoading, SET_areLangLoading] = useState(false);

  const FETCH_lang = async (id: string) => {
    if (!id) {
      console.log("🔴 Language ID not provided 🔴");
      return { success: false, msg: "🔴 Language ID not provided 🔴" };
    }

    try {
      SET_areLangLoading(true);

      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("id", id)
        .single(); // Fetch a single language

      if (error) {
        console.log("🔴 Error fetching one language 🔴 : ", error);
        return { success: false, msg: "🔴 Error fetching one language 🔴" };
      }
      return { success: true, data };
    } catch (error) {
      console.log("🔴 Error fetching one language 🔴 : ", error);
      return { success: false, msg: "🔴 Error fetching one language 🔴" };
    } finally {
      SET_areLangLoading(false); // Ensure the loading state is reset
    }
  };

  return { FETCH_lang, IS_langLoading };
}
