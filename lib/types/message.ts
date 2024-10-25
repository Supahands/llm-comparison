export type Message = {
  id: number;
  prompt: string;
  responseA: string;
  responseB: string;
};

export type MessageRequest = {
  message: string;
  model: string
}