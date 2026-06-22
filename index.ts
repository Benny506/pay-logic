/**
 * Pay-Logic: Bulk Email Relay (Supabase Edge Function)
 * 
 * This function is a "dumb" relay for MailerSend. It receives 
 * pre-formatted HTML templates from the client and sends them 
 * to the specified recipients.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILERSEND_API_KEY = Deno.env.get("MAILERSEND_API_KEY")

interface EmailRequest {
  to: string
  subject: string
  html: string
  attachments?: any[]
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { emails }: { emails: EmailRequest[] } = await req.json()

    if (!emails || !Array.isArray(emails)) {
      throw new Error('Invalid request payload: Expected an "emails" array.')
    }

    console.log(`Processing ${emails.length} email requests...`)

    // Map each email request to a MailerSend API call
    const emailPromises = emails.map(async (item) => {
      try {
        const response = await fetch('https://api.mailersend.com/v1/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MAILERSEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: { 
              email: "no-reply@controlgenesis.com", 
              name: "PayLogic Admin" 
            },
            to: [{ email: item.to }],
            subject: item.subject,
            html: item.html,
            attachments: item.attachments,
          }),
        })
        
        return { to: item.to, ok: response.ok, status: response.status }
      } catch (err) {
        return { to: item.to, ok: false, error: err.message }
      }
    })

    const results = await Promise.all(emailPromises)
    const successCount = results.filter(r => r.ok).length

    return new Response(
      JSON.stringify({ 
        message: `Relay complete. Sent ${successCount} of ${emails.length} emails.`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error("Edge Function Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
