// Supabase Edge Function: Job Search
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
    const { jobProfile, experience, location, numPages = 1 } = await req.json()

    if (!jobProfile || !location) {
      return new Response(
        JSON.stringify({ error: 'Job profile and location are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const jsearchApiKey = Deno.env.get('JSEARCH_API_KEY')
    const jsearchApiHost = Deno.env.get('JSEARCH_API_HOST') || 'jsearch.p.rapidapi.com'

    if (!jsearchApiKey) {
      return new Response(
        JSON.stringify({ error: 'JSearch API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build query
    const state = location.includes(',') ? location.split(',').pop()?.trim() : location
    let query = `${jobProfile} jobs in ${state}`
    
    if (experience?.toLowerCase() === 'experienced') {
      query += ' senior'
    } else if (experience?.toLowerCase() === 'fresher') {
      query += ' entry level'
    }

    const searchParams = new URLSearchParams({
      query: query,
      page: '1',
      num_pages: numPages.toString(),
      country: 'us',
      date_posted: 'all'
    })

    const response = await fetch(`https://jsearch.p.rapidapi.com/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': jsearchApiHost,
        'X-RapidAPI-Key': jsearchApiKey
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return new Response(
        JSON.stringify({ error: `Job search API error: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    
    if (!data.data || !Array.isArray(data.data)) {
      return new Response(
        JSON.stringify({
          message: 'No jobs found',
          jobs: [],
          search_criteria: { job_profile: jobProfile, experience, location },
          success: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const jobs = data.data.map((jobData: any) => {
      const city = jobData.job_city || ''
      const jobState = jobData.job_state || ''
      const country = jobData.job_country || ''
      const locationStr = [city, jobState, country].filter(Boolean).join(', ') || 
                         jobData.job_location || 
                         jobData.employer_location || 
                         'N/A'

      return {
        job_title: jobData.job_title || 'N/A',
        employer_name: jobData.employer_name || 'N/A',
        job_city: jobData.job_city || '',
        job_state: jobData.job_state || '',
        job_country: jobData.job_country || '',
        job_is_remote: jobData.job_is_remote || false,
        job_apply_link: jobData.job_apply_link || jobData.job_url || '',
        job_employment_type: jobData.job_employment_type || 'N/A',
        job_posted_at_datetime_utc: jobData.job_posted_at_datetime_utc || '',
        job_salary_currency: jobData.job_salary_currency || '',
        job_min_salary: jobData.job_min_salary || undefined,
        job_max_salary: jobData.job_max_salary || undefined,
        job_salary_period: jobData.job_salary_period || '',
        job_experience_in_place_of_education: jobData.job_experience_in_place_of_education || false,
        job_description: jobData.job_description || 'No description available',
        job_url: jobData.job_url || jobData.job_apply_link || '',
        location: locationStr
      }
    }).filter((job: any) => job.job_title !== 'N/A' && job.employer_name !== 'N/A')

    return new Response(
      JSON.stringify({
        message: `Found ${jobs.length} jobs for ${jobProfile} in ${location}`,
        jobs,
        search_criteria: { job_profile: jobProfile, experience, location },
        success: true
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

