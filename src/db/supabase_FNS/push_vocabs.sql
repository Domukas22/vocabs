
-- takes in changes: jsonb

DECLARE
    new_vocab jsonb;
    updated_vocab jsonb;
BEGIN
    -- Create vocabs
    FOR new_vocab IN
        SELECT jsonb_array_elements((changes->'vocabs'->'created'))
    LOOP
        PERFORM create_vocab(
            (new_vocab->>'id')::uuid,
            (new_vocab->>'list_id')::uuid,
            (new_vocab->>'difficulty')::int,
            (new_vocab->>'description'),
            (new_vocab->>'trs')::jsonb,
            (new_vocab->>'lang_ids'),
            (new_vocab->>'searchable'),
            epoch_to_timestamp(new_vocab->>'created_at'),
            epoch_to_timestamp(new_vocab->>'updated_at'),
            epoch_to_timestamp(new_vocab->>'deleted_at')
        );
    END LOOP;

    -- Delete vocabs
    WITH deleted_vocabs AS (
        SELECT jsonb_array_elements_text(changes->'vocabs'->'deleted')::uuid AS deleted
    )
    DELETE FROM vocabs
    WHERE vocabs.id IN (SELECT deleted FROM deleted_vocabs);

    -- Update vocabs
    WITH updated_vocabs AS (
        SELECT jsonb_array_elements((changes->'vocabs'->'updated')) AS updated
    )
    UPDATE vocabs
    SET 
        list_id = (updated->>'list_id')::uuid,  -- Update list_id if necessary
        difficulty = (updated->>'difficulty')::int,
        description = (updated->>'description'),
        trs = (updated->>'trs')::jsonb,  -- Ensure this is JSONB
        lang_ids = (updated->>'lang_ids'),
        searchable = (updated->>'searchable'),
        updated_at = now()  -- Or use epoch_to_timestamp if needed
    FROM updated_vocabs
    WHERE vocabs.id = (updated->>'id')::uuid;

END;
