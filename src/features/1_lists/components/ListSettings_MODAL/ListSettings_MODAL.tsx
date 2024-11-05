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
import SelectLangs_MODAL from "@/src/features/4_languages/components/SelectMultipleLanguages_MODAL/SelectLangs_MODAL";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, View } from "react-native";

import RenameList_MODAL from "../RenameList_MODAL/RenameList_MODAL";
import Footer from "@/src/components/Footer/Footer";
import Dropdown_BLOCK from "@/src/components/Dropdown_BLOCK/Dropdown_BLOCK";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import DeleteList_MODAL from "../DeleteList_MODAL";

import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";

import { MyColors } from "@/src/constants/MyColors";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import USE_updateListDefaultLangs from "../../hooks/USE_updateListDefaultLangs";
import Label from "@/src/components/Label/Label";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_shareList from "../../hooks/USE_shareList";
import USE_publishList from "../../hooks/USE_publishList";
import { PUSH_changes, sync } from "@/src/db/sync";
import SelectUsers_MODAL from "@/src/features/5_users/components/SelectUsers_MODAL/SelectUsers_MODAL";
import { supabase } from "@/src/lib/supabase";
import db, { Lists_DB } from "@/src/db";
import USE_zustand from "@/src/zustand";
import USE_fetchListAccesses from "@/src/features/5_users/hooks/USE_fetchListAccesses";
import USE_supabaseUsers from "@/src/features/5_users/hooks/USE_supabaseUsers";

interface ListSettingsModal_PROPS {
  selected_LIST: List_MODEL | undefined;
  open: boolean;
  TOGGLE_open: () => void;
  backToIndex: () => void;
}

