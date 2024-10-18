
-- takes in schema_version: integer, migration: jsonb, last_pulled_at: bigint

DECLARE
    _ts TIMESTAMP WITH TIME ZONE;
    _lists JSONB;

BEGIN
    -- Convert last_pulled_at from milliseconds to timestamp
    _ts := to_timestamp(last_pulled_at / 1000);

    -- Fetch lists
    SELECT jsonb_build_object(
        'created', '[]'::JSONB,  -- Send an empty array for created records
        'updated',
        COALESCE(
            jsonb_agg(
                jsonb_build_object(
                    'id', l.id,
                    'user_id', l.user_id,
                    'original_creator_id', l.original_creator_id,
                    'name', l.name,
                    'description', l.description,
                    'default_lang_ids', l.default_lang_ids,
                    'is_submitted_for_publish', l.is_submitted_for_publish,
                    'was_accepted_for_publish', l.was_accepted_for_publish,
                    'type', l.type,
                    'created_at', timestamp_to_epoch(l.created_at),
                    'updated_at', timestamp_to_epoch(l.updated_at)
                )
            ) FILTER (WHERE l.updated_at > _ts AND l.deleted_at IS NULL),
            '[]'::JSONB
        ),
        'deleted',
        COALESCE(
            jsonb_agg(to_jsonb(l.id)) FILTER (WHERE l.deleted_at IS NOT NULL AND l.updated_at > _ts),
            '[]'::JSONB
        )
    ) INTO _lists
    FROM lists l;

    -- Return the final response JSON
    RETURN jsonb_build_object(
        'changes', jsonb_build_object('lists', _lists),
        'timestamp', timestamp_to_epoch(now())
    );
END;
