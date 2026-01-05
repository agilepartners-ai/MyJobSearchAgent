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

    // Ensure all required fields are properly initialized with defaults
    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          match_score: aiResults.match_score || 0,
          strengths: Array.isArray(aiResults.analysis?.strengths) ? aiResults.analysis.strengths : [],
          gaps: Array.isArray(aiResults.analysis?.gaps) ? aiResults.analysis.gaps : [],
          suggestions: Array.isArray(aiResults.analysis?.suggestions) ? aiResults.analysis.suggestions : [],
          keyword_analysis: {
            missing_keywords: Array.isArray(aiResults.analysis?.keyword_analysis?.missing_keywords)
              ? aiResults.analysis.keyword_analysis.missing_keywords : [],
            present_keywords: Array.isArray(aiResults.analysis?.keyword_analysis?.present_keywords)
              ? aiResults.analysis.keyword_analysis.present_keywords : [],
            keyword_density_score: aiResults.analysis?.keyword_analysis?.keyword_density_score || 0
          },
          section_recommendations: {
            skills: aiResults.analysis?.section_recommendations?.skills || '',
            experience: aiResults.analysis?.section_recommendations?.experience || '',
            education: aiResults.analysis?.section_recommendations?.education || ''
          }
        },
        enhancements: {
          enhanced_summary: aiResults.enhancements?.enhanced_summary || '',
          enhanced_skills: Array.isArray(aiResults.enhancements?.enhanced_skills)
            ? aiResults.enhancements.enhanced_skills : [],
          enhanced_experience_bullets: Array.isArray(aiResults.enhancements?.enhanced_experience_bullets)
            ? aiResults.enhancements.enhanced_experience_bullets : [],
          cover_letter_outline: {
            opening: aiResults.enhancements?.cover_letter_outline?.opening || '',
            body: aiResults.enhancements?.cover_letter_outline?.body || '',
            closing: aiResults.enhancements?.cover_letter_outline?.closing || ''
          },
          detailed_resume_sections: aiResults.enhancements?.detailed_resume_sections || {},
          detailed_cover_letter: aiResults.enhancements?.detailed_cover_letter || {}
        },
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
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

