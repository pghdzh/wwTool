<template>
  <div class="ai-chat-container">
    <!-- 角色选择 -->
    <div class="role-selector">
      <button v-for="role in roles" :key="role.id" :class="['role-btn', { active: selectedRole === role.id }]"
        @click="selectRole(role.id)">
        <img :src="role.avatar" :alt="role.name" />
        <span>{{ role.name }}</span>
      </button>
    </div>

    <!-- 聊天内容 -->
    <div class="chat-window" ref="chatWindow">
      <transition-group name="message-fade" tag="div">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.sender]">
          <img v-if="msg.sender === 'ai'" :src="currentAvatar" class="avatar" />
          <div class="bubble">
            <p>{{ msg.text }}</p>
            <span class="timestamp">{{ formatTime(msg.time) }}</span>
          </div>
          <img v-if="msg.sender === 'user'" :src="userAvatar" class="avatar user-avatar" />
        </div>
      </transition-group>
      <div v-if="loading" class="loading-indicator">
        对方正在输入
        <span class="dots">
          <span>.</span><span>.</span><span>.</span>
        </span>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="input-area">
      <div class="input-row">
        <textarea v-model="inputText" @keyup.enter.exact.prevent="sendMessage" placeholder="输入消息，按 Enter 发送"></textarea>
        <div class="actions-vertical">
          <button class="btn-clear" @click="clearChat">清空</button>
          <button class="btn-send" @click="sendMessage" :disabled="!inputText || loading">
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick, computed, onMounted } from 'vue';
import { sendMessageToRole } from '@/api/deepseekApi';
import manAvatar from '@/assets/avatar/man.webp';
import jinxi from '@/assets/avatar/jinxi.webp';
import changli from '@/assets/avatar/changli.webp';
// 角色信息
const roles = [
  { id: 'jinxi', name: '今汐', avatar: jinxi },
  { id: 'changli', name: '长离', avatar: changli },
];
const selectedRole = ref<string>(roles[0].id);
const userAvatar = manAvatar;

// 聊天记录
const messages = reactive<{ sender: 'user' | 'ai'; text: string; time: string }[]>([]);
const inputText = ref('');
const loading = ref(false);

const formatTime = (date: string) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  const container = chatWindow.value as HTMLElement;
  container.scrollTop = container.scrollHeight;
};
const chatWindow = ref<HTMLElement>();
watch(messages, () => {
  saveHistory();
  scrollToBottom();
});

// 本地存储键
const storageKey = (role: string) => `chat_${role}`;
// 加载历史
const loadHistory = (role: string) => {
  const data = localStorage.getItem(storageKey(role));
  messages.splice(0, messages.length);
  if (data) {
    const arr = JSON.parse(data) as typeof messages;
    arr.forEach(m => messages.push(m));
  }
  // 如果刚切换且无记录，添加欢迎词
  if (messages.length === 0) {
    const welcome = roles.find(r => r.id === role)?.name || '';
    messages.push({ sender: 'ai', text: `你好，我是${welcome}，很高兴与你交流！`, time: new Date().toISOString() });
  }
};
// 保存历史
const saveHistory = () => {
  localStorage.setItem(storageKey(selectedRole.value), JSON.stringify(messages));
};

const selectRole = (roleId: string) => {
  selectedRole.value = roleId;
  loadHistory(roleId);
};

const currentAvatar = computed(() => {
  const role = roles.find(r => r.id === selectedRole.value);
  return role?.avatar;
});

// 发送消息
const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text) return;

  messages.push({ sender: 'user', text, time: new Date().toISOString() });
  inputText.value = '';
  loading.value = true;

  try {
    const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
    const reply = await sendMessageToRole(selectedRole.value, text, history as any);
    messages.push({ sender: 'ai', text: reply, time: new Date().toISOString() });
  } catch (error) {
    messages.push({ sender: 'ai', text: '请求出错，请稍后再试。', time: new Date().toISOString() });
  } finally {
    loading.value = false;
  }
};

// 清空记录
const clearChat = () => {
  messages.splice(0, messages.length);
  localStorage.removeItem(storageKey(selectedRole.value));
  loadHistory(selectedRole.value);
};

// 初始加载
onMounted(() => loadHistory(selectedRole.value));
</script>

<style lang="scss" scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background: #0d0d1a;
  font-family: 'PingFang SC', sans-serif;
  margin-top: 60px;

  .role-selector {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background: rgba(13, 13, 26, 0.8);

    .role-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 1rem;
      padding: 0.5rem;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: transform 0.3s;

      &.active {
        transform: scale(1.1);
      }

      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-bottom: 0.5rem;
      }

      span {
        color: #ccc;
        font-size: 0.875rem;
      }
    }
  }

  .chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;

    .message-fade-enter-active {
      transition: all 0.3s ease-out;
    }

    .message-fade-enter-from {
      opacity: 0;
      transform: translateY(10px);
    }

    .message-fade-enter-to {
      opacity: 1;
      transform: translateY(0);
    }

    .message {
      display: flex;
      align-items: flex-end;
      margin-bottom: 1rem;

      &.user {
        justify-content: flex-end;

        .bubble {
          background: linear-gradient(45deg, #fa4299, #a445b2);
          color: #fff;
        }

        .user-avatar {
          margin-left: 0.5rem;
        }
      }

      &.ai {
        justify-content: flex-start;

        .bubble {
          background: rgba(255, 255, 255, 0.1);
          color: #eee;
        }

        .avatar {
          margin-right: 0.5rem;
        }
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .bubble {
        max-width: 60%;
        padding: 0.75rem 1rem;
        border-radius: 1rem;
        position: relative;

        p {
          margin: 0;
          word-break: break-word;
        }

        .timestamp {
          display: block;
          font-size: 0.625rem;
          color: #999;
          text-align: right;
          margin-top: 0.25rem;
        }
      }
    }

    .loading-indicator {
      text-align: center;
      font-size: 0.875rem;
      color: #aaa;
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;

      .dots {
        display: inline-flex;
        margin-left: 0.25rem;

        span {
          opacity: 0;
          animation: blink 1s infinite;

          &:nth-child(1) {
            animation-delay: 0s;
          }

          &:nth-child(2) {
            animation-delay: 0.2s;
          }

          &:nth-child(3) {
            animation-delay: 0.4s;
          }
        }
      }
    }

    @keyframes blink {

      0%,
      80%,
      100% {
        opacity: 0;
      }

      40% {
        opacity: 1;
      }
    }

  }

  .input-area {
    padding: 1rem;
    background: rgba(13, 13, 26, 0.8);

    .input-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .actions-vertical {
      display: flex;
      gap: 0.25rem;

      justify-content: space-between;


      .btn-clear,
      .btn-send {
        width: 100px;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .btn-clear {
        background: transparent;
        color: #888;
      }

      .btn-send {
        background: linear-gradient(45deg, #fa4299, #a445b2);
        color: #fff;
      }

      .btn-send:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    textarea {
      width: 100%;
      height: 4rem;
      resize: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: none;
      font-size: 1rem;
      background: #1a1a2e;
      color: #fff;

      &:focus {
        outline: none;
      }
    }

   
  }
}
</style>
