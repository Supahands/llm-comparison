export type Message = {
  id?: number;
  prompt: string;
  responseA: string;
  responseB: string;
  prefA?: boolean;
  prefB?: boolean;
};
