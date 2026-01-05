"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>("Testing...");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    async function test() {
      const supabase = createClient();
      
      try {
        // Test connection
        const { data, error, count } = await supabase
          .from('companies')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          setStatus("❌ Connection Failed");
          setDetails(error);
        } else {
          setStatus("✅ Connection Successful");
          setDetails({ 
            message: "Database connected",
            totalCompanies: count,
            needsSeeding: count === 0
          });
        }
      } catch (err: any) {
        setStatus("❌ Exception");
        setDetails(err);
      }
    }
    
    test();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-4">{status}</h2>
          
          <div className="space-y-2">
            <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Present' : '✗ Missing'}</p>
          </div>
        </div>

        {details && (
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Details:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        {details?.needsSeeding && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="font-semibold">⚠️ Database is empty</p>
            <p className="text-sm mt-2">Run the seed-companies.sql script in your Supabase SQL Editor to populate the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
