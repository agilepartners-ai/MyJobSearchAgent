// Supabase Edge Function: AI Enhancement
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { resume_text, job_description, resume_json, model = 'gpt-4o' } = await req.json()

    if (!job_description) {
      return new Response(
        JSON.stringify({ error: 'Job description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert resume JSON to text if provided
    let resumeText = resume_text || ''
    if (resume_json && !resume_text) {
      resumeText = JSON.stringify(resume_json)
    }

    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Resume text or JSON is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are an expert resume optimization AI assistant. Analyze the resume against the job description and provide comprehensive optimization recommendations.
    Respond with valid JSON containing:
    {
      "match_score": number (0-100),
      "analysis": {
        "strengths": ["array"],
        "gaps": ["array"],
        "suggestions": ["array"],
        "keyword_analysis": {
          "missing_keywords": ["array"],
          "present_keywords": ["array"],
          "keyword_density_score": number (0-100)
        },
        "section_recommendations": {
          "skills": "string",
          "experience": "string",
          "education": "string"
        }
      },
      "enhancements": {
        "enhanced_summary": "string",
        "enhanced_skills": ["array"],
        "enhanced_experience_bullets": ["array"],
        "cover_letter_outline": {
          "opening": "string",
          "body": "string",
          "closing": "string"
        },
        "detailed_resume_sections": {
          "professional_summary": "string",
          "technical_skills": ["array"],
          "soft_skills": ["array"],
          "experience": [{"company": "string", "position": "string", ...}],
          "education": [{"institution": "string", "degree": "string", ...}],
          "projects": [{"name": "string", "description": "string", ...}],
          "certifications": [{"name": "string", ...}],
          "awards": [{"title": "string", ...}],
          "volunteer_work": [{"organization": "string", ...}],
          "publications": [{"title": "string", ...}]
        },
        "detailed_cover_letter": {
          "opening_paragraph": "string",
          "body_paragraph": "string",
          "closing_paragraph": "string"
        }
      }
    }`

    const userPrompt = `Job Description:\n${job_description}\n\nResume:\n${resumeText}\n\nProvide comprehensive analysis and optimization.`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 6000,
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
    const aiResults = JSON.parse(openaiData.choices[0]?.message?.content || '{}')

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          match_score: aiResults.match_score || 0,
          strengths: aiResults.analysis?.strengths || [],
          gaps: aiResults.analysis?.gaps || [],
          suggestions: aiResults.analysis?.suggestions || [],
          keyword_analysis: aiResults.analysis?.keyword_analysis || {},
          section_recommendations: aiResults.analysis?.section_recommendations || {}
        },
        enhancements: aiResults.enhancements || {},
        metadata: {
          model_used: model,
          model_type: 'OpenAI',
          timestamp: new Date().toISOString(),
          resume_sections_analyzed: ['summary', 'experience', 'skills', 'education']
        },
        file_id: `enhance_${Date.now()}`
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

