
-- takes in schema_version: integer, migration: jsonb, last_pulled_at: bigint

DECLARE
    _ts TIMESTAMP WITH TIME ZONE;
    _vocabs JSONB;

BEGIN
    -- Convert last_pulled_at from milliseconds to timestamp
    _ts := to_timestamp(last_pulled_at / 1000);

    -- Fetch vocabs
    SELECT jsonb_build_object(
        'created', '[]'::JSONB,  -- Send an empty array for created records
        'updated',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', v.id,
                    'list_id', v.list_id,
                    'difficulty', v.difficulty,
                    'description', v.description,
                    'trs', v.trs,
                    'lang_ids', v.lang_ids,
                    'searchable', v.searchable,
                    'created_at', timestamp_to_epoch(v.created_at),
                    'updated_at', timestamp_to_epoch(v.updated_at),
                    'deleted_at', timestamp_to_epoch(v.deleted_at)
                )
            ) FILTER (WHERE v.updated_at > _ts AND v.deleted_at IS NULL),
            '[]'::JSONB
        ),
        'deleted',
        COALESCE(
            jsonb_agg(to_jsonb(v.id)) FILTER (WHERE v.deleted_at IS NOT NULL AND v.updated_at > _ts),
            '[]'::JSONB
        )
    ) INTO _vocabs
    FROM vocabs v;

    -- Return the final response JSON
    RETURN jsonb_build_object(
        'changes', jsonb_build_object('vocabs', _vocabs),
        'timestamp', timestamp_to_epoch(now())
    );
END;
