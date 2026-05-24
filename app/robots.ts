/**
 * /robots.txt — file-based generator (Next.js 16 metadata API).
 *
 * Drop 122: original cutover. Drop 167: AI-bot explicit allow rules
 * for GPTBot / ChatGPT-User / ClaudeBot / anthropic-ai / PerplexityBot
 * / Google-Extended / Amazonbot / Applebot-Extended / CCBot — these
 * crawlers respect robots.txt and an explicit `Allow: /` rule maximises
 * citation likelihood in AI search results. Default UA rules unchanged.
 *
 * Allows everything for everyone, blocks the buyer-gated routes from being
 * indexed (they require auth and would just be 401/redirect for crawlers).
 */
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/buyer',          // authenticated-only buyer dashboard
          '/login',          // sign-in form, not an indexable surface
          '/auth/',          // Supabase callbacks
          '/api/',            // server-only routes
          '/__qa-',           // QA pages (defensive — never indexed)
        ],
      },
      // ── AI search crawlers — explicit allow for maximum AI-citation surface ──
      {
        userAgent: [
          'GPTBot',           // OpenAI (ChatGPT training)
          'ChatGPT-User',     // OpenAI (live ChatGPT fetches)
          'OAI-SearchBot',    // OpenAI SearchGPT
          'ClaudeBot',        // Anthropic Claude indexing
          'anthropic-ai',     // Anthropic alt UA
          'Claude-Web',       // Anthropic web fetch
          'PerplexityBot',    // Perplexity AI search
          'Perplexity-User',  // Perplexity live fetch
          'Google-Extended',  // Google Gemini training opt-in
          'Amazonbot',        // Amazon Alexa / AI
          'Applebot-Extended', // Apple Intelligence
          'CCBot',            // Common Crawl (widely used for AI training)
          'cohere-ai',        // Cohere
          'YouBot',           // You.com
          'Diffbot',          // Diffbot AI extraction
          'Bytespider',       // ByteDance / TikTok AI
        ],
        allow: '/',
        disallow: ['/buyer', '/login', '/auth/', '/api/', '/__qa-'],
      },
    ],
    sitemap: 'https://egyptglobe.com/sitemap.xml',
    host: 'https://egyptglobe.com',
  }
}
