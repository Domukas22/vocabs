//
//
//

import Btn from "@/src/components/Btn/Btn";

import Header from "@/src/components/Header/Header";
import {
  ICON_arrow,
  ICON_dropdownArrow,
  ICON_X,
} from "@/src/components/icons/icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Language_MODEL,
  List_MODEL,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";

import TrInput_BLOCK from "./components/TrInput_BLOCK/TrInput_BLOCK";

import TrHighlights_MODAL from "./components/TrHighlights_MODAL/TrHighlights_MODAL";

import { USE_langs } from "@/src/context/Langs_CONTEXT";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";

import USE_myVocabActions from "../../hooks/USE_myVocabActions";

import DifficultyInput_BLOCK from "./components/DifficultyInput_BLOCK/DifficultyInput_BLOCK";

import DescriptionInput_BLOCK from "./components/DescriptionInput_BLOCK/DescriptionInput_BLOCK";
import ChosenLangs_BLOCK from "../../../../components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";

import { useTranslation } from "react-i18next";

import Block from "@/src/components/Block/Block";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import HANLDE_modalLangsAndTrs from "@/src/utils/HANLDE_modalLangsAndTrs";
import POPULATE_vocabValues from "../Vocab/utils/POPULATE_vocabValues";
import REMOVE_modalLangAndTr from "@/src/utils/REMOVE_modalLangAndTr";
import USE_myVocabValues from "../../hooks/USE_myVocabValues";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import Label from "@/src/components/Label/Label";

import CLEAR_vocabValues from "../Vocab/utils/CLEAR_vocabValues";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import Footer from "@/src/components/Footer/Footer";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import USE_createVocab from "../../hooks/USE_createVocab";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { MyColors } from "@/src/constants/MyColors";
import DeleteVocab_MODAL from "../DeleteVocab_MODAL/DeleteVocab_MODAL";
import My_TOAST from "@/src/components/My_TOAST/My_TOAST";

// TODO ==> We need separate create and update vocab modals
// perhaps even separate ones for private/public

interface ManageVocabModal_PROPS {
  open: boolean;
  TOGGLE_modal: () => void;
  vocab: Vocab_MODEL | undefined;
  selected_LIST: List_MODEL | null | undefined;
  SET_vocabs: React.Dispatch<React.SetStateAction<Vocab_MODEL[]>>;
  HIGHLIGHT_vocab: (id: string) => void;
  is_public?: boolean;
}

