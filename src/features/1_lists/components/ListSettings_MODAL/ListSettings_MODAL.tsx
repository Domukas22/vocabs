//
//
//

import Block from "@/src/components/Block/Block";
import ChosenLangs_BLOCK from "@/src/components/ChosenLangs_BLOCK/ChosenLangs_BLOCK";
import Btn from "@/src/components/Btn/Btn";
import Header from "@/src/components/Header/Header";
import {
  ICON_arrow,
  ICON_questionMark,
  ICON_X,
} from "@/src/components/icons/icons";
import Big_MODAL from "@/src/components/Modals/Big_MODAL/Big_MODAL";
import SelectMultipleLanguages_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectMultipleLanguages_MODAL";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import GET_langs from "@/src/features/4_languages/utils/GET_langs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";
import USE_myListActions from "../../hooks/USE_myListActions";
import RenameList_MODAL from "../RenameList_MODAL/RenameList_MODAL";
import Footer from "@/src/components/Footer/Footer";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import DeleteList_MODAL from "../DeleteList_MODAL";
import USE_zustand from "@/src/zustand";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import UpdateList_MODAL from "../UpdateList_MODAL";
import { MyColors } from "@/src/constants/MyColors";
import { List_MODEL, Language_MODEL } from "@/src/db/watermelon_MODELS";
import USE_updateListDefaultLangs from "../../hooks/USE_updateListDefaultLangs";
import Label from "@/src/components/Label/Label";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_shareList from "../../hooks/USE_shareList";
import USE_publishList from "../../hooks/USE_publishList";

interface ListSettingsModal_PROPS {
  list: List_MODEL;
  open: boolean;
  TOGGLE_open: () => void;
  backToIndex: () => void;
  HIGHLIGHT_listName: () => void;
}

