import { supabase } from "@/lib/supabase";

export default async function SupabaseTest() {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  return (
    <main style={{ padding: "40px" }}>
      <h1>Ultimate Realty - Supabase Test</h1>

      {error ? (
        <div>
          <h2>❌ Connection Error</h2>
          <pre>{error.message}</pre>
        </div>
      ) : (
        <div>
          <h2>✅ Supabase Connected</h2>

          <p>
            Properties found: {data?.length ?? 0}
          </p>

          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}