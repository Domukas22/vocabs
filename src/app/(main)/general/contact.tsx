//
//
//

import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";

import { ICON_3dots, ICON_arrow } from "@/src/components/icons/icons";

import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from "react-native";

import { Link, router, useRouter } from "expo-router";

import Block from "@/src/components/Block/Block";
import StyledText_INPUT from "@/src/components/StyledText_INPUT/StyledText_INPUT";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Label from "@/src/components/Label/Label";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import Error_TEXT from "@/src/components/Error_TEXT/Error_TEXT";

type ContactMessage_PROPS = {
  message: string;
  name: string;
  email: string;
};

export default function Contact_PAGE() {
  const { t } = useTranslation();
  const [message, SET_message] = useState("");
  const [name, SET_name] = useState("");
  const [email, SET_email] = useState("");
  const router = useRouter();

  const [loading, SET_loading] = useState(false);
  const [internal_ERROR, SET_internalError] = useState("");
  const [sent, SET_sent] = useState(false);

  const SEND_message = async (data: ContactMessage_PROPS) => {
    const { message, name, email } = data;

    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Message: ", message);
    console.log("------------------------------------");
    SET_message(message);
    SET_name(name);
    SET_email(email);
    SET_sent(true);
    reset();
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    reset,
  } = useForm<ContactMessage_PROPS>({
    defaultValues: {
      message: "",
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: ContactMessage_PROPS) => SEND_message(data);

  return (
    <Page_WRAP>
      <Header
        title={t("pages.contact.header")}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1, marginBottom: 20 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
          {sent && (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  marginBottom: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                  paddingVertical: 32,
                }}
              >
                <Image
                  style={{ height: 60, width: 60, marginBottom: 16 }}
                  source={require("@/src/assets/images/success.png")}
                  resizeMode="cover"
                />
                <Styled_TEXT
                  type="text_22_bold"
                  style={{ textAlign: "center" }}
                >
                  Thanks for reaching out!
                </Styled_TEXT>
                <Styled_TEXT type="label" style={{ textAlign: "center" }}>
                  Your message was received and will be reviewed as soon as
                  possible!
                </Styled_TEXT>
              </View>
              <View
                style={{
                  gap: 12,
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                }}
              >
                <Styled_TEXT type="text_18_bold">
                  Here is what we received:{" "}
                </Styled_TEXT>

                <View
                  style={{
                    gap: 16,
                  }}
                >
                  <View style={{ gap: 4 }}>
                    <Styled_TEXT style={{ textDecorationLine: "underline" }}>
                      Name:{" "}
                    </Styled_TEXT>
                    <Styled_TEXT>{name}</Styled_TEXT>
                  </View>
                  <View style={{ gap: 4 }}>
                    <Styled_TEXT style={{ textDecorationLine: "underline" }}>
                      Email:{" "}
                    </Styled_TEXT>
                    <Styled_TEXT>{email}</Styled_TEXT>
                  </View>
                  <View style={{ gap: 4 }}>
                    <Styled_TEXT style={{ textDecorationLine: "underline" }}>
                      Message:{" "}
                    </Styled_TEXT>
                    <Styled_TEXT>{message}</Styled_TEXT>
                  </View>
                </View>
              </View>
              <View
                style={{
                  gap: 8,
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                  flexDirection: "row",
                }}
              >
                <Btn
                  text="Back"
                  iconLeft={<ICON_arrow direction="left" color="gray_light" />}
                  onPress={() => {
                    SET_sent(false);
                    router.back();
                  }}
                />
                <Btn
                  text="View my vocabs"
                  style={{ flex: 1 }}
                  onPress={() => {
                    SET_sent(false);
                    router.push("/(main)/vocabs/");
                  }}
                />
              </View>
            </View>
          )}
          {!sent && (
            <>
              <Block noBorder>
                <Label>{t("pages.contact.label.message")}</Label>
                <Controller
                  name="message"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message:
                        "We can't read your mind just yet! Please enter a message.",
                    },
                    minLength: {
                      value: 10,
                      message:
                        "Your message must include at least 10 characters",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <StyledText_INPUT
                      multiline
                      onBlur={onBlur}
                      SET_value={(val) => {
                        onChange(val);
                        SET_internalError("");
                      }}
                      value={value}
                      error={!!error}
                      // props={{ keyboardType: "email-address" }}
                      IS_errorCorrected={
                        isSubmitted && !errors.email && !internal_ERROR
                      }
                    />
                  )}
                />
                {errors.message && <Error_TEXT text={errors.message.message} />}
              </Block>
              <Block noBorder>
                <Label>{t("pages.contact.label.name")}</Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Please enter your name.",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <StyledText_INPUT
                      onBlur={onBlur}
                      SET_value={(val) => {
                        onChange(val);
                        SET_internalError("");
                      }}
                      value={value}
                      error={!!error}
                      IS_errorCorrected={
                        isSubmitted && !error && !internal_ERROR
                      }
                    />
                  )}
                />
                {errors.name && <Error_TEXT text={errors.name.message} />}
              </Block>
              <Block noBorder>
                <Label>{t("pages.contact.label.email")}</Label>
                <Controller
                  name="email"
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
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <StyledText_INPUT
                      onBlur={onBlur}
                      SET_value={(val) => {
                        onChange(val);
                        SET_internalError("");
                      }}
                      value={value}
                      error={!!error}
                      props={{ keyboardType: "email-address" }}
                      IS_errorCorrected={
                        isSubmitted && !error && !internal_ERROR
                      }
                    />
                  )}
                />
                {errors.email && <Error_TEXT text={errors.email.message} />}
              </Block>

              <Block>
                <Btn
                  text={t("pages.contact.btn")}
                  type="action"
                  onPress={handleSubmit(onSubmit)}
                  style={{ marginTop: 12 }}
                />
              </Block>
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: MyColors.border_white_005,
                }}
              >
                <Styled_TEXT type="text_18_bold">
                  {t("pages.contact.info_block.title")}
                </Styled_TEXT>
                <Link href={"/(main)/general/about"}>
                  <Styled_TEXT style={{ color: MyColors.text_primary }}>
                    Domas Sirbike
                  </Styled_TEXT>
                </Link>
                <Styled_TEXT type="text_18_light">
                  domassirbike@gmail.com
                </Styled_TEXT>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Page_WRAP>
  );
}
