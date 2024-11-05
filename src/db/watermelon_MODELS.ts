import { Model, Q } from "@nozbe/watermelondb";
import {
  children,
  date,
  field,
  immutableRelation,
  json,
  lazy,
  readonly,
  relation,
  text,
  writer,
} from "@nozbe/watermelondb/decorators";
import { Associations } from "@nozbe/watermelondb/Model";
import { tr_PROPS } from "./props";
import { useToast } from "react-native-toast-notifications";
import { t } from "i18next";
import { nullValue } from "@nozbe/watermelondb/RawRecord";

const SANITIZE_langIds = (rawLangIds: string[]) => {
  return Array.isArray(rawLangIds)
    ? rawLangIds
        .filter((id) => id !== undefined) // Filter out undefined values
        .map((id) => (typeof id === "string" ? id : String(id)))
    : [];
};
const sanitizeTranslations = (rawTranslations: tr_PROPS[]) => {
  if (!Array.isArray(rawTranslations)) return [];

  return rawTranslations?.map((item) => {
    // Ensure each translation item has the correct structure
    return {
      lang_id: typeof item.lang_id === "string" ? item.lang_id : "",
      text: typeof item.text === "string" ? item.text : "",
      highlights: Array.isArray(item.highlights)
        ? item.highlights.map((highlight: number) =>
            typeof highlight === "number" ? highlight : 0
          )
        : [],
    };
  });
};
// ===================================================================================
export class User_MODEL extends Model {
  static table = "users";

  @text("username") username!: string;
  @text("email") email!: string;
  @field("max_vocabs") max_vocabs!: number;
  @text("preferred_lang_id") preferred_lang_id!: string;

  @field("list_submit_attempt_count") list_submit_attempt_count!: number;
  @field("accepted_list_submit_count") accepted_list_submit_count!: number;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;

  @lazy totalList_COUNT = this.collections
    .get("lists")
    .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
    .observeCount();

  @lazy totalVocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("deleted_at", Q.eq(null)), Q.where("user_id", this.id))
    .observeCount();

  @lazy markedVocab_COUNT = this.collections
    .get("vocabs")
    .query(
      Q.where("deleted_at", Q.eq(null)),
      Q.where("user_id", this.id),
      Q.where("is_marked", true)
    )
    .observeCount();

  @lazy deletedVocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("deleted_at", Q.notEq(null)))
    .observeCount();

  @lazy unreadNotification_COUNT = this.collections
    .get("notifications")
    .query(
      Q.where("deleted_at", Q.notEq(null)),
      Q.where("user_id", this.id),
      Q.where("is_read", false)
    )
    .observeCount();
}
// ===================================================================================
export class List_MODEL extends Model {
  static table = "lists";

  @text("user_id") user_id!: string;

  @text("original_creator_id") original_creator_id!: string;
  @text("name") name!: string;
  @text("description") description!: string;

  @field("is_submitted_for_publish") is_submitted_for_publish!: boolean;
  @field("was_accepted_for_publish") was_accepted_for_publish!: boolean;

  @text("type") type!: "private" | "public" | "shared" | "draft";
  @field("saved_count") saved_count!: number;

  @text("collected_lang_ids") collected_lang_ids!: string;
  @text("default_lang_ids") default_lang_ids!: string;

  @writer async RESET_allVocabsDifficulty() {
    // Get all vocabs where list_id matches this list's ID

    const vocabsToUpdate = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id))
      .fetch();

    // Prepare update for each vocab to set difficulty to 1
    const updates = vocabsToUpdate.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.difficulty = 3;
      })
    );

    // Execute all updates in a single batch
    await this.batch(...updates);
  }

  @writer async DELETE_list() {
    const vocabsToSoftDelete = await this.collections
      .get("vocabs")
      .query(Q.where("list_id", this.id))
      .fetch();

    const updates = vocabsToSoftDelete.map((vocab) =>
      vocab.prepareUpdate((v) => {
        v.deleted_at = new Date().toISOString();
        v.list_id = null;
      })
    );

    // Execute all updates in a single batch
    await this.batch(...updates);

    await this.markAsDeleted();
  }

  @writer async SUBMIT_forPublishing(val: boolean) {
    await this.update((vocab) => {
      vocab.is_submitted_for_publish = val;
    });
  }

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;

  @lazy diff_1 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 1),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy diff_2 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 2),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy diff_3 = this.collections
    .get("vocabs")
    .query(
      Q.where("difficulty", 3),
      Q.where("list_id", this.id),
      Q.where("deleted_at", Q.eq(null))
    )
    .observeCount();

  @lazy vocab_COUNT = this.collections
    .get("vocabs")
    .query(Q.where("list_id", this.id), Q.where("deleted_at", Q.eq(null)))
    .observeCount();
}
// ===================================================================================
export class Vocab_MODEL extends Model {
  static table = "vocabs";

  @text("user_id") user_id!: string | null;
  @text("list_id") list_id!: string | null;

  @field("difficulty") difficulty!: 1 | 2 | 3;
  @text("description") description!: string | undefined;
  @json("trs", sanitizeTranslations) trs!: tr_PROPS[] | undefined;
  @text("lang_ids") lang_ids!: string | undefined;
  @text("searchable") searchable!: string | undefined;
  @field("is_marked") is_marked!: boolean | undefined;

  @writer async TOGGLE_marked() {
    await this.update((vocab) => {
      vocab.is_marked = !this.is_marked;
    });
  }
  @writer async EDIT_difficulty(diff: 1 | 2 | 3) {
    await this.update((vocab) => {
      vocab.difficulty = diff;
    });
  }

  @writer async DELETE_vocab(type: "soft" | "permanent") {
    if (type === "soft") {
      await this.update((vocab) => {
        vocab.deleted_at = new Date().toISOString();
        vocab.list_id = null;
      });
    }
    if (type === "permanent") {
      await this.markAsDeleted();
    }
  }

  @writer async REVIVE_vocab(list_id: string) {
    await this.update((vocab) => {
      vocab.deleted_at = nullValue;

      vocab.list_id = list_id;
      vocab.description = "Eyoooooooooo";
    });
  }

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
// ===================================================================================
export class ListAccess_MODEL extends Model {
  static table = "list_access";

  @text("owner_id") owner_id!: string;
  @text("participant_id") participant_id!: string;
  @text("list_id") list_id!: string;

  @readonly @date("created_at") createdAt!: number;
}

// ===================================================================================
export class Language_MODEL extends Model {
  static table = "languages";

  @text("lang_id") lang_id!: string;
  @text("lang_in_en") lang_in_en!: string;

  @text("lang_in_de") lang_in_de!: string;
  @text("country_in_en") country_in_en!: string;
  @text("country_in_de") country_in_de!: string;

  @text("translation_example") translation_example!: string;

  @json("translation_example_highlights", SANITIZE_langIds)
  translation_example_highlights!: string[] | undefined;
  @text("description_example") description_example!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
export class Notifications_MODEL extends Model {
  static table = "notifications";

  @text("user_id") user_id!: string;
  @text("title") title!: string;
  @text("paragraph") paragraph!: string;
  @text("type") type!:
    | "vocabsAdded"
    | "list_publication_accepted"
    | "list_published"
    | "changedUsername"
    | "changedEmail"
    | "changedPassword"
    | "warning";
  @field("is_read") is_read!: boolean;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}

export class Payments_MODEL extends Model {
  static table = "payments";

  @text("user_id") user_id!: string;
  @text("item") item!: string;
  @text("amount") amount!: number;
  @text("payment_method") payment_method!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
}
