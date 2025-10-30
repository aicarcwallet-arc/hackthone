import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidationRequest {
  submission_id: string;
  user_id: string;
  word: string;
  typed_word: string;
  accuracy_score: number;
  typing_speed_wpm: number;
  base_reward: number;
  difficulty: string;
}

interface OpenAIValidationResponse {
  accuracy_score: number;
  ai_validation_score: number;
  cognitive_score: number;
  is_intentional_error: boolean;
  analysis: string;
}

function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function calculateBasicAccuracy(word: string, typedWord: string): number {
  if (word === typedWord) return 100;

  const distance = calculateLevenshteinDistance(word.toLowerCase(), typedWord.toLowerCase());
  const maxLength = Math.max(word.length, typedWord.length);
  const accuracy = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, Math.min(100, accuracy));
}

async function validateWithOpenAI(
  word: string,
  typedWord: string,
  typingSpeed: number,
  difficulty: string
): Promise<OpenAIValidationResponse> {
  const openAIKey = Deno.env.get('OPENAI_API_KEY');

  if (!openAIKey) {
    const basicAccuracy = calculateBasicAccuracy(word, typedWord);
    return {
      accuracy_score: basicAccuracy,
      ai_validation_score: basicAccuracy >= 95 ? 100 : basicAccuracy >= 85 ? 90 : 80,
      cognitive_score: Math.min(100, (basicAccuracy * 0.5) + (Math.min(typingSpeed / 60, 1) * 30)),
      is_intentional_error: false,
      analysis: 'Basic validation (no AI key)',
    };
  }

  try {
    const prompt = `You are an AI validator for a blockchain vocabulary game. Analyze this word submission:

Target Word: "${word}"
Typed Word: "${typedWord}"
Typing Speed: ${typingSpeed} WPM
Difficulty: ${difficulty}

Provide a JSON response with:
1. accuracy_score (0-100): How accurately the word was typed
2. ai_validation_score (0-100): Overall AI validation confidence
3. cognitive_score (0-100): Cognitive skill assessment (consider speed, accuracy, difficulty)
4. is_intentional_error (boolean): Whether errors seem deliberate/gaming the system
5. analysis (string): Brief explanation

Consider:
- Typo patterns (keyboard proximity, common mistakes)
- Speed vs accuracy balance
- Word difficulty
- Potential cheating patterns

Respond ONLY with valid JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a precise word validation AI that responds only in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    let jsonContent = content;
    if (content.startsWith('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }

    const validation = JSON.parse(jsonContent);

    return {
      accuracy_score: Math.max(0, Math.min(100, validation.accuracy_score || 0)),
      ai_validation_score: Math.max(0, Math.min(100, validation.ai_validation_score || 0)),
      cognitive_score: Math.max(0, Math.min(100, validation.cognitive_score || 0)),
      is_intentional_error: validation.is_intentional_error || false,
      analysis: validation.analysis || 'AI validation complete',
    };
  } catch (error) {
    console.error('OpenAI validation error:', error);
    const basicAccuracy = calculateBasicAccuracy(word, typedWord);
    return {
      accuracy_score: basicAccuracy,
      ai_validation_score: basicAccuracy >= 95 ? 100 : basicAccuracy >= 85 ? 90 : 80,
      cognitive_score: Math.min(100, (basicAccuracy * 0.5) + (Math.min(typingSpeed / 60, 1) * 30)),
      is_intentional_error: false,
      analysis: 'Fallback to basic validation',
    };
  }
}

function calculateAICReward(
  baseReward: number,
  accuracy: number,
  cognitiveScore: number,
  aiValidationScore: number,
  isIntentionalError: boolean
): number {
  if (accuracy < 80 || isIntentionalError) return 0;

  const accuracyMultiplier = accuracy / 100;
  const cognitiveMultiplier = cognitiveScore / 100;
  const aiMultiplier = aiValidationScore / 100;

  const finalReward = baseReward * accuracyMultiplier * cognitiveMultiplier * aiMultiplier;

  return Math.round(Math.max(100, Math.min(500, finalReward)));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestData: ValidationRequest = await req.json();
    const {
      submission_id,
      user_id,
      word,
      typed_word,
      typing_speed_wpm,
      base_reward,
      difficulty,
    } = requestData;

    const aiValidation = await validateWithOpenAI(
      word,
      typed_word,
      typing_speed_wpm,
      difficulty
    );

    const aicReward = calculateAICReward(
      base_reward,
      aiValidation.accuracy_score,
      aiValidation.cognitive_score,
      aiValidation.ai_validation_score,
      aiValidation.is_intentional_error
    );

    const validationStatus = aiValidation.accuracy_score >= 80 && !aiValidation.is_intentional_error
      ? 'validated'
      : 'rejected';

    const { error: updateError } = await supabaseClient
      .from('word_submissions')
      .update({
        accuracy_score: aiValidation.accuracy_score,
        validation_status: validationStatus,
        aic_reward: aicReward,
        ai_validation_score: aiValidation.ai_validation_score,
        cognitive_score: aiValidation.cognitive_score,
        validated_at: new Date().toISOString(),
      })
      .eq('id', submission_id);

    if (updateError) throw updateError;

    if (validationStatus === 'validated') {
      // Get current user totals
      const { data: userData } = await supabaseClient
        .from('users')
        .select('total_words_submitted, total_aic_earned')
        .eq('id', user_id)
        .single();

      const currentWords = userData?.total_words_submitted || 0;
      const currentEarned = parseFloat(userData?.total_aic_earned || '0');

      // Update with incremented values
      const { error: userUpdateError } = await supabaseClient
        .from('users')
        .update({
          total_words_submitted: currentWords + 1,
          total_aic_earned: currentEarned + aicReward,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user_id);

      if (userUpdateError) console.error('User update error:', userUpdateError);

      const { error: txError } = await supabaseClient
        .from('token_transactions')
        .insert({
          user_id: user_id,
          submission_id: submission_id,
          transaction_type: 'reward',
          amount: aicReward,
          from_token: 'SYSTEM',
          to_token: 'AIC',
          status: 'pending',
          chain_id: 5042002,
        });

      if (txError) console.error('Transaction error:', txError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        validation_status: validationStatus,
        accuracy_score: aiValidation.accuracy_score,
        ai_validation_score: aiValidation.ai_validation_score,
        cognitive_score: aiValidation.cognitive_score,
        aic_reward: aicReward,
        ai_analysis: aiValidation.analysis,
        message: validationStatus === 'validated'
          ? `Congratulations! You earned ${aicReward} AIC tokens! ${aiValidation.analysis}`
          : aiValidation.is_intentional_error
            ? 'Intentional errors detected. No rewards issued.'
            : 'Word validation failed. Try again with better accuracy.',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Validation failed',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});