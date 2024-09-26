import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

export default function USE_deleteList() {
  const [IS_deletingList, SET_deletingList] = useState(false);
  const [deleteList_ERROR, SET_deleteListError] = useState<string | null>(null);
  const toast = useToast();
  const { t } = useTranslation();

  const { z_DELETE_privateList } = USE_zustand();

  const DELETE_list = async (
    targetList_ID: string
  ): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_deletingList(true);
      SET_deleteListError(null); // Reset error state before deleting the list

      const { error } = await supabase
        .from("lists")
        .delete()
        .eq("id", targetList_ID);

      // Handle potential errors
      if (error) {
        console.error("🔴 Error deleting list: 🔴", error);
        SET_deleteListError("🔴 Error deleting list 🔴");
        return { success: false, msg: "🔴 Error deleting list 🔴" };
      }

      z_DELETE_privateList(targetList_ID);
      console.log("🟢 List deleted 🟢");
      toast.show(t("notifications.listDeleted"), {
        type: "custom_success",
        duration: 2000,
      });

      return { success: true, msg: "🟢 List deleted successfully 🟢" };
    } catch (error) {
      console.error("🔴 Unexpected error deleting list: 🔴", error);
      SET_deleteListError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_deletingList(false); // Always stop loading after the request
    }
  };

  return { DELETE_list, IS_deletingList, deleteList_ERROR };
}
