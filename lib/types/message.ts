
export type Message = {
  id?: number;
  prompt: string;
  question_tags: string[];
  response1: string;
  response2: string;
  choice?: string;
  responseTime1?: string;
  responseTime2?: string;
  image_url: string[];
  explain_choice?: string;
  ideal_response?: string;
};

export type ConfigRequest = {
  system_prompt: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  json_format: boolean;
};

export type MessageRequest = {
  message: string | undefined;
  images?: string[];
  model: string;
  config: ConfigRequest;
};
