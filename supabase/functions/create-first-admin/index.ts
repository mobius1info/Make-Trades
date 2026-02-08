import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "admin@maketrades.info";
    const adminPassword = "Admin123456!";

    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from("admin_users")
      .select("id")
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Администратор уже существует. Эта функция работает только для создания первого администратора.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (authError) {
      throw authError;
    }

    const { error: insertError } = await supabaseAdmin
      .from("admin_users")
      .insert([
        {
          id: authData.user.id,
          email: adminEmail,
          role: "admin",
        },
      ]);

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Первый администратор успешно создан!",
        credentials: {
          email: adminEmail,
          password: adminPassword,
          adminPanelUrl: "/admin.html",
        },
        note: "ВАЖНО: Сохраните эти данные и смените пароль после первого входа!",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