export default function Vocab_MODAL(props: ManageVocabModal_PROPS) {
  const {
    open,
    TOGGLE_modal: TOGGLE_vocabModal,
    vocab,
    selected_LIST,
    SET_vocabs,
    HIGHLIGHT_vocab,
    is_public = false,
  } = props;
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user }: { user: User_MODEL } = USE_auth();

  const toast = useToast();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "selectedLangs", initialValue: false },
    { name: "selectedList", initialValue: false },
    { name: "trText", initialValue: false },
    { name: "trHighlights", initialValue: false },
    { name: "delete", initialValue: false },
    { name: "addToPublic", initialValue: false },
  ]);

  const { z_CREATE_publicVocab } = USE_zustand();

  const {
    CREATE_vocab: CREATE_publicVocab,
    IS_creatingVocab: IS_CreatingPublicVocab,
  } = USE_createVocab();

  async function CREATE_public() {
    const new_VOCAB = await CREATE_publicVocab({
      user_id: null,
      list_id: null,
      difficulty: 3,
      image: vocab?.image,
      description: vocab?.description,
      translations: vocab?.translations,
      is_public: true,
      IS_admin: user.is_admin,
    });

    if (new_VOCAB.success) {
      z_CREATE_publicVocab(new_VOCAB.data);
      // SET_vocabs((prev) => [new_VOCAB.data, ...prev]);
      TOGGLE_vocabModal();
      HIGHLIGHT_vocab(new_VOCAB.data.id);
      toast.show(t("notifications.publicVocabCreated"), {
        type: "green",
        duration: 5000,
      });
    }
  }

  const {
    modal_TRs,
    modal_IMG,
    modal_DESC,
    modal_LIST,
    modal_DIFF,
    modal_LANGS,
    SET_modalTRs,
    SET_modalImg,
    SET_modalDesc,
    SET_modalList,
    SET_modalDiff,
    SET_modalLangs,
  } = USE_myVocabValues(selected_LIST);

  const {
    create,
    update,

    delete_V,
    IS_creatingVocab,
    IS_updatingVocab,

    IS_deletingVocab,
  } = USE_myVocabActions({
    user,
    vocab,
    modalValues: {
      modal_TRs,
      modal_IMG,
      modal_DESC,
      modal_LIST,
      modal_DIFF,
      modal_LANGS,
    },
    TOGGLE_vocabModal,
    SET_vocabs,
    HIGHLIGHT_vocab,
    is_public,
  });

  const POPULATE_modal = useCallback(() => {
    POPULATE_vocabValues({
      vocab,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalList,
        SET_modalDiff,
        SET_modalLangs,
      },
      languages,
      selected_LIST,
    });
  }, [vocab, selected_LIST]);
  const CLEAR_modal = useCallback(() => {
    CLEAR_vocabValues({
      languages,
      selected_LIST,
      set_FNs: {
        SET_modalTRs,
        SET_modalImg,
        SET_modalDesc,
        SET_modalList,
        SET_modalDiff,
        SET_modalLangs,
      },
    });
  }, [vocab, selected_LIST]);

  const HANLDE_langs = useCallback(
    (new_LANGS: Language_MODEL[]) =>
      HANLDE_modalLangsAndTrs({
        new_LANGS,
        modal_TRs,
        SET_modalLangs,
        SET_modalTRs,
      }),
    [modal_LANGS]
  );
  const REMOVE_lang = useCallback(
    (targetLang_ID: string) =>
      REMOVE_modalLangAndTr({
        targetLang_ID,
        modal_LANGS,
        SET_modalLangs,
        SET_modalTRs,
      }),
    [modal_LANGS]
  );

  const [target_LANG, SET_targetLang] = useState<Language_MODEL | undefined>(
    undefined
  );

  useEffect(() => {
    if (open) {
      POPULATE_modal();
    } else {
      CLEAR_modal();
      TOGGLE_modal("selectedLangs", false);
      TOGGLE_modal("selectedList", false);
      TOGGLE_modal("trText", false);
      TOGGLE_modal("trHighlights", false);
      TOGGLE_modal("delete", false);
    }
    // TODO ==> Close every other modal inside when this triggers
    // in irder to do that, we need to chagen teh TOGGLE_modal("xx"), to SET method in order to define false
  }, [open]);

  const [SHOW_deleteVocabModal, SET_deleteVocabModal] = useState(false);
  const [toDeleteVocab_ID, SET_toDeleteVocab] = useState<string | undefined>();
  const PREPARE_vocabDelete = () => {
    SET_toDeleteVocab(vocab?.id);
    SET_deleteVocabModal(true);
    console.log();
  };

  return (
    <Big_MODAL {...{ open }}>
      <View style={{ zIndex: 1, flex: 1 }}>
        <Header
          title={
            vocab ? t("modal.vocab.headerEdit") : t("modal.vocab.headerCreate")
          }
          big={true}
          btnRight={
            <View style={{ gap: 8, flexDirection: "row" }}>
              {!is_public && user.is_admin && vocab && (
                <Btn
                  iconLeft={<ICON_arrow direction="right" color="green" />}
                  style={{ borderRadius: 100 }}
                  type="seethrough"
                  onPress={() => {
                    if (user.is_admin) TOGGLE_modal("addToPublic");
                  }}
                />
              )}

              <Btn
                type="seethrough"
                iconLeft={<ICON_X big={true} rotate={true} />}
                onPress={() =>
                  !IS_creatingVocab &&
                  !IS_updatingVocab &&
                  !IS_deletingVocab &&
                  TOGGLE_vocabModal()
                }
                style={{ borderRadius: 100 }}
              />
            </View>
          }
        />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          extraScrollHeight={0}
          enableResetScrollToCoords={false}
        >
          {/* <ScrollView keyboardShouldPersistTaps="always"> */}
          {/* ------------------------------ INPUTS ------------------------------  */}

          <ChosenLangs_BLOCK
            label={t("label.chosenLangs")}
            langs={modal_LANGS}
            toggle={() => TOGGLE_modal("selectedLangs")}
            {...{ REMOVE_lang }}
          />
          {modal_TRs?.map((tr) => (
            <TrInput_BLOCK
              key={`TrInputBlock/${tr.lang_id}`}
              {...{
                languages,
                tr,
                modal_DIFF,
                SET_targetLang,
                TOGGLE_modal,
                target_LANG,
                SET_modalTRs,
              }}
            />
          ))}
          <DescriptionInput_BLOCK {...{ modal_DESC, SET_modalDesc }} />
          {!is_public && (
            <DifficultyInput_BLOCK {...{ modal_DIFF, SET_modalDiff }} />
          )}

          {!is_public && (
            <Block>
              <Label>{t("label.chosenList")}</Label>
              <Btn
                text={modal_LIST?.name || ""}
                iconRight={<ICON_dropdownArrow />}
                onPress={() => TOGGLE_modal("selectedList")}
                type="simple"
                style={{ flex: 1 }}
                text_STYLES={{ flex: 1 }}
              />
            </Block>
          )}
          {vocab && (
            <Dropdown_BLOCK toggleBtn_TEXT={t("btn.dangerZone")}>
              <Btn
                type="delete"
                text={t("btn.deleteVocab")}
                // onPress={() => TOGGLE_modal("delete")}
                onPress={() => PREPARE_vocabDelete(vocab?.id)}
              />
            </Dropdown_BLOCK>
          )}
          {/* {!is_public && user.is_admin && vocab && (
          <Block>
            <Btn
              text={!IS_updatingVocab ? t("btn.addVocabToPublic") : ""}
              onPress={() => {
                if (user.is_admin) TOGGLE_modal("addToPublic");
              }}
              text_STYLES={{ color: MyColors.text_green }}
              style={{ flex: 1 }}
            />
          </Block>
        )} */}
          {/* -------------------------------------------------------------------------  */}
          {/* When creating, the buttons are visible when scrolled to the bottom */}
          {/* </ScrollView> */}
        </KeyboardAwareScrollView>

        {!vocab && (
          <Footer
            btnLeft={
              <Btn
                text={t("btn.cancel")}
                onPress={TOGGLE_vocabModal}
                type="simple"
              />
            }
            btnRight={
              <Btn
                text={!IS_creatingVocab ? t("btn.createButtonAction") : ""}
                iconRight={
                  IS_creatingVocab && <ActivityIndicator color={"black"} />
                }
                onPress={() => {
                  if (!IS_creatingVocab) create();
                }}
                stayPressed={IS_creatingVocab}
                type="action"
                style={[
                  { flex: 1 },
                  is_public &&
                    user.is_admin && { backgroundColor: MyColors.fill_green },
                ]}
              />
            }
          />
        )}
        {vocab && (
          <Footer
            btnLeft={
              <Btn
                text={t("btn.cancel")}
                onPress={TOGGLE_vocabModal}
                type="simple"
              />
            }
            btnRight={
              <Btn
                text={!IS_updatingVocab ? t("btn.updateButtonAction") : ""}
                iconRight={
                  IS_updatingVocab && <ActivityIndicator color={"black"} />
                }
                onPress={() => {
                  if (!IS_updatingVocab) update();
                }}
                stayPressed={IS_updatingVocab}
                type="action"
                style={[
                  { flex: 1 },
                  is_public &&
                    user.is_admin && { backgroundColor: MyColors.fill_green },
                ]}
              />
            }
          />
        )}

        {/* ------------------------------ MODALS ------------------------------  */}
        <SelectMultipleLanguages_MODAL
          open={modal_STATES.selectedLangs}
          TOGGLE_open={() => TOGGLE_modal("selectedLangs")}
          active_LANGS={modal_LANGS}
          SUBMIT_langs={(langs: Language_MODEL[]) => {
            HANLDE_langs(langs);
            TOGGLE_modal("selectedLangs");
          }}
          {...{ languages, HANLDE_langs }}
        />

        <TrHighlights_MODAL
          open={modal_STATES.trHighlights}
          TOGGLE_open={() => TOGGLE_modal("trHighlights")}
          {...{ target_LANG, modal_DIFF, modal_TRs, SET_modalTRs }}
        />

        <DeleteVocab_MODAL
          IS_open={SHOW_deleteVocabModal}
          is_public={false}
          vocab_id={toDeleteVocab_ID}
          list_id={selected_LIST?.id}
          CLOSE_modal={() => SET_deleteVocabModal(false)}
          RESET_targetVocab={() => SET_toDeleteVocab(undefined)}
          REMOVE_fromPrintedVocabs={(id: string) =>
            SET_vocabs((prev) => prev.filter((v) => v.id !== id))
          }
        />

        {user.is_admin && (
          <Confirmation_MODAL
            open={modal_STATES.addToPublic && !!vocab && user?.is_admin}
            toggle={() => !IS_creatingVocab && TOGGLE_modal("addToPublic")}
            title={t("header.addToPublic")}
            action={() => {
              if (!IS_CreatingPublicVocab) CREATE_public();
            }}
            IS_inAction={IS_CreatingPublicVocab}
            actionBtnText={t("btn.confirmMakeVocabPublic")}
          />
        )}

        {!is_public && (
          <SelectMyList_MODAL
            open={modal_STATES.selectedList}
            title="Saved vocab to list"
            submit_ACTION={(target_LIST: List_MODEL) => {
              SET_modalList(target_LIST);
              TOGGLE_modal("selectedList");
            }}
            cancel_ACTION={() => {
              TOGGLE_modal("selectedList");
            }}
            IS_inAction={IS_creatingVocab}
            current_LIST={modal_LIST}
          />
        )}
      </View>
    </Big_MODAL>
  );
}
