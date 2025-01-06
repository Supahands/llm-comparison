export type Message = {
  id?: number;
  prompt: string;
  response1: string;
  response2: string;
  choice?: string;
  responseTime1?: string;
  responseTime2?: string;
};

export type ConfigRequest = {
  system_prompt: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  json_format: boolean;
};

export type MessageRequest = {
  message: string;
  model: string;
  config: ConfigRequest;
};
