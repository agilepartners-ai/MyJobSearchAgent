// Supabase Edge Function: PDF Generation
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Import pdf-lib - try esm.sh first, fallback handling in generatePDF
let PDFDocument: any
let StandardFonts: any
let rgb: any

// Dynamic import to handle potential import failures
async function loadPDFLib() {
  try {
    // Try esm.sh first (works well with Deno)
    const pdfLib = await import("https://esm.sh/pdf-lib@1.17.1")
    PDFDocument = pdfLib.PDFDocument
    StandardFonts = pdfLib.StandardFonts
    rgb = pdfLib.rgb
    return true
  } catch (e) {
    console.error('Failed to import pdf-lib from esm.sh:', e)
    try {
      // Fallback to skypack.dev
      const pdfLib = await import("https://cdn.skypack.dev/pdf-lib@1.17.1?dts")
      PDFDocument = pdfLib.PDFDocument
      StandardFonts = pdfLib.StandardFonts
      rgb = pdfLib.rgb
      return true
    } catch (e2) {
      console.error('Failed to import pdf-lib from skypack.dev:', e2)
      throw new Error(`Failed to load PDF library from both sources: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to create a basic PDF from resume data
async function generatePDF(resumeData: any, jobDescription: string, template: string): Promise<Uint8Array> {
  try {
    // Ensure PDF library is loaded
    if (!PDFDocument || !StandardFonts) {
      await loadPDFLib()
    }
    
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // US Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
  let yPosition = 750
  const margin = 50
  const lineHeight = 14
  const sectionSpacing = 20
  
  // Helper to add text with word wrapping
  const addText = (text: string, x: number, y: number, size: number, isBold: boolean = false) => {
    const maxWidth = 512
    const words = text.split(' ')
    let line = ''
    let currentY = y
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word
      const width = (isBold ? boldFont : font).widthOfTextAtSize(testLine, size)
      
      if (width > maxWidth && line) {
        page.drawText(line, {
          x,
          y: currentY,
          size,
          font: isBold ? boldFont : font,
        })
        line = word
        currentY -= lineHeight
      } else {
        line = testLine
      }
    }
    
    if (line) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font: isBold ? boldFont : font,
      })
      currentY -= lineHeight
    }
    
    return currentY
  }
  
  // Header: Personal Information
  if (resumeData?.personal) {
    const personal = resumeData.personal
    yPosition = addText(personal.name || 'Resume', margin, yPosition, 20, true)
    yPosition -= 5
    
    const contactInfo = [
      personal.email,
      personal.phone,
      personal.location
    ].filter(Boolean).join(' | ')
    
    if (contactInfo) {
      yPosition = addText(contactInfo, margin, yPosition, 10)
    }
    yPosition -= sectionSpacing
  }
  
  // Professional Summary
  if (resumeData?.personal?.summary) {
    yPosition = addText('PROFESSIONAL SUMMARY', margin, yPosition, 12, true)
    yPosition -= 5
    yPosition = addText(resumeData.personal.summary, margin, yPosition, 10)
    yPosition -= sectionSpacing
  }
  
  // Experience
  if (resumeData?.experience && Array.isArray(resumeData.experience)) {
    yPosition = addText('EXPERIENCE', margin, yPosition, 12, true)
    yPosition -= 5
    
    for (const exp of resumeData.experience) {
      const title = `${exp.position || ''} - ${exp.company || ''}`
      const dates = exp.is_current 
        ? `${exp.start_date || ''} - Present`
        : `${exp.start_date || ''} - ${exp.end_date || ''}`
      
      yPosition = addText(title, margin, yPosition, 11, true)
      yPosition = addText(dates, margin, yPosition, 9)
      yPosition -= 5
      
      if (exp.description) {
        yPosition = addText(exp.description, margin, yPosition, 10)
      }
      
      if (exp.achievements && Array.isArray(exp.achievements)) {
        for (const achievement of exp.achievements) {
          yPosition = addText(`• ${achievement}`, margin + 10, yPosition, 10)
        }
      }
      
      yPosition -= sectionSpacing
      
      // Add new page if needed
      if (yPosition < 100) {
        const newPage = pdfDoc.addPage([612, 792])
        yPosition = 750
      }
    }
  }
  
  // Education
  if (resumeData?.education && Array.isArray(resumeData.education)) {
    yPosition = addText('EDUCATION', margin, yPosition, 12, true)
    yPosition -= 5
    
    for (const edu of resumeData.education) {
      const eduText = `${edu.degree || ''}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''} - ${edu.institution || ''}`
      yPosition = addText(eduText, margin, yPosition, 10)
      
      if (edu.graduation_date) {
        yPosition = addText(edu.graduation_date, margin, yPosition, 9)
      }
      
      yPosition -= sectionSpacing
    }
  }
  
  // Skills
  if (resumeData?.skills) {
    yPosition = addText('SKILLS', margin, yPosition, 12, true)
    yPosition -= 5
    
    const skillsList = [
      ...(resumeData.skills.technical || []),
      ...(resumeData.skills.soft || [])
    ]
    
    if (skillsList.length > 0) {
      yPosition = addText(skillsList.join(', '), margin, yPosition, 10)
    }
  }
  
  return await pdfDoc.save()
  } catch (pdfError) {
    console.error('Error in generatePDF function:', pdfError)
    throw new Error(`PDF generation failed: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`)
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Pre-load PDF library to catch import errors early
  try {
    await loadPDFLib()
  } catch (importError) {
    console.error('Failed to load PDF library:', importError)
    return new Response(
      JSON.stringify({ 
        error: 'PDF library failed to load. Please check the function logs for details.',
        details: importError instanceof Error ? importError.message : String(importError)
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { 
      file_id, 
      job_description, 
      template = 'Modern',
      resume_data,
      cover_letter_data,
      personal_info,
      company_info 
    } = await req.json()

    if (!file_id || !job_description) {
      return new Response(
        JSON.stringify({ error: 'File ID and job description are required' }),
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user ID from request headers (from auth token)
    const authHeader = req.headers.get('Authorization')
    let userId: string | null = null
    
    if (authHeader) {
      try {
        // Extract user from JWT token (simplified - in production, verify the token properly)
        const token = authHeader.replace('Bearer ', '')
        // For now, we'll fetch the resume by file_id and let RLS handle authorization
      } catch (e) {
        console.error('Error parsing auth header:', e)
      }
    }

    // If resume_data is provided, use it directly
    // Otherwise, fetch from Supabase database using file_id
    let resumeData = resume_data
    
    if (!resumeData) {
      // Fetch resume data from Supabase
      const { data: resumeRecord, error: fetchError } = await supabase
        .from('resumes')
        .select('resume_data')
        .eq('id', file_id)
        .single()

      if (fetchError || !resumeRecord) {
        return new Response(
          JSON.stringify({ error: `Resume not found: ${fetchError?.message || 'Unknown error'}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      resumeData = resumeRecord.resume_data
    }
    
    if (!resumeData) {
      return new Response(
        JSON.stringify({ error: 'Resume data is required for PDF generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate PDF - wrap in try-catch to provide better error messages
    let pdfBytes: Uint8Array
    try {
      pdfBytes = await generatePDF(resumeData, job_description, template)
      
      if (!pdfBytes || pdfBytes.length === 0) {
        throw new Error('Generated PDF is empty')
      }
    } catch (pdfGenError) {
      console.error('PDF generation failed:', pdfGenError)
      const errorMsg = pdfGenError instanceof Error ? pdfGenError.message : String(pdfGenError)
      
      // Check if it's an import/module error
      if (errorMsg.includes('Cannot find module') || errorMsg.includes('Failed to fetch') || errorMsg.includes('import')) {
        throw new Error(`PDF library import failed. This may indicate a compatibility issue with the Deno runtime. Error: ${errorMsg}`)
      }
      
      throw pdfGenError
    }
    
    // Return PDF with correct content-type
    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${file_id}.pdf"`
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details for debugging
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    })
    
    return new Response(
      JSON.stringify({ 
        error: `PDF generation failed: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

