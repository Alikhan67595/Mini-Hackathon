import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, industry, tone = 'professional' } = await req.json();
    
    if (!idea || !industry) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: idea and industry' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert startup consultant and pitch writer. Generate professional, compelling startup pitch content based on the user's idea. Be creative, insightful, and strategic.`;

    const userPrompt = `Generate a complete startup pitch for this idea:
    
Startup Idea: ${idea}
Industry: ${industry}
Tone: ${tone}

Please provide the following in JSON format:
{
  "startup_name": "A catchy, memorable startup name (2-3 words)",
  "tagline": "A compelling tagline that captures the essence (5-7 words)",
  "elevator_pitch": "A concise 2-3 sentence elevator pitch",
  "problem_statement": "Clear description of the problem being solved (2-3 sentences)",
  "solution_statement": "How your solution addresses the problem (2-3 sentences)",
  "target_audience": "Detailed description of the target audience/persona",
  "unique_value_prop": "What makes this unique and valuable (2-3 sentences)",
  "landing_page_copy": "Compelling hero section copy for a website (3-4 sentences)"
}`;

    console.log('Calling Lovable AI...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_pitch",
            description: "Generate a complete startup pitch with all components",
            parameters: {
              type: "object",
              properties: {
                startup_name: { type: "string" },
                tagline: { type: "string" },
                elevator_pitch: { type: "string" },
                problem_statement: { type: "string" },
                solution_statement: { type: "string" },
                target_audience: { type: "string" },
                unique_value_prop: { type: "string" },
                landing_page_copy: { type: "string" }
              },
              required: ["startup_name", "tagline", "elevator_pitch", "problem_statement", "solution_statement", "target_audience", "unique_value_prop", "landing_page_copy"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_pitch" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to generate pitch' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pitchData = JSON.parse(toolCall.function.arguments);
    console.log('Pitch generated successfully');

    return new Response(
      JSON.stringify(pitchData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pitch function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});