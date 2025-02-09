//
//
//

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Block from "../components/1_grouped/blocks/Block/Block";
import StyledText_INPUT from "../components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";
import { useState } from "react";
import Label from "../components/1_grouped/texts/labels/Label/Label";
import Btn from "../components/1_grouped/buttons/Btn/Btn";
import { useRouter } from "expo-router";

import { useForm, Controller } from "react-hook-form";
import Notification_BLOCK from "../components/1_grouped/blocks/Notification_BLOCK/Notification_BLOCK";
import AuthenticationHeader from "../components/2_byPage/authentication/AuthenticationHeader";
import { useTranslation } from "react-i18next";
import Error_TEXT from "../components/1_grouped/texts/Error_TEXT/Error_TEXT";
import LoginRegister_SWITCH from "../components/2_byPage/authentication/LoginRegister_SWTICH";

import * as SecureStore from "expo-secure-store";
import { USE_auth } from "../context/Auth_CONTEXT";

import { USE_zustand } from "@/src/hooks";

import { USE_sync } from "../hooks/USE_sync/USE_sync";
import { USE_navigateUser } from "../features/users/functions/general/hooks/USE_navigateUser/USE_navigateUser";
import { View } from "react-native";

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
  const { navigate } = USE_navigateUser();

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
      await SecureStore.setItemAsync("user_id", userData?.user?.id);
      await navigate();
    }
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
    <View>
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
            <Notification_BLOCK text={internal_ERROR} type="error" />
          )}
          {/* {error.value && (
            <Notification_BLOCK text={error.user_MSG} type="error" />
          )} */}
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
    </View>
  );
}
