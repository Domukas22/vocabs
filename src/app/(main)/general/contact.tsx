//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import Header from "@/src/components/1_grouped/headers/regular/Header";

import {
  ICON_3dots,
  ICON_arrow,
  ICON_checkMark,
} from "@/src/components/1_grouped/icons/icons";

import React, { useCallback, useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
} from "react-native";

import { Link, router, useRouter } from "expo-router";

import Block from "@/src/components/1_grouped/blocks/Block/Block";
import StyledText_INPUT from "@/src/components/1_grouped/inputs/StyledText_INPUT/StyledText_INPUT";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import Label from "@/src/components/1_grouped/texts/labels/Label/Label";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import Error_TEXT from "@/src/components/1_grouped/texts/Error_TEXT/Error_TEXT";
import { supabase } from "@/src/lib/supabase";
import { USE_zustand } from "@/src/hooks";

import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";

type ContactMessage_PROPS = {
  message_type: "bug" | "feedback" | "idea" | "hello" | "other";
  message: string;
  name: string;
  email: string;
};

const topic_LABELS = {
  idea: "Drop it like it's hot! What's your idea?",
  feedback: "How can we improve?",
  bug: "We are sorry you've encountered difficulties using our app. Please describe the problem in as much detail as possible.",
  hello: "Just want to chat? What's on your mind?",
  other: "What's on your mind?",
};
const topic = {
  idea: "😎  I have an awesome idea",
  feedback: "⭐  I want to provide feedback",
  bug: "😬  I noticed a problem",
  hello: "😄  I just want to say hello",
  other: "Something else...",
};

