import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual oficial da Microkids, uma empresa de Tecnologia Educacional.
Seu público-alvo são os VENDEDORES da Microkids.
Sua função é tirar dúvidas sobre:
1. Metodologia Microkids (Robótica educacional, Maker, STEAM).
2. Proposta comercial e valores.
3. Detalhes técnicos dos kits de robótica e materiais didáticos.
4. Processos internos (prazos de entrega, contratos).

Diretrizes:
- Seja profissional, direto e encorajador.
- Use português do Brasil.
- Se não souber a resposta, sugira que o vendedor entre em contato com o gerente comercial ou verifique a seção de Documentos.
- Formate as respostas com markdown (negrito, listas) para facilitar a leitura rápida.
`;

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Using gemini-3-pro-preview for complex reasoning and better context retention
  chatSession = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncGenerator<string, void, unknown>> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
     throw new Error("Failed to initialize chat session");
  }

  try {
    const resultStream = await chatSession.sendMessageStream({ message });
    
    // Return a generator that yields text chunks
    return (async function* () {
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    })();

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw error;
  }
};