export default function ListSettings_MODAL({
  open = false,
  list,
  TOGGLE_open = () => {},
  backToIndex = () => {},
  HIGHLIGHT_listName,
}: ListSettingsModal_PROPS) {
  const { languages } = USE_langs();
  const { t } = useTranslation();
  const { user } = USE_auth();
  const { z_lists, z_DELETE_privateList, z_RENAME_privateList } = USE_zustand();
  const toast = useToast();
  const router = useRouter();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "listSharingInfo" },
    { name: "listPublishingInfo" },
    { name: "listSharingCancel" },
    { name: "listPublishingCancel" },
  ]);

  const { SHARE_list, IS_sharingList, shareList_ERROR, RESET_shareListerror } =
    USE_shareList();

  const share = (bool: boolean) => {
    SHARE_list({
      list_id: list?.id,
      user_id: user?.id,
      IS_shared: bool,
      onSuccess: () => {},
    });
  };

  const {
    PUBLISH_list,
    IS_publishingList,
    RESET_publishListError,
    publishList_ERROR,
  } = USE_publishList();

  const publish = (bool: boolean) => {
    PUBLISH_list({
      list_id: list?.id,
      user_id: user?.id,
      isSubmittedForPublish: bool,
      onSuccess: () => {},
    });
  };

  const [
    SHOW_langSeletionModal,
    TOGGLE_langSelectionModal,
    SET_langSelectionModal,
  ] = USE_toggle(false);
  const [SHOW_deleteModal, TOGGLE_deleteModal, SET_deleteModal] =
    USE_toggle(false);
  const [SHOW_renameListModal, TOGGLE_renameListModal, SET_updateListModal] =
    USE_toggle(false);

  const langs = useMemo(
    () => GET_langs({ languages, target: list?.default_lang_ids }),
    [list?.default_lang_ids]
  );

  const { IS_updatingDefaultListTRs } = USE_myListActions({
    afterDelete_ACTION: () => {
      TOGGLE_deleteModal();
      TOGGLE_open();
      backToIndex();
    },
    afterRename_ACTION: () => {
      TOGGLE_renameListModal();
      TOGGLE_open();
      HIGHLIGHT_listName();
    },
    afterDefaultTrEdit_ACTION: () => {
      SET_langSelectionModal(false);
    },
  });

  const [IS_listNameHighlighted, SET_isListNameHighlighted] = useState(false);
  const HIGHLIGHT_modalListName = () => {
    if (!IS_listNameHighlighted) {
      SET_isListNameHighlighted(true);
      setTimeout(() => {
        SET_isListNameHighlighted(false);
      }, 3000);
    }
  };

  const {
    UPDATE_defaultLangs,
    IS_updatingDefaultLangs,
    updateDefaultLangs_ERROR,
    RESET_error,
  } = USE_updateListDefaultLangs();

  const UPDATE_langs = (new_LANGS: string[]) => {
    if (!new_LANGS) return;
    UPDATE_defaultLangs({
      user_id: user?.id || "",
      list_id: list?.id,
      new_LANGS,
    });
  };

  console.log(list?.type);

  return (
    <Big_MODAL open={open}>
      <Header
        title={t("header.listSettings")}
        big={true}
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_X big={true} rotate={true} />}
            onPress={TOGGLE_open}
            style={{ borderRadius: 100 }}
          />
        }
      />
      <ScrollView>
        <Block
          row={true}
          styles={{ position: "relative", alignItems: "flex-start" }}
        >
          <View style={{ flex: 1 }}>
            <Styled_TEXT type="text_18_bold">{t("label.listName")}</Styled_TEXT>
            <Styled_TEXT
              style={{
                color: IS_listNameHighlighted
                  ? MyColors.text_green
                  : MyColors.text_white,
              }}
            >
              {list?.name || "NO LIST NAME PROVIDED"}
            </Styled_TEXT>
            {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
          </View>
          <Btn text="Edit" onPress={TOGGLE_renameListModal} />
        </Block>

        <ChosenLangs_BLOCK
          label={t("label.defaultVocabLangs")}
          langs={langs}
          toggle={TOGGLE_langSelectionModal}
          REMOVE_lang={(targetLang_ID) => {
            UPDATE_langs(
              langs.filter((l) => l.id !== targetLang_ID)?.map((x) => x.id)
            );
          }}
        />
        {/* -------------------------------------------------------------------------------------------------- */}

        {list?.type === "private" && (
          <Block>
            <Label>Share your list with chosen people</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn
                text={!IS_sharingList ? "Share list" : ""}
                iconRight={
                  IS_sharingList ? <ActivityIndicator color="white" /> : null
                }
                style={{ flex: 1 }}
                text_STYLES={{
                  textAlign: "left",
                  flex: 1,
                }}
                stayPressed={IS_sharingList}
                onPress={() => share(true)}
              />
              <Btn
                iconLeft={<ICON_questionMark />}
                onPress={() => TOGGLE_modal("listSharingInfo")}
              />
            </View>
          </Block>
        )}

        {list?.type === "shared" && (
          <Block>
            <Styled_TEXT style={{ color: MyColors.text_green }}>
              This list is shared with 14 people
            </Styled_TEXT>
            <Btn
              text="Edit people list"
              style={{ flex: 1 }}
              iconRight={<ICON_arrow direction="right" />}
              text_STYLES={{
                textAlign: "left",
                flex: 1,
              }}
            />
            <Btn
              text={!IS_sharingList ? "Unshare this list" : ""}
              iconRight={
                IS_sharingList ? (
                  <ActivityIndicator color={MyColors.icon_red} />
                ) : null
              }
              type="delete"
              stayPressed={IS_sharingList}
              text_STYLES={{ flex: 1 }}
              onPress={() => TOGGLE_modal("listSharingCancel")}
            />
          </Block>
        )}

        {/* -------------------------------------------------------------------------------------------------- */}

        {!list?.is_submitted_for_publish && !list?.has_been_submitted && (
          <Block>
            <Label>Publish your list and get free vocabs</Label>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Btn
                text={!IS_publishingList ? "Submit for publish" : ""}
                iconRight={
                  IS_publishingList ? <ActivityIndicator color="white" /> : null
                }
                style={{ flex: 1 }}
                stayPressed={IS_publishingList}
                text_STYLES={{
                  textAlign: "left",
                  flex: 1,
                }}
                onPress={() => publish(true)}
              />
              <Btn
                iconLeft={<ICON_questionMark />}
                onPress={() => TOGGLE_modal("listPublishingInfo")}
              />
            </View>
          </Block>
        )}
        {list?.is_submitted_for_publish && !list?.has_been_submitted && (
          <Block>
            <Styled_TEXT style={{ color: MyColors.text_yellow }}>
              This list is being reviewed for publishing, which shouldn't take
              longer than a few days. You'll be notified as soon as the list is
              accepted or rejected.
            </Styled_TEXT>
            <Btn
              text={!IS_publishingList ? "I changed my mind - unpublish" : ""}
              iconRight={
                IS_publishingList ? (
                  <ActivityIndicator color={MyColors.icon_red} />
                ) : null
              }
              type="delete"
              text_STYLES={{ flex: 1 }}
              stayPressed={IS_publishingList}
              onPress={() => TOGGLE_modal("listPublishingCancel")}
            />
          </Block>
        )}
        {!list?.is_submitted_for_publish && list?.has_been_submitted && (
          <Block>
            <Styled_TEXT style={{ color: MyColors.text_green }}>
              Great Work! You have received 57 vocabs for publishing this list.
            </Styled_TEXT>
          </Block>
        )}
        {/* -------------------------------------------------------------------------------------------------- */}

        <Dropdown_BLOCK
          toggleBtn_TEXT={t("btn.dangerZone")}
          label="Danger danger"
        >
          <Btn
            type="delete"
            text={t("btn.deleteList")}
            onPress={TOGGLE_deleteModal}
          />
        </Dropdown_BLOCK>
      </ScrollView>
      <Footer
        btnLeft={
          <Btn
            text={t("btn.done")}
            onPress={TOGGLE_open}
            type="simple"
            style={{ flex: 1 }}
          />
        }
      />

      {/* ------------------------------ MODALS ------------------------------  */}
      <SelectMultipleLanguages_MODAL
        open={SHOW_langSeletionModal}
        TOGGLE_open={TOGGLE_langSelectionModal}
        langs={langs}
        SUBMIT_langs={(langs: Language_MODEL[]) => {
          UPDATE_langs(langs.map((l) => l.id));
        }}
        languages={languages}
        IS_inAction={IS_updatingDefaultListTRs}
      />

      <RenameList_MODAL
        list_id={list?.id}
        user_id={user?.id}
        current_NAME={list?.name}
        IS_open={SHOW_renameListModal}
        CLOSE_modal={() => TOGGLE_renameListModal()}
        onSuccess={(updated_LIST?: List_MODEL) => {
          if (updated_LIST) {
            z_RENAME_privateList(updated_LIST);
            HIGHLIGHT_modalListName();
          }
        }}
      />

      <HowDoesSharingListWork_MODAL
        open={modal_STATES.listSharingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listSharingInfo")}
      />
      <HowDoesPublishingListWork_MODAL
        open={modal_STATES.listPublishingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listPublishingInfo")}
      />

      <Confirmation_MODAL
        open={modal_STATES.listSharingCancel}
        toggle={() => TOGGLE_modal("listSharingCancel")}
        title={t("header.cancelListSharing")}
        action={() => {
          share(false);
          TOGGLE_modal("listSharingCancel");
        }}
        actionBtnText={t("btn.confirmStop")}
      >
        <Styled_TEXT style={{ color: MyColors.text_red }}>
          The people you have selected won't be able to view your list anymore
        </Styled_TEXT>
      </Confirmation_MODAL>

      <Confirmation_MODAL
        open={modal_STATES.listPublishingCancel}
        toggle={() => TOGGLE_modal("listPublishingCancel")}
        title={t("header.cancelListPublishing")}
        action={() => {
          publish(false);
          TOGGLE_modal("listPublishingCancel");
        }}
        actionBtnText={t("btn.confirmListUnpublish")}
      >
        <Styled_TEXT style={{ color: MyColors.text_red }}>
          Your list will not be reviewed for publishing and you will not receive
          any new vocabs
        </Styled_TEXT>
      </Confirmation_MODAL>

      <DeleteList_MODAL
        user_id={user?.id}
        IS_open={SHOW_deleteModal}
        list_id={list?.id}
        CLOSE_modal={() => SET_deleteModal(false)}
        onSuccess={(deleted_LIST?: List_MODEL) => {
          if (!deleted_LIST) return;
          SET_deleteModal(false);
          z_DELETE_privateList(deleted_LIST?.id);
          toast.show(
            t("notifications.listDeletedPre") +
              `"${deleted_LIST?.name}"` +
              t("notifications.listDeletedPost"),
            {
              type: "green",
              duration: 5000,
            }
          );
          router.back();
        }}
      />
    </Big_MODAL>
  );
}

function HowDoesSharingListWork_MODAL({
  open = false,
  TOGGLE_modal = () => {},
}: {
  open: boolean;
  TOGGLE_modal: () => void;
}) {
  return (
    <Big_MODAL {...{ open }}>
      <Header
        btnRight={
          <Btn
            iconLeft={<ICON_X big rotate />}
            style={{ borderRadius: 100 }}
            onPress={TOGGLE_modal}
          />
        }
        title="Share a list"
        big
      />
    </Big_MODAL>
  );
}
function HowDoesPublishingListWork_MODAL({
  open = false,
  TOGGLE_modal = () => {},
}: {
  open: boolean;
  TOGGLE_modal: () => void;
}) {
  return (
    <Big_MODAL {...{ open }}>
      <Header
        btnRight={
          <Btn
            iconLeft={<ICON_X big rotate />}
            style={{ borderRadius: 100 }}
            onPress={TOGGLE_modal}
          />
        }
        title="Publish a list"
        big
      />
    </Big_MODAL>
  );
}
