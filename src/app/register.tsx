//
//
//

import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Styled_TEXT } from "../components/Styled_TEXT/Styled_TEXT";
import Page_WRAP from "../components/Page_WRAP/Page_WRAP";
import { MyColors } from "../constants/MyColors";
import Block from "../components/Block/Block";
import StyledText_INPUT from "../components/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import Label from "../components/Label/Label";
import Btn from "../components/Btn/Btn";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";

import { useForm, Controller } from "react-hook-form";
import { ICON_arrow } from "../components/icons/icons";
import { useToast } from "react-native-toast-notifications";
import Notification_BOX from "../components/Notification_BOX/Notification_BOX";
import AuthenticationHeader from "../features/0_authentication/components/AuthenticationHeader";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import Error_TEXT from "../components/Error_TEXT/Error_TEXT";
import LoginRegister_SWITCH from "../features/0_authentication/components/LoginRegister_SWTICH";
import db, { Users_DB } from "../db";
import { User_MODEL } from "../db/watermelon_MODELS";
import * as SecureStore from "expo-secure-store";
import { USE_auth } from "../context/Auth_CONTEXT";
import { HANDLE_userRouting, HANDLE_watermelonUser } from "./_layout";
import USE_zustand from "../zustand";
import { sync } from "../db/sync";

type RegisterData_PROPS = {
  username: string;
  email: string;
  password: string;
};

export default function Register_PAGE() {
  const { register } = USE_auth();
  const [loading, SET_loading] = useState(false);
  const [internal_ERROR, SET_internalError] = useState("");
  const { t } = useTranslation();
  const router = useRouter();
  const { z_SET_user } = USE_zustand();

  const _register = async (data: RegisterData_PROPS) => {
    const { username, email, password } = data;
    if (!email || !password || !username) return;

    SET_loading(true);
    const { userData, error } = await register(username, email, password);
    SET_loading(false);

    if (error) {
      SET_internalError(error);
      console.error(error);
    } else if (!error && userData && typeof userData?.user?.id === "string") {
      // account on supabase has been created, now insert user_id into local storage
      await SecureStore.setItemAsync("user_id", userData?.user?.id);
      await HANDLE_userRouting(router, userData?.user?.id, z_SET_user);

      router.push("/(main)/vocabs");
    }

    // router.push("/(main)/vocabs"); // Navigate to main route on success
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: RegisterData_PROPS) => _register(data);
  // const onSubmit = (data: RegisterData_PROPS) => {};
  return (
    <Page_WRAP>
      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: 20 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {/* --------------------------------------------------------------------------------------------------- */}
          <AuthenticationHeader
            text={t("header.createAnAccount")}
            image_EL={
              <Image
                source={require("@/src/assets/images/icon_new.png")}
                style={{ height: 60, width: 60, objectFit: "contain" }}
              />
            }
          />
          <Block noBorder>
            <Label>Create a username</Label>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please provide an username",
                },
                minLength: {
                  value: 5,
                  message: "Username must be at least 5 characters long",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <StyledText_INPUT
                  {...{ value, error, isSubmitted, onBlur }}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError("");
                  }}
                />
              )}
              name="username"
            />
            {errors.username && <Error_TEXT text={errors.username.message} />}
          </Block>
          <Block noBorder>
            <Label>What is your E-Mail?</Label>

            <Controller
              control={control}
              rules={{
                required: {
                  value: true,
                  message: "Please provide an E-Mail adress",
                },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation regex
                  message: "Please provide a valid E-Mail address",
                },
              }}
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <StyledText_INPUT
                  {...{ value, error, isSubmitted, onBlur }}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError("");
                  }}
                  props={{ keyboardType: "email-address" }}
                />
              )}
              name="email"
            />
            {errors.email && <Error_TEXT text={errors.email.message} />}
          </Block>

          {/* --------------------------------------------------------------------------------------------------- */}

          <Block noBorder>
            <Label>Create a password</Label>
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
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <StyledText_INPUT
                  {...{ value, error, isSubmitted, onBlur }}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError("");
                  }}
                  props={{
                    secureTextEntry: true,
                  }}
                />
              )}
              name="password"
            />
            {errors.password && <Error_TEXT text={errors.password.message} />}
          </Block>

          {/* --------------------------------------------------------------------------------------------------- */}
          {internal_ERROR && (
            <Notification_BOX text={internal_ERROR} type="error" />
          )}
          <Block styles={{ marginTop: 8, marginBottom: 100 }}>
            <Btn
              text={!loading ? "Create account" : ""}
              iconRight={loading ? <ActivityIndicator color={"black"} /> : null}
              type="action"
              onPress={handleSubmit(onSubmit)}
            />
          </Block>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoginRegister_SWITCH page="register" />
    </Page_WRAP>
  );
}