export default function Contact_PAGE() {
  const { t } = useTranslation();
  const [message, SET_message] = useState("");
  const [message_type, SET_messageType] = useState("");
  const [name, SET_name] = useState("");
  const [email, SET_email] = useState("");
  const router = useRouter();
  const { z_user } = USE_zustand();

  const [internal_ERROR, SET_internalError] = useState("");
  const [sent, SET_sent] = useState(false);

  const { SEND_contactMessage, loading, error, RESET_error } =
    USE_sendContactMessage();

  const { sync: sync_2 } = USE_sync();

  const SEND_message = async (data: ContactMessage_PROPS) => {
    const { message, name, email, message_type } = data;

    await SEND_contactMessage({
      user_id: z_user?.id,
      name,
      email,
      message,
      message_type,
    });

    if (error) {
      return console.error(error);
    }

    await sync_2("all", z_user);

    SET_message(message);
    SET_messageType(message_type);
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
    getValues,
    watch,
  } = useForm<ContactMessage_PROPS>({
    defaultValues: {
      message_type: "",
      message: "",
      name: "",
      email: z_user?.email || "",
    },
  });

  // const message_LABEL =
  // message_type === "bug"
  //   ? "We are sorry you've encountered difficulties using our app. Please describe the problem in as much detail as possible."
  //   : message_type === "bug"
  //   ? ""
  //   : "";
  //"bug" | "feedback" | "idea" | "hello" | "other";

  const type = watch("message_type");
  const label = type ? topic_LABELS[type] : topic_LABELS.other;

  const onSubmit = (data: ContactMessage_PROPS) => SEND_message(data);

  return (
    <>
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
                  <ReceivedMessage_BLOCK
                    label="Topic: "
                    text={topic[message_type || "other"]}
                  />
                  <ReceivedMessage_BLOCK label="Message: " text={message} />
                  <ReceivedMessage_BLOCK label="Name: " text={name} />
                  <ReceivedMessage_BLOCK label="Email: " text={email} />
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
            <View>
              <Block noBorder>
                <Label>{t("label.contactMessageType")}</Label>
                <Controller
                  name="message_type"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Please select a topic",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <View style={{ gap: 8 }}>
                      <Btn
                        type={value === "idea" ? "active" : "simple"}
                        iconRight={
                          value === "idea" ? (
                            <ICON_checkMark color="primary" />
                          ) : null
                        }
                        text={topic.idea}
                        text_STYLES={{ flex: 1 }}
                        style={{ flex: 1 }}
                        onPress={() => {
                          onChange("idea");
                          SET_internalError("");
                        }}
                      />
                      <Btn
                        type={value === "bug" ? "active" : "simple"}
                        iconRight={
                          value === "bug" ? (
                            <ICON_checkMark color="primary" />
                          ) : null
                        }
                        text={topic.bug}
                        text_STYLES={{ flex: 1 }}
                        style={{ flex: 1 }}
                        onPress={() => {
                          onChange("bug");
                          SET_internalError("");
                        }}
                      />
                      <Btn
                        type={value === "feedback" ? "active" : "simple"}
                        iconRight={
                          value === "feedback" ? (
                            <ICON_checkMark color="primary" />
                          ) : null
                        }
                        text={topic.feedback}
                        text_STYLES={{ flex: 1 }}
                        style={{ flex: 1 }}
                        onPress={() => {
                          onChange("feedback");
                          SET_internalError("");
                        }}
                      />

                      <Btn
                        type={value === "hello" ? "active" : "simple"}
                        iconRight={
                          value === "hello" ? (
                            <ICON_checkMark color="primary" />
                          ) : null
                        }
                        text={topic.hello}
                        text_STYLES={{ flex: 1 }}
                        style={{ flex: 1 }}
                        onPress={() => {
                          onChange("hello");
                          SET_internalError("");
                        }}
                      />
                      <Btn
                        type={value === "other" ? "active" : "simple"}
                        iconRight={
                          value === "other" ? (
                            <ICON_checkMark color="primary" />
                          ) : null
                        }
                        text={topic.other}
                        text_STYLES={{ flex: 1 }}
                        style={{ flex: 1 }}
                        onPress={() => {
                          onChange("other");
                          SET_internalError("");
                        }}
                      />
                    </View>
                  )}
                />
                {errors.message_type && (
                  <Error_TEXT text={errors.message_type.message} />
                )}
              </Block>
              <Block noBorder>
                <Label>{label}</Label>
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
                <Label>{t("label.emailInput")}</Label>
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
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function USE_sendContactMessage() {
  const [loading, SET_loading] = useState(false);
  const [_error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to send a contact message. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const SEND_contactMessage = async (message_DATA: {
    user_id: string | undefined;
    name: string | undefined;
    email: string | undefined;
    message: string | undefined;
    message_type: string | undefined;
  }) => {
    const { user_id, name, email, message, message_type } = message_DATA;

    if (!user_id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID missing when sending contact message 🔴",
      };
    }
    if (!name) {
      SET_error("Please provide a name");
      return {
        success: false,
        msg: "🔴 Name missing for rewarding friend with vocabs 🔴",
      };
    }
    if (!email) {
      SET_error("Please provide an email");
      return {
        success: false,
        msg: "🔴 Email missing for rewarding friend with vocabs 🔴",
      };
    }
    if (!message) {
      SET_error("Please provide a message");
      return {
        success: false,
        msg: "🔴 Message missing for rewarding friend with vocabs 🔴",
      };
    }
    if (!message_type) {
      SET_error("Please choose a message type");
      return {
        success: false,
        msg: "🔴 Message type missing for rewarding friend with vocabs 🔴",
      };
    }

    SET_loading(true);

    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .insert([
          {
            user_id,
            name,
            email,
            message,
            message_type,
          },
        ])
        .select();

      if (error) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Something went wrong when sending contact message 🔴: ${error.message}`,
        };
      }
      return {
        success: true,
        sent_MESSAGE: data,
        msg: "",
      };
    } catch (error: any) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: `🔴 Something went wrong when sending contact message: 🔴 ${error}`,
      };
    } finally {
      SET_loading(false);
    }
  };

  return { SEND_contactMessage, loading, error: _error, RESET_error };
}

function ReceivedMessage_BLOCK({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Styled_TEXT style={{ textDecorationLine: "underline" }}>
        {label || "INSERT LABEL"}
      </Styled_TEXT>
      <Styled_TEXT>{text || "INSERT TEXT"}</Styled_TEXT>
    </View>
  );
}
