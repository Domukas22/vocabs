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
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "user_id" },
    lists: { type: "has_many", foreignKey: "user_id" },
    notifications: { type: "has_many", foreignKey: "user_id" },
    payments: { type: "has_many", foreignKey: "user_id" },
  };

  @children("vocabs") vocabs!: Vocab_MODEL[];
  @children("lists") lists!: List_MODEL[];
  @children("notifications") notifications!: Notifications_MODEL[];
  @children("payments") payments!: Payments_MODEL[];

  @text("username") username!: string;
  @text("email") email!: string;
  @field("max_vocabs") max_vocabs!: number;
  @text("preferred_lang_id") preferred_lang_id!: string;

  @field("list_submit_attempt_count") list_submit_attempt_count!: number;
  @field("accepted_list_submit_count") accepted_list_submit_count!: number;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;

  @lazy totalList_COUNT = this.lists
    .extend(Q.where("deleted_at", Q.eq(null)))
    .observeCount();
  @lazy totalVocab_COUNT = this.vocabs
    .extend(Q.where("deleted_at", Q.eq(null)))
    .observeCount();
  @lazy markedVocab_COUNT = this.vocabs
    .extend(Q.where("is_marked", true), Q.where("deleted_at", Q.eq(null)))
    .observeCount();
  @lazy deletedVocab_COUNT = this.vocabs
    .extend(Q.where("deleted_at", Q.notEq(null)))
    .observeCount();
  @lazy unreadNotification_COUNT = this.notifications
    .extend(Q.where("is_read", false))
    .observeCount();
}
// ===================================================================================
export class List_MODEL extends Model {
  static table = "lists";
  static associations: Associations = {
    vocabs: { type: "has_many", foreignKey: "list_id" },
    users: { type: "belongs_to", key: "user_id" },
    original_creators: { type: "belongs_to", key: "user_id" },
  };
  @children("vocabs") vocabs!: Vocab_MODEL[];

  /////////////////////////////////////////////////////////////////
  // Becasue we don't really need to fetch lists by users,
  // we provide simple text strings instead of WatermelonDB relations
  @relation("users", "user_id") user!: List_MODEL;
  @relation("users", "original_creator_id") original_creator!: List_MODEL;

  /////////////////////////////////////////////////////////////////

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

  // @writer async addComment(body, author) {
  //   const newComment = await this.collections.get('comments').create(comment => {
  //     comment.post.set(this)
  //     comment.author.set(author)
  //     comment.body = body
  //   })
  //   return newComment
  // }

  @writer async SUBMIT_forPublishing(val: boolean) {
    await this.update((vocab) => {
      vocab.is_submitted_for_publish = val;
    });
  }

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;

  @lazy diff_1 = this.vocabs.extend(Q.where("difficulty", 1)).observeCount();
  @lazy diff_2 = this.vocabs.extend(Q.where("difficulty", 2)).observeCount();
  @lazy diff_3 = this.vocabs.extend(Q.where("difficulty", 3)).observeCount();
  @lazy vocab_COUNT = this.vocabs.observeCount();
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
export class Vocab_MODEL extends Model {
  static table = "vocabs";
  static associations: Associations = {
    lists: { type: "belongs_to", key: "list_id" },
    users: { type: "belongs_to", key: "user_id" },
  };

  @relation("lists", "list_id") list!: List_MODEL;
  @relation("users", "user_id") user!: List_MODEL;
  // @text("list_id") list_id!: string | undefined;
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

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
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
  @readonly @date("deleted_at") deleted_at!: number;
}
export class Notifications_MODEL extends Model {
  static table = "notifications";

  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL;

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
  @readonly @date("deleted_at") deleted_at!: number;
}

export class Payments_MODEL extends Model {
  static table = "payments";

  static associations: Associations = {
    user: { type: "belongs_to", key: "user_id" },
  };

  @immutableRelation("users", "user_id") user!: User_MODEL;

  @text("item") item!: string;
  @text("amount") amount!: number;
  @text("payment_method") payment_method!: string;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @readonly @date("deleted_at") deleted_at!: number;
}