export default function ListSettings_MODAL({
  open = false,
  selected_LIST,
  TOGGLE_open = () => {},
  backToIndex = () => {},
}: ListSettingsModal_PROPS) {
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const toast = useToast();
  const router = useRouter();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "deleteList" },
    { name: "selectLangs" },
    { name: "renameList" },
    { name: "listSharingInfo" },
    { name: "listPublishingInfo" },
    { name: "listSharingCancel" },
    { name: "listPublishingCancel" },
    { name: "selectUsers" },
  ]);

  const { SHARE_list, IS_sharingList } = USE_shareList();
  const { PUBLISH_list, IS_publishingList } = USE_publishList();

  const [selectedUser_IDS, SET_selectedUserIds] = useState<Set<string>>(
    new Set()
  );

  const { FETCH_accesses, ARE_accessesFetching, accessesFetch_ERROR } =
    USE_fetchListAccesses();

  const {
    users: selected_USERS,
    IS_fetching: ARE_selectedusersFetching,
    error: fetchSelectedUsers_ERROR,
    LOAD_more: LOAD_moreSelectedUsers,
    IS_loadingMore: IS_loadingMoreSelectedUsers,
    total_COUNT: totalSelectedFilteredUser_COUNT,
  } = USE_supabaseUsers({
    search: "",
    paginateBy: 9999,
    onlySelected: true,
    selected_IDS: Array.from(selectedUser_IDS),
    view: "selected",
  });

  async function SELECT_usersByListAccess() {
    const accesses = await FETCH_accesses({
      user_id: z_user?.id || "",
      list_id: selected_LIST?.id || "",
    });
    if (accesses.success && accesses.data) {
      SET_selectedUserIds(new Set(accesses.data.map((x) => x.participant_id)));
    }
  }

  useEffect(() => {
    if (open) SELECT_usersByListAccess();
  }, [open]);

  const share = async (bool: boolean) => {
    await sync("all", z_user?.id);
    SHARE_list({
      list_id: selected_LIST?.id,
      user_id: z_user?.id,
      SHOULD_share: bool,
      onSuccess: async () => {
        await sync("all", z_user?.id);
      },
    });
    // await db.write(async () => {
    //   await selected_LIST.update((list: List_MODEL) => {
    //     list.type = bool ? "shared" : "private";
    //   });
    // });
  };
  const publish = async (bool: boolean) => {
    await selected_LIST.SUBMIT_forPublishing(bool);
    await PUSH_changes();
    // await sync("all", z_user?.id);
    // await PUBLISH_list({
    //   list_id: selected_LIST?.id,
    //   user_id: z_user?.id,
    //   isSubmittedForPublish: bool,
    //   onSuccess: async (updated_LIST) => {},
    // });
  };

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

  const UPDATE_langs = (newLang_IDS: string[]) => {
    if (!newLang_IDS) return;

    UPDATE_defaultLangs({
      user_id: z_user?.id || "",
      list_id: selected_LIST?.id,
      newLang_IDS,
    });
  };

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
              {selected_LIST?.name || "NO LIST NAME PROVIDED"}
            </Styled_TEXT>
            {/* <Styled_TEXT>{user?.email || "---"}</Styled_TEXT> */}
          </View>
          <Btn text="Edit" onPress={() => TOGGLE_modal("renameList")} />
        </Block>

        <ChosenLangs_BLOCK
          label={t("label.defaultVocabLangs")}
          default_lang_ids={selected_LIST?.default_lang_ids}
          toggle={() => TOGGLE_modal("selectLangs")}
          REMOVE_lang={(targetLang_ID) => {
            if (!selected_LIST?.default_lang_ids) return;
            UPDATE_langs(
              selected_LIST?.default_lang_ids?.filter(
                (lang_id) => lang_id !== targetLang_ID
              )
            );
          }}
          error={updateDefaultLangs_ERROR}
        />

        <Block>
          <Label>
            Reset the difficulty of every vocab in this list to "Hard"
          </Label>
          <Btn
            text="Reset all vocabs"
            onPress={() => {
              (async () => {
                await selected_LIST.RESET_allVocabsDifficulty();
                toast.show("Difficulties reset", {
                  type: "green",
                  duration: 5000,
                });
              })();
            }}
          />
        </Block>
        {/* -------------------------------------------------------------------------------------------------- */}

        {selected_LIST?.type === "private" && (
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

        {selected_LIST?.type === "shared" && (
          <Block>
            <Styled_TEXT style={{ color: MyColors.text_green }}>
              This list is shared with {selected_USERS?.length || 0} people
            </Styled_TEXT>
            <SharedWithUsers_BULLETS users={selected_USERS || []} />
            <Btn
              text="Edit people list"
              style={{ flex: 1 }}
              iconRight={<ICON_arrow direction="right" />}
              text_STYLES={{
                textAlign: "left",
                flex: 1,
              }}
              onPress={() => TOGGLE_modal("selectUsers")}
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

        {!selected_LIST?.is_submitted_for_publish &&
          !selected_LIST?.was_accepted_for_publish && (
            <Block>
              <Label>Publish your list and get free vocabs</Label>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Btn
                  text={!IS_publishingList ? "Submit for publish" : ""}
                  iconRight={
                    IS_publishingList ? (
                      <ActivityIndicator color="white" />
                    ) : null
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
        {selected_LIST?.is_submitted_for_publish &&
          !selected_LIST?.was_accepted_for_publish && (
            <Block>
              <Styled_TEXT style={{ color: MyColors.text_yellow }}>
                This list is being reviewed for publishing, which shouldn't take
                longer than a few days. You'll be notified as soon as the list
                is accepted or rejected.
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
        {!selected_LIST?.is_submitted_for_publish &&
          selected_LIST?.was_accepted_for_publish && (
            <Block>
              <Styled_TEXT style={{ color: MyColors.text_green }}>
                Great Work! You have received 57 vocabs for publishing this
                list.
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
            onPress={() => TOGGLE_modal("deleteList")}
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
      <SelectLangs_MODAL
        open={modal_STATES.selectLangs}
        TOGGLE_open={() => TOGGLE_modal("selectLangs")}
        lang_ids={selected_LIST?.default_lang_ids}
        SUBMIT_langIds={(lang_ids: string[]) => {
          UPDATE_langs(lang_ids);
        }}
        IS_inAction={IS_updatingDefaultLangs}
      />

      <RenameList_MODAL
        list_id={selected_LIST?.id}
        user_id={z_user?.id}
        current_NAME={selected_LIST?.name}
        IS_open={modal_STATES.renameList}
        CLOSE_modal={() => TOGGLE_modal("renameList")}
        onSuccess={HIGHLIGHT_modalListName}
      />

      <HowDoesSharingListWork_MODAL
        open={modal_STATES.listSharingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listSharingInfo")}
      />
      <HowDoesPublishingListWork_MODAL
        open={modal_STATES.listPublishingInfo}
        TOGGLE_modal={() => TOGGLE_modal("listPublishingInfo")}
      />

      <SelectUsers_MODAL
        open={modal_STATES.selectUsers}
        TOGGLE_open={() => TOGGLE_modal("selectUsers")}
        list_id={selected_LIST?.id}
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
        IS_open={modal_STATES.deleteList}
        list={selected_LIST}
        CLOSE_modal={() => TOGGLE_modal("deleteList")}
        onSuccess={(deleted_LIST?: List_MODEL) => {
          if (!deleted_LIST) return;
          TOGGLE_modal("deleteList");
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

export function SharedWithUsers_BULLETS({
  users = [],
}: {
  users: User_MODEL[];
}) {
  const maxPrint = 10;

  return users.length > 0 ? (
    <View
      style={{
        flexDirection: "row",
        gap: 6,
        flexWrap: "wrap",
        paddingBottom: 4,
      }}
    >
      {users.slice(0, maxPrint).map((u, index) => (
        <View
          key={u.id}
          style={{
            borderWidth: 1,
            borderColor: MyColors.border_white_005,
            backgroundColor: MyColors.btn_1,
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 50,
          }}
        >
          <Styled_TEXT>
            {index < maxPrint - 1 || users.length <= maxPrint
              ? u.username
              : `+${users.length - maxPrint}`}
          </Styled_TEXT>
        </View>
      ))}
    </View>
  ) : null;
}
