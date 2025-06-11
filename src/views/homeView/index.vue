<template>
  <div class="home-container">


    <!-- 头图 & 标题 -->
    <section class="hero">
      <!-- 背景轮播放在最底层 -->
      <div class="carousel">
        <img v-for="(src, idx) in randomFive" :key="idx" :src="src" class="carousel-image"
          :class="{ active: idx === currentIndex }" />
      </div>
      <div class="hero-content">
        <h1>欢迎来到鸣潮游戏工具箱</h1>
        <p>一站式辅助，提高游戏体验</p>
        <button class="btn-primary">立即体验</button>
      </div>

    </section>

    <!-- 功能模块概览 -->
    <section class="features">
      <div class="feature-card" id="ai-chat">
        <h3>AI对话</h3>
        <p>与角色沉浸式互动，体验专属剧情交流</p>
      </div>
      <div class="feature-card" id="team-build">
        <h3>阵容搭配</h3>
        <p>推荐最佳队伍组合，发挥角色优势</p>
      </div>
      <div class="feature-card" id="grind-map">
        <h3>刷怪路线图</h3>
        <p>高效刷图路线，快速获取资源</p>
      </div>
      <div class="feature-card" id="forum">
        <h3>讨论区</h3>
        <p>交流心得，分享攻略</p>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <p>&copy; 2025 鸣潮工具 | 保留所有权利</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';


// 1. 全量导入，直接映射成 string[]
const modules = import.meta.glob("@/assets/images1/*.{jpg,png,jpeg}", {
  eager: true,
});
const allSrcs: string[] = Object.values(modules).map((mod: any) => mod.default);

// 2. 洗牌并取 5 张
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const randomFive = ref<string[]>(shuffle(allSrcs).slice(0, 5));

const currentIndex = ref(0);
let timer: number;

onMounted(() => {
  // 2. 每 5 秒切换一次
  timer = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % randomFive.value.length;
  }, 5000);
});


onUnmounted(() => {
  clearInterval(timer);
});


</script>

<style lang="scss" scoped>
.home-container {
  font-family: 'PingFang SC', sans-serif;
  color: #fff;
  background: #0d0d1a;
  margin-top: 60px;

  .hero {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-height: 80vh;

    .carousel {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;

      /* 放在最底层 */
      /* 叠加所有图片，通过 opacity 实现切换 */
      .carousel-image {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 1s ease;
        filter: blur(1.5px);
        /* 轻微模糊 */
      }

      .carousel-image.active {
        opacity: 1;
      }
    }

    /* 遮罩层 */
    .carousel::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.2);
      /* 遮罩透明度可调 */
      pointer-events: none;
      z-index: 1;
    }

    .hero-content {
      max-width: 50%;
      z-index: 1;

      h1 {
        font-size: 3rem;
        margin-bottom: 1rem;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      }

      p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
      }

      .btn-primary {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border: none;
        border-radius: 2rem;
        background: linear-gradient(45deg, #fa4299, #a445b2);
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(250, 66, 153, 0.4);
        }
      }
    }


  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
 
    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      padding: 2rem;
      border-radius: 1.5rem;
      text-align: center;
      backdrop-filter: blur(8px);
      transition: transform 0.3s, box-shadow 0.3s;

      h3 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }

      p {
        font-size: 1rem;
        color: #aaa;
      }

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      }
    }
  }

  .footer {
    text-align: center;
    padding: 2rem;
    background: rgba(13, 13, 26, 0.9);
    font-size: 0.875rem;
    color: #777;
  }
}
</style>