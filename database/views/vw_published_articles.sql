-- =============================================================================
-- vw_published_articles.sql
-- View: content.vw_published_articles
-- Public-safe article listings with author, tag, and SEO fields resolved.
-- Used by public pages and SEO endpoints; never exposes draft content.
-- =============================================================================

CREATE OR REPLACE VIEW content.vw_published_articles AS
SELECT
  a.id,
  a.title,
  a.slug,
  a.summary,
  a.canonical_url,
  a.seo_title,
  a.seo_description,
  a.og_image_url,
  a.schema_org_type,
  a.publish_at,
  a.word_count,
  a.read_time_minutes,
  a.ai_assisted,
  a.tournament_id,
  a.course_id,
  a.player_id,
  a.created_at,
  a.updated_at,
  -- author fields
  au.display_name  AS author_name,
  au.slug          AS author_slug,
  au.avatar_url    AS author_avatar_url,
  -- tag array
  COALESCE(
    json_agg(
      json_build_object('id', tg.id, 'name', tg.name, 'slug', tg.slug)
      ORDER BY tg.name
    ) FILTER (WHERE tg.id IS NOT NULL),
    '[]'::json
  )                AS tags
FROM content.articles a
JOIN content.authors au ON a.author_id = au.id
LEFT JOIN content.article_tags at2 ON a.id = at2.article_id
LEFT JOIN content.tags tg          ON at2.tag_id = tg.id
WHERE a.status = 'published'
  AND (a.unpublish_at IS NULL OR a.unpublish_at > NOW())
GROUP BY
  a.id, a.title, a.slug, a.summary, a.canonical_url, a.seo_title,
  a.seo_description, a.og_image_url, a.schema_org_type, a.publish_at,
  a.word_count, a.read_time_minutes, a.ai_assisted, a.tournament_id,
  a.course_id, a.player_id, a.created_at, a.updated_at,
  au.display_name, au.slug, au.avatar_url;
