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
import { useState } from "react";
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
import { FETCH_userFromSupabase, HANDLE_watermelonUser } from "./_layout";
import { User_MODEL } from "../db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";
import { sync } from "../db/sync";

type LoginData_PROPS = {
  email: string;
  password: string;
};

export default function Login_PAGE() {
  const [loading, SET_loading] = useState(false);
  const [internal_ERROR, SET_internalError] = useState("");
  const { t } = useTranslation();
  const router = useRouter(); // Initialize router
  const { login } = USE_auth();
  const { z_SET_user } = USE_zustand();

  const _login = async (data: LoginData_PROPS) => {
    const { email, password } = data;
    if (!email || !password) return;

    SET_loading(true);
    const { userData, error } = await login(email, password);
    SET_loading(false);

    if (error) {
      SET_internalError(error.message);
    } else if (typeof userData?.id === "string") {
      // sucessfully logged in --> save user id to local storage
      await SecureStore.setItemAsync("user_id", userData?.id);
      await sync("all", userData?.id);

      router.push("/(main)/vocabs");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginData_PROPS>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData_PROPS) => _login(data);

  return (
    <Page_WRAP>
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
            {errors.email && <Error_TEXT>{errors.email.message}</Error_TEXT>}
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
            {errors.password && (
              <Error_TEXT>{errors.password.message}</Error_TEXT>
            )}
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
          <Block styles={{ marginTop: 8, marginBottom: 100 }}>
            <Btn
              text={!loading ? "Log in" : ""}
              iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
              type="action"
              onPress={handleSubmit(onSubmit)}
            />
          </Block>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoginRegister_SWITCH page="login" />
    </Page_WRAP>
  );
}
