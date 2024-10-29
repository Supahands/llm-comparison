export type Message = {
  id?: number;
  prompt: string;
  response1: string;
  response2: string;
  choice?: string;
  responseTime1?: string;
  responseTime2?: string;
};

export type MessageRequest = {
  message: string;
  model: string;
};
