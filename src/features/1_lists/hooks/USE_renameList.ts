import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

export default function USE_renameList() {
  const [IS_renamingList, SET_renamingList] = useState(false);
  const [renameList_ERROR, SET_renameListError] = useState<string | null>(null);
  const toast = useToast();
  const { t } = useTranslation();

  const { z_RENAME_privateList } = USE_zustand();

  const RENAME_list = async (
    targetList_ID: string,
    newListName: string
  ): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_renamingList(true);
      SET_renameListError(null); // Reset error state before renaming the list

      const { error } = await supabase
        .from("lists")
        .update({ name: newListName })
        .eq("id", targetList_ID);

      // Handle potential errors
      if (error) {
        console.error("🔴 Error renaming list: 🔴", error);
        SET_renameListError("🔴 Error renaming list 🔴");
        return { success: false, msg: "🔴 Error renaming list 🔴" };
      }

      z_RENAME_privateList(targetList_ID, newListName);
      console.log("🟢 List renamed 🟢");
      toast.show(t("notifications.listRenamed"), {
        type: "custom_success",
        duration: 2000,
      });

      return { success: true, msg: "🟢 List renamed 🟢" };
    } catch (error) {
      console.error("🔴 Unexpected error renaming list: 🔴", error);
      SET_renameListError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_renamingList(false); // Always stop loading after the request
    }
  };

  return { RENAME_list, IS_renamingList, renameList_ERROR };
}
