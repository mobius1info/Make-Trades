import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string") {
      return new Response(
        JSON.stringify({ exists: false, error: "missing_username" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const clean = username.replace(/^@/, "").trim().toLowerCase();

    if (!/^[a-z][a-z0-9_]{3,30}[a-z0-9]$/i.test(clean) || clean.length < 5) {
      return new Response(
        JSON.stringify({ exists: false, error: "invalid_format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const res = await fetch(`https://t.me/${clean}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });

    const html = await res.text();

    const hasProfile =
      html.includes("tgme_page_photo") ||
      html.includes("tgme_action_button_new") ||
      html.includes('og:title');

    const isNotFound =
      html.includes("tgme_page_error") ||
      html.includes("If you have <strong>Telegram</strong>");

    const exists = hasProfile && !isNotFound;

    return new Response(
      JSON.stringify({ exists }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch {
    return new Response(
      JSON.stringify({ exists: false, error: "check_failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
