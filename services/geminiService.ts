import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WorkoutPlanResponse } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkoutPlan = async (profile: UserProfile): Promise<WorkoutPlanResponse> => {
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    Atue como um Fisioterapeuta experiente, Personal Trainer de elite e Nutricionista Desportivo.
    
    Crie um **PLANO MENSAL (30 DIAS)** detalhado para o seguinte perfil:
    - Idade: ${profile.age} anos
    - Altura: ${profile.height} cm
    - Peso Atual: ${profile.weight} kg
    ${profile.targetWeight ? `- Meta de Peso: ${profile.targetWeight} kg` : ''}
    ${profile.timeline ? `- Prazo Final (Meta): ${profile.timeline}` : ''}
    - Objetivo: ${profile.goal}
    - Frequência de Treino: ${profile.frequency} dias por semana
    - LOCAL DE TREINO: ${profile.location === 'home' ? 'EM CASA' : 'GINÁSIO'}
    - CONDIÇÃO MÉDICA: ${profile.conditions}
    
    IDIOMA E REGIONALISMO OBRIGATÓRIO:
    Escreva EXCLUSIVAMENTE em **PORTUGUÊS DE PORTUGAL (pt-PT)**.
    - Use "Pequeno-almoço" em vez de "Café da manhã".
    - Use "Ginásio" em vez de "Academia".
    - Use "Autocarro" em vez de "Ônibus" (se aplicável).
    - Use a construção gramatical correta de Portugal (ex: "a sua dieta", "o seu treino").
    
    ESTRATÉGIA DE LONGO PRAZO:
    O utilizador quer saber se deve manter este plano por 15 ou 30 dias. Com base no peso dele (${profile.weight}kg) e altura (${profile.height}cm), defina a duração ideal deste ciclo antes de mudar os estímulos.
    
    ESTRUTURA DO TREINO (PERIODIZAÇÃO):
    Divida o treino em 2 FASES para cobrir o mês:
    - Fase 1 (Semanas 1-2): Adaptação neuromuscular e técnica.
    - Fase 2 (Semanas 3-4): Progressão de carga/intensidade (mesmos exercícios ou variações mais difíceis).
    
    DIRETRIZES DE TREINO:
    1. Segurança Cervical TOTAL: Sem carga axial na cabeça/pescoço.
    2. Dica Visual: Para cada exercício, dê uma descrição visual simples para gerar uma imagem mental (e.g., "Imagine sentar numa cadeira").
    
    ESTRUTURA NUTRICIONAL (CICLO SEMANAL):
    Em vez de um dia genérico, crie um **CICLO DE 7 DIAS** de refeições variadas para ele não enjoar durante o mês.
    As refeições devem ser: Pequeno-almoço, Almoço, Lanche, Jantar, Ceia (opcional).
    
    Retorne JSON estrito.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          planName: { type: Type.STRING },
          planDurationAdvice: { 
            type: Type.STRING, 
            description: "Explain if he should keep this for 15 or 30 days and why based on his stats. PT-PT language." 
          },
          description: { type: Type.STRING },
          phases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phaseName: { type: Type.STRING, description: "e.g., Fase 1 (Semana 1-2)" },
                description: { type: Type.STRING, description: "Focus of this phase" },
                schedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      exercises: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING },
                            sets: { type: Type.STRING },
                            reps: { type: Type.STRING },
                            safetyNote: { type: Type.STRING },
                            visualCue: { type: Type.STRING },
                          },
                          required: ["name", "sets", "reps", "safetyNote", "visualCue"],
                        },
                      },
                    },
                    required: ["day", "focus", "exercises"],
                  },
                },
              },
              required: ["phaseName", "description", "schedule"],
            },
          },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              dailyCalories: { type: Type.NUMBER },
              macros: {
                type: Type.OBJECT,
                properties: {
                  protein: { type: Type.STRING },
                  carbs: { type: Type.STRING },
                  fats: { type: Type.STRING },
                },
                required: ["protein", "carbs", "fats"],
              },
              hydrationGoal: { type: Type.STRING },
              antiInflammatoryTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              weeklyMenu: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayName: { type: Type.STRING, description: "e.g., Segunda-feira" },
                    meals: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          time: { type: Type.STRING, description: "e.g., Pequeno-almoço" },
                          options: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                optionName: { type: Type.STRING },
                                description: { type: Type.STRING },
                              },
                              required: ["optionName", "description"],
                            },
                          },
                        },
                        required: ["time", "options"],
                      },
                    },
                  },
                  required: ["dayName", "meals"],
                },
              },
            },
            required: ["dailyCalories", "macros", "hydrationGoal", "antiInflammatoryTips", "weeklyMenu"],
          },
        },
        required: ["planName", "planDurationAdvice", "description", "phases", "nutrition"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No content generated");
  }

  return JSON.parse(response.text) as WorkoutPlanResponse;
};

export const generateExerciseImage = async (exerciseName: string, visualCue: string): Promise<string | null> => {
  const modelId = "gemini-2.5-flash-image";
  // Prompt optimized for clear, minimalist instructional drawings
  const prompt = `Simple minimalist line drawing (stick figure style) of a person performing the exercise: "${exerciseName}". Action context: "${visualCue}". White background, black lines. Clear and easy to understand. No text in the image.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};