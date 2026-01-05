// Supabase Edge Function: Resume Optimization
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, resume_text, job_description } = await req.json()

    if (!user_id || !resume_text || !job_description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, resume_text, job_description' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI API for resume optimization
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume optimization AI assistant specializing in ATS optimization and job matching. 
            Analyze the resume against the job description and provide comprehensive optimization recommendations.
            Respond with valid JSON containing: match_score (0-100), strengths (array), gaps (array), 
            suggestions (array), keyword_analysis (missing_keywords, present_keywords, keyword_density_score),
            and tweaked_resume_text (optimized resume text).`
          },
          {
            role: 'user',
            content: `Job Description:\n${job_description}\n\nResume:\n${resume_text}\n\nAnalyze and optimize this resume for the job description.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const analysis = JSON.parse(openaiData.choices[0]?.message?.content || '{}')

    // Return formatted response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          django_user_id: 0,
          user_id: user_id,
          user_created: false,
          analysis: {
            match_score: analysis.match_score || 0,
            strengths: analysis.strengths || [],
            gaps: analysis.gaps || [],
            suggestions: analysis.suggestions || [],
            tweaked_resume_text: analysis.tweaked_resume_text || resume_text,
          },
          optimization_successful: true,
          score_threshold_met: (analysis.match_score || 0) >= 70,
          tweaked_text: analysis.tweaked_resume_text || null,
          explanation: 'Resume has been analyzed and optimized using AI.',
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

