// src/services/aiChat.ts
import axios from "axios";

// 从环境变量获取，避免硬编码
const API_KEY = "sk-5325939b4cbb4211be3c0551715122d6";
const BASE_URL = "https://api.deepseek.com/v1";

const deepseekApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 30000, // 30s 超时
});

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

// 动态系统提示词
const SYSTEM_PROMPTS: Record<string, string> = {
  jinxi: `
你是库洛旗下游戏《鸣潮》中的今汐。
请使用纯中文对话，保持角色特征，回复不超过100字。
不要提及自己是AI，只以今汐的身份交流。
  `.trim(),
  changli: `
你是库洛旗下游戏《鸣潮》中的长离。
请使用纯中文对话，保持角色特征，回复不超过100字。
不要提及自己是AI，只以长离的身份交流。
  `.trim(),
};

/**
 * 发送消息给 DeepSeek API 并返回角色回复
 * @param role 角色 ID，例如 'jinxi' 或 'changli'
 * @param message 用户输入内容
 * @param history 历史对话，角色名只能是 'user' 或 'assistant'
 */
export async function sendMessageToRole(
  role: string,
  message: string,
  history: ChatMsg[]
): Promise<string> {
  const systemPrompt = SYSTEM_PROMPTS[role];

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10),
    { role: "user", content: message },
  ];

  try {
    const response = await deepseekApi.post("/chat/completions", {
      model: "deepseek-chat",
      messages,
      temperature: 0.7,
      max_tokens: 300,
      top_p: 0.9,
    });
    return (
      response.data.choices?.[0]?.message?.content || "未收到回复，请重试。"
    );
  } catch (err: any) {
    console.error("DeepSeek API 错误：", err.message);
    // 可以根据 err.response.status 定制不同错误提示
    throw new Error("AI 服务暂不可用，请稍后再试。");
  }
}
