import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface PublishResult {
  success: boolean;
  publishedCount: number;
  languages: {
    [key: string]: number;
  };
  error?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, language')
      .eq('published', false)
      .lte('publish_date', new Date().toISOString())
      .order('publish_date', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    if (!posts || posts.length === 0) {
      const result: PublishResult = {
        success: true,
        publishedCount: 0,
        languages: {},
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    const postIds = posts.map(p => p.id);
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ published: true })
      .in('id', postIds);

    if (updateError) {
      throw updateError;
    }

    const languageCounts: { [key: string]: number } = {};
    posts.forEach(post => {
      languageCounts[post.language] = (languageCounts[post.language] || 0) + 1;
    });

    const result: PublishResult = {
      success: true,
      publishedCount: posts.length,
      languages: languageCounts,
    };

    console.log(`Auto-published ${posts.length} posts:`, languageCounts);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error auto-publishing posts:', error);

    const result: PublishResult = {
      success: false,
      publishedCount: 0,
      languages: {},
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return new Response(JSON.stringify(result), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
