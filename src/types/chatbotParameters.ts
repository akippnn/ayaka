export interface WhoAmI {
  name: string;
  source: string;
  subject: "He" | "She" | "They";
  possessive: "His" | "Her" | "Their";
  object: "Him" | "Her" | "Them";
  history_length: number;
  personality?: string;
  mbti?: string;
  likes?: string;
}
