import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Styled_TEXT } from "../components/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/Page_WRAP/Page_WRAP";
import { MyColors } from "../constants/MyColors";
import Block from "../components/Block/Block";
import StyledText_INPUT from "../components/StyledText_INPUT/StyledText_INPUT";
import { useEffect, useState } from "react";
import Label from "../components/Label/Label";
import Btn from "../components/Btn/Btn";
import { Link, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import AuthenticationHeader from "../features/0_authentication/components/AuthenticationHeader";
import Error_TEXT from "../components/Error_TEXT/Error_TEXT";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import LoginRegister_SWITCH from "../features/0_authentication/components/LoginRegister_SWTICH";
import { USE_auth } from "../context/Auth_CONTEXT";
import * as SecureStore from "expo-secure-store";
import db, { Users_DB } from "../db";
import USE_zustand from "../zustand";

import { Q } from "@nozbe/watermelondb";
import { View } from "react-native";
import Confirmation_MODAL from "../components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import USE_modalToggles from "../hooks/USE_modalToggles";
import NAVIGATE_user from "../utils/NAVIGATE_user";
import { USE_sync } from "../hooks/USE_sync/USE_sync";
import { useToast } from "react-native-toast-notifications";
type LoginData_PROPS = {
  email: string;
  password: string;
};

export default function Login_PAGE() {
  const [loading, SET_loading] = useState(false);
  const [internal_ERROR, SET_internalError] = useState("");
  const { t } = useTranslation();
  const router = useRouter(); // Initialize router
  const { login, logout } = USE_auth();
  const { z_SET_user } = USE_zustand();
  const toast = useToast();
  const { sync } = USE_sync();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "recoverDeletedAccount", initialValue: false },
  ]);

  const [error, SET_error] = useState({
    value: false,
    user_MSG: "",
  });

  const [targetUser_ID, SET_targetUserId] = useState<string | undefined>();

  const CANCEL_profileRevival = async () => {
    const { error } = await logout();
    TOGGLE_modal("recoverDeletedAccount");
  };

  const REVIVE_profile = async () => {
    if (!targetUser_ID) return;

    const { error: userError } = await supabase
      .from("users")
      .update({ deleted_at: null })
      .eq("id", targetUser_ID)
      .single();

    if (userError) return console.error(userError);

    await SecureStore.setItemAsync("user_id", targetUser_ID);

    toast.show(t("notifications.profileReviced"), {
      type: "success",
      duration: 10000,
    });

    await NAVIGATE_user({
      navigateToWelcomeSreenOnError: false,
      z_SET_user,
      SET_error,
      router,
      SHOW_recoveryModal: () => TOGGLE_modal("recoverDeletedAccount"),
      sync,
    });

    // const { watermelon_USER, supabase_USER } =
    //   await GET_watermelonAndSupabaseUser(targetUser_ID);

    // if (watermelon_USER) {
    //   z_SET_user(watermelon_USER);
    //   await HANDLE_initialRouting({
    //     watermelon_USER,
    //     supabase_USER,
    //     NAVIGATE_toVocabs,
    //     NAVIGATE_toWelcomeScreen,
    //   });
    //   router.push("/(main)/vocabs");
    // }
  };

  const _login = async (data: LoginData_PROPS) => {
    const { email, password } = data;
    if (!email || !password) return;
    SET_error({
      value: false,
      user_MSG: "",
    });

    SET_loading(true);
    const { userData, error } = await login(email, password);
    SET_loading(false);

    if (error) {
      SET_internalError(error.message);
    } else if (typeof userData?.id === "string") {
      SET_targetUserId(userData.id);
      await SecureStore.setItemAsync("user_id", userData?.id);
      await NAVIGATE_user({
        navigateToWelcomeSreenOnError: true,
        z_SET_user,
        SET_error,
        router,
        SHOW_recoveryModal: () => TOGGLE_modal("recoverDeletedAccount"),
        sync,
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
  } = useForm<LoginData_PROPS>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData_PROPS) => _login(data);

  // ---------------------------------------------------------------------------------------------------

  const Pupyte = () => {
    setValue("email", "pupyte@gmail.com");
    setValue("password", "pupyte");
  };
  const Domukas = () => {
    setValue("email", "domukas@gmail.com");
    setValue("password", "domukas");
  };
  const Deleted_2 = () => {
    setValue("email", "deleted_2@gmail.com");
    setValue("password", "deleted_2");
  };

  useEffect(() => {
    (async () => {
      const s = await Users_DB.query();
      console.log(
        "Saved users in WatermelonDB: ",
        s?.map((y) => y.username)
      );
    })();
  }, []);

  // ---------------------------------------------------------------------------------------------------

  return (
    <Page_WRAP bottomEdge>
      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: 20 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          <AuthenticationHeader
            text={t("header.login")}
            image_EL={
              <Image
                source={require("@/src/assets/images/icon_hello.png")}
                style={{ height: 60, width: 40, objectFit: "contain" }}
              />
            }
          />
          <Block noBorder>
            <Label>What is your E-Mail?</Label>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please provide an E-Mail address",
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
                  message: "Please provide a valid E-Mail address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledText_INPUT
                  placeholder="email@gmail.com..."
                  onBlur={onBlur}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError(""); // Clear internal error on change
                  }}
                  value={value}
                  error={!!errors.email}
                  props={{ keyboardType: "email-address" }}
                  IS_errorCorrected={
                    isSubmitted && !errors.email && !internal_ERROR
                  }
                />
              )}
              name="email"
            />
            {errors.email && <Error_TEXT text={errors.email.message} />}
          </Block>

          <Block noBorder>
            <Label>Enter your password</Label>
            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please provide a password",
                },
                minLength: {
                  value: 6,
                  message: `Password must be at least 6 characters long.`,
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledText_INPUT
                  placeholder="Password..."
                  onBlur={onBlur}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError(""); // Clear internal error on change
                  }}
                  value={value}
                  error={!!errors.password}
                  IS_errorCorrected={
                    isSubmitted && !errors.password && !internal_ERROR
                  }
                  props={{ secureTextEntry: true }}
                />
              )}
              name="password"
            />
            {errors.password && <Error_TEXT text={errors.password.message} />}
            <Link href={"/login"} style={{ display: "flex", marginTop: 8 }}>
              <Styled_TEXT
                type="text_18_regular"
                style={{
                  color: MyColors.text_primary,
                  textAlign: "right",
                  width: "100%",
                }}
              >
                I forgot my password
              </Styled_TEXT>
            </Link>
          </Block>

          {internal_ERROR && (
            <Notification_BOX text={internal_ERROR} type="error" />
          )}
          {error.value && (
            <Notification_BOX text={error.user_MSG} type="error" />
          )}
          <Block styles={{ marginTop: 8, marginBottom: 100 }}>
            <Btn
              text={!loading ? "Log in" : ""}
              iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
              type="action"
              onPress={handleSubmit(onSubmit)}
            />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Btn text="Domukas" onPress={Domukas} />
              <Btn text="Pupyte" onPress={Pupyte} />
              <Btn text="Deleted_2" onPress={Deleted_2} />
            </View>
          </Block>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoginRegister_SWITCH page="login" />
      <Confirmation_MODAL
        action={async () => await REVIVE_profile()}
        actionBtnText="Yes, recover"
        open={modal_STATES.recoverDeletedAccount}
        title="Recover account?"
        toggle={async () => await CANCEL_profileRevival()}
      >
        <Styled_TEXT type="label">
          The account you are trying to log in to was deleted XXX days ago and
          will be deleted permanently in XXX days if it's not recovered.
        </Styled_TEXT>
        <Styled_TEXT type="label">
          Do you wish to recover this account?
        </Styled_TEXT>
      </Confirmation_MODAL>
    </Page_WRAP>
  );
}
