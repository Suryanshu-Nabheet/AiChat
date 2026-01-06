export type AIProvider = "openrouter" | "openai" | "anthropic" | "google";

export type ModelPricing = "free" | "paid";

export interface ModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  pricing: ModelPricing;
  description?: string;
}

export interface AppSettings {
  provider: AIProvider;
  apiKey: string;
  modelId: string;
}

export const PROVIDERS: Record<
  AIProvider,
  { name: string; models: ModelConfig[] }
> = {
  openrouter: {
    name: "OpenRouter",
    models: [
      // Anthropic Models
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "openrouter",
        pricing: "paid",
        description: "Most capable model",
      },
      {
        id: "anthropic/claude-3-opus",
        name: "Claude 3 Opus",
        provider: "openrouter",
        pricing: "paid",
        description: "High intelligence",
      },
      {
        id: "anthropic/claude-3-sonnet",
        name: "Claude 3 Sonnet",
        provider: "openrouter",
        pricing: "paid",
        description: "Balanced performance",
      },
      {
        id: "anthropic/claude-3-haiku",
        name: "Claude 3 Haiku",
        provider: "openrouter",
        pricing: "paid",
        description: "Fast and efficient",
      },

      // OpenAI Models
      {
        id: "openai/gpt-4-turbo",
        name: "GPT-4 Turbo",
        provider: "openrouter",
        pricing: "paid",
        description: "Latest GPT-4",
      },
      {
        id: "openai/gpt-4",
        name: "GPT-4",
        provider: "openrouter",
        pricing: "paid",
        description: "Standard GPT-4",
      },
      {
        id: "openai/gpt-4-32k",
        name: "GPT-4 32K",
        provider: "openrouter",
        pricing: "paid",
        description: "Extended context",
      },
      {
        id: "openai/gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        provider: "openrouter",
        pricing: "paid",
        description: "Fast and affordable",
      },
      {
        id: "openai/gpt-3.5-turbo-16k",
        name: "GPT-3.5 Turbo 16K",
        provider: "openrouter",
        pricing: "paid",
        description: "Extended context",
      },

      // Google Models
      {
        id: "google/gemini-pro",
        name: "Gemini Pro",
        provider: "openrouter",
        pricing: "paid",
        description: "Google's flagship",
      },
      {
        id: "google/gemini-pro-vision",
        name: "Gemini Pro Vision",
        provider: "openrouter",
        pricing: "paid",
        description: "Multimodal model",
      },
      {
        id: "google/gemini-flash",
        name: "Gemini Flash",
        provider: "openrouter",
        pricing: "paid",
        description: "Fast responses",
      },

      // Meta Models
      {
        id: "meta-llama/llama-3-70b-instruct",
        name: "Llama 3 70B",
        provider: "openrouter",
        pricing: "free",
        description: "Open source",
      },
      {
        id: "meta-llama/llama-3-8b-instruct",
        name: "Llama 3 8B",
        provider: "openrouter",
        pricing: "free",
        description: "Lightweight",
      },
      {
        id: "meta-llama/llama-2-70b-chat",
        name: "Llama 2 70B",
        provider: "openrouter",
        pricing: "free",
        description: "Previous generation",
      },

      // Mistral Models
      {
        id: "mistralai/mistral-large",
        name: "Mistral Large",
        provider: "openrouter",
        pricing: "paid",
        description: "Top performance",
      },
      {
        id: "mistralai/mixtral-8x7b-instruct",
        name: "Mixtral 8x7B",
        provider: "openrouter",
        pricing: "free",
        description: "Mixture of experts",
      },
      {
        id: "mistralai/mistral-medium",
        name: "Mistral Medium",
        provider: "openrouter",
        pricing: "paid",
        description: "Balanced model",
      },
      {
        id: "mistralai/mistral-small",
        name: "Mistral Small",
        provider: "openrouter",
        pricing: "free",
        description: "Efficient model",
      },

      // Cohere Models
      {
        id: "cohere/command-r-plus",
        name: "Command R+",
        provider: "openrouter",
        pricing: "paid",
        description: "Advanced reasoning",
      },
      {
        id: "cohere/command-r",
        name: "Command R",
        provider: "openrouter",
        pricing: "paid",
        description: "Strong performance",
      },

      // Other Models
      {
        id: "perplexity/llama-3-sonar-large-32k-online",
        name: "Perplexity Sonar Large",
        provider: "openrouter",
        pricing: "paid",
        description: "With web search",
      },
      {
        id: "qwen/qwen-2.5-72b-instruct",
        name: "Qwen 2.5 72B",
        provider: "openrouter",
        pricing: "free",
        description: "Chinese model",
      },
      {
        id: "01-ai/yi-34b-chat",
        name: "Yi 34B Chat",
        provider: "openrouter",
        pricing: "free",
        description: "Bilingual model",
      },
      {
        id: "gpt-oss-20b",
        name: "GPT OSS 20B",
        provider: "openrouter",
        pricing: "free",
        description: "Open Source 20B",
      },
    ],
  },
  openai: {
    name: "OpenAI",
    models: [
      {
        id: "gpt-4-turbo-preview",
        name: "GPT-4 Turbo Preview",
        provider: "openai",
        pricing: "paid",
        description: "Latest preview",
      },
      {
        id: "gpt-4-turbo",
        name: "GPT-4 Turbo",
        provider: "openai",
        pricing: "paid",
        description: "Fast GPT-4",
      },
      {
        id: "gpt-4",
        name: "GPT-4",
        provider: "openai",
        pricing: "paid",
        description: "Standard GPT-4",
      },
      {
        id: "gpt-4-32k",
        name: "GPT-4 32K",
        provider: "openai",
        pricing: "paid",
        description: "Extended context",
      },
      {
        id: "gpt-3.5-turbo",
        name: "GPT-3.5 Turbo",
        provider: "openai",
        pricing: "paid",
        description: "Fast and affordable",
      },
      {
        id: "gpt-3.5-turbo-16k",
        name: "GPT-3.5 Turbo 16K",
        provider: "openai",
        pricing: "paid",
        description: "Extended context",
      },
    ],
  },
  anthropic: {
    name: "Anthropic (Claude)",
    models: [
      {
        id: "claude-3-5-sonnet-20241022",
        name: "Claude 3.5 Sonnet",
        provider: "anthropic",
        pricing: "paid",
        description: "Most capable",
      },
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        provider: "anthropic",
        pricing: "paid",
        description: "Highest intelligence",
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        provider: "anthropic",
        pricing: "paid",
        description: "Balanced performance",
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        provider: "anthropic",
        pricing: "paid",
        description: "Fast and efficient",
      },
    ],
  },
  google: {
    name: "Google (Gemini)",
    models: [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        provider: "google",
        pricing: "paid",
        description: "Flagship model",
      },
      {
        id: "gemini-pro-vision",
        name: "Gemini Pro Vision",
        provider: "google",
        pricing: "paid",
        description: "Multimodal capabilities",
      },
      {
        id: "gemini-flash",
        name: "Gemini Flash",
        provider: "google",
        pricing: "paid",
        description: "Fast responses",
      },
      {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        provider: "google",
        pricing: "paid",
        description: "Latest generation",
      },
      {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        provider: "google",
        pricing: "paid",
        description: "Fast 1.5 model",
      },
    ],
  },
};
