//
//
//

import { tr_PROPS } from "@/src/props";
import { Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  readonly,
  text,
  json,
  writer,
} from "@nozbe/watermelondb/decorators";

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

class Vocab_MODEL extends Model {
  translations(
    translations: any,
    languages: import("./Language_MODEL").default[]
  ): import("react").SetStateAction<import("./Language_MODEL").default[]> {
    throw new Error("Method not implemented.");
  }
  static table = "vocabs";

  @text("user_id") user_id!: string | null;
  @text("list_id") list_id!: string | null;

  @field("difficulty") difficulty!: 1 | 2 | 3;
  @text("description") description!: string | undefined;
  @json("trs", sanitizeTranslations) trs!: tr_PROPS[] | undefined;
  @text("lang_ids") lang_ids!: string | undefined;
  @text("searchable") searchable!: string | undefined;
  @field("is_marked") is_marked!: boolean | undefined;

  @readonly @date("created_at") createdAt!: number;
  @readonly @date("updated_at") updatedAt!: number;
  @text("deleted_at") deleted_at!: string;
  image: SetStateAction<string>;

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
}
