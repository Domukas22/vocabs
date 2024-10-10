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

type RegisterData_PROPS = {
  email: string;
  password: string;
};

export default function Register_PAGE() {
  const [loading, SET_loading] = useState(false);
  const [internal_ERROR, SET_internalError] = useState("");
  const { t } = useTranslation();
  const router = useRouter();

  const register = async (data: RegisterData_PROPS) => {
    const { email, password } = data;
    if (!email || !password) return;
    SET_loading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    // await createUser(email);

    SET_loading(false);

    if (error) {
      SET_internalError(error.message);
    } else {
      router.push("/(main)/vocabs"); // Navigate to main route on success
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: RegisterData_PROPS) => register(data);

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
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledText_INPUT
                  placeholder="email@gmail.com..."
                  onBlur={onBlur}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError("");
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
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledText_INPUT
                  placeholder="Password..."
                  onBlur={onBlur}
                  SET_value={(val) => {
                    onChange(val);
                    SET_internalError("");
                  }}
                  value={value}
                  error={!!errors.password}
                  IS_errorCorrected={
                    isSubmitted && !errors.password && !internal_ERROR
                  }
                  props={{
                    secureTextEntry: true,
                  }}
                />
              )}
              name="password"
            />
            {errors.password && (
              <Error_TEXT>{errors.password.message}</Error_TEXT>
            )}
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

// async function createUser(email: string) {
//   await db.write(async () => {
//     await Users_DB.create((user: User_MODEL) => {
//       user.email = email;
//       user.is_premium = false;
//       user.is_admin = false;
//       user.payment_date = "";
//       user.payment_amount = 0;
//       user.payment_type = "0";
//       user.app_lang_id = "en";
//     });
//   });
// }
