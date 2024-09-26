import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

export default function USE_updateDefaultListTRs() {
  const [IS_updatingDefaultListTRs, SET_updatingDefaultListTRs] =
    useState(false);
  const [updateDefaultTRs_ERROR, SET_updateDefaultTRsError] = useState<
    string | null
  >(null);
  const toast = useToast();
  const { t } = useTranslation();

  const { z_UPDATE_defaultListTRs } = USE_zustand();

  const UPDATE_defaultListTRs = async (
    targetList_ID: string,
    newDefaultTRs: string[] // Assuming it's an array of strings (modify if needed)
  ): Promise<{
    success: boolean;
    msg?: string;
  }> => {
    try {
      SET_updatingDefaultListTRs(true);
      SET_updateDefaultTRsError(null); // Reset error state before updating

      const { error } = await supabase
        .from("lists")
        .update({ default_TRs: newDefaultTRs })
        .eq("id", targetList_ID);

      // Handle potential errors
      if (error) {
        console.error("🔴 Error updating default_TRs: 🔴", error);
        SET_updateDefaultTRsError("🔴 Error updating default_TRs 🔴");
        return { success: false, msg: "🔴 Error updating default_TRs 🔴" };
      }

      z_UPDATE_defaultListTRs(targetList_ID, newDefaultTRs);
      console.log("🟢 Default TRs updated 🟢");
      toast.show(t("notifications.defaultTRsUpdated"), {
        type: "custom_success",
        duration: 2000,
      });

      return { success: true, msg: "🟢 Default TRs updated successfully 🟢" };
    } catch (error) {
      console.error("🔴 Unexpected error updating default_TRs: 🔴", error);
      SET_updateDefaultTRsError("🔴 Unexpected error occurred. 🔴");
      return { success: false, msg: "🔴 Unexpected error occurred. 🔴" };
    } finally {
      SET_updatingDefaultListTRs(false); // Always stop loading after the request
    }
  };

  return {
    UPDATE_defaultListTRs,
    IS_updatingDefaultListTRs,
    updateDefaultTRs_ERROR,
  };
}
