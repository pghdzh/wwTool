import axios from "axios";

const API_KEY1 = "sk-NEsqpDwo1GmhgOBhB522566aF0704d1c8e0d7dD065FeB273"; // 将此替换为你的实际API密钥
const API_KEY = "sk-X43SqF6LL5tdCGPeD2C2E217570d449b8aFb4dF00b2a2cC6";
const openaiApi = axios.create({
  baseURL: " https://xiaoai.plus/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY1}`,
  },
});


interface ChatMsg {
  id: number;
  sender: string; // 谁说的（你 or 某角色）
  text: string;
}

// 每个角色信息结构
interface Role {
  name: string;
  systemPrompt: string;
}

// 限制上下文条数
const MAX_HISTORY_MESSAGES = 20;

// 群聊主函数：每个角色独立回复
export async function getMultiRoleReplies(
  input: string,
  history: ChatMsg[],
  roles: Role[]
): Promise<{ name: string; reply: string }[]> {
  const baseMessages = history.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
    role: "user",
    content: `${msg.sender}：${msg.text}`,
  }));


  const results = await Promise.all(
    roles.map(async (role) => {
      try {
        const response = await openaiApi.post("/chat/completions", {
          // model: "gpt-4o",
          model: "gpt-3.5-turbo", // 或者使用 'gpt-4' 取决于你的访问权限
          messages: [
            { role: "system", content: role.systemPrompt },
            ...baseMessages,
          ],
        });

        const content = response.data.choices[0].message.content;
        return { name: role.name, reply: content };
      } catch (error) {
        console.error(`角色 ${role.name} 回复失败`, error);
        return { name: role.name, reply: "……（未能成功回复）" };
      }
    })
  );

  return results;
}
