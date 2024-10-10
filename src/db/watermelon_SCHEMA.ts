import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "users",
      columns: [
        { name: "email", type: "string" },
        { name: "is_premium", type: "boolean" },
        { name: "is_admin", type: "boolean" },
        { name: "payment_date", type: "string" },
        { name: "payment_amount", type: "number" },
        { name: "payment_type", type: "string" },
        { name: "app_lang_id", type: "string" }, // Storing language ids like 'en' or 'de'
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "lists",
      columns: [
        { name: "user_id", type: "string", isIndexed: true }, // Reference to the user
        { name: "name", type: "string" },
        { name: "default_LANGS", type: "string" }, // Array of language ids stored as stringified JSON
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "vocabs",
      columns: [
        { name: "list_id", type: "string", isIndexed: true }, // Reference to the list
        { name: "user_id", type: "string", isIndexed: true }, // Reference to the user
        { name: "difficulty", type: "number", isOptional: true },
        { name: "description", type: "string", isOptional: true },
        { name: "image", type: "string", isOptional: true },
        { name: "is_public", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "translations",
      columns: [
        { name: "vocab_id", type: "string", isIndexed: true }, // Reference to vocab
        { name: "user_id", type: "string", isIndexed: true }, // Reference to user
        { name: "lang_id", type: "string", isIndexed: true }, // Reference to the language
        { name: "text", type: "string" },
        { name: "highlights", type: "string", isOptional: true }, // Store highlights as stringified JSON array
        { name: "is_public", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),

    tableSchema({
      name: "languages",
      columns: [
        { name: "image_url", type: "string" },
        { name: "lang_in_en", type: "string" },
        { name: "lang_in_de", type: "string" },
        { name: "country_in_en", type: "string" },
        { name: "country_in_de", type: "string" },
        { name: "translation_example", type: "string" },
        { name: "translation_example_highlights", type: "string" }, // Store as stringified JSON array of numbers
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "deleted_at", type: "number" },
      ],
    }),
  ],
});
