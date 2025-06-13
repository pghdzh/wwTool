<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <router-link to="/">鸣潮游戏工具箱</router-link>
      </div>

      <!-- 汉堡按钮 -->
      <button class="hamburger" @click="toggleMenu">
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
        <span :class="{ open: menuOpen }"></span>
      </button>

      <!-- 导航列表 -->
      <ul :class="['nav-list', { open: menuOpen }]">
        <li
          v-for="item in navItems"
          :key="item.name"
          :class="[{ active: item.path === currentPath }, 'nav-item']"
          @click="closeMenu"
        >
          <router-link :to="item.path">{{ item.label }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

type NavItem = { name: string; label: string; path: string }
const navItems = ref<NavItem[]>([
  { name: 'home', label: '首页', path: '/' },
  { name: 'chat', label: 'AI对话', path: '/chat' },
  { name: 'teamBuild', label: '阵容搭配', path: '/team-build' },
  { name: 'routeMap', label: '刷怪路线图', path: '/route-map' },
  { name: 'discussion', label: '讨论区', path: '/discussion' },
   { name: 'gallery', label: '图集', path: '/gallery' }
])

const route = useRoute()
const currentPath = computed(() => route.path)

// 控制移动端菜单开关
const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 60px;
  line-height: 60px;
  z-index: 10;
  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .logo {
    font-size: 1.75rem;
    font-weight: bold;
    a {
      background: linear-gradient(45deg, #6e8efb, #a777e3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
      transition: opacity 0.3s;
      &:hover { opacity: 0.8; }
    }
  }

  /* 汉堡按钮 */
  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    span {
      display: block;
      width: 100%;
      height: 2px;
      background: #333;
      transition: transform 0.3s, opacity 0.3s;
      &.open:nth-child(1) { transform: translateY(8px) rotate(45deg); }
      &.open:nth-child(2) { opacity: 0; }
      &.open:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
    }
  }

  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    .nav-item {
      margin-left: 2rem;
      position: relative;
      a {
        text-decoration: none;
        color: #333;
        font-size: 1rem;
        transition: color 0.3s;
        padding: 0.5rem 0;
        &:hover { color: #007acc; }
      }
      &.active {
        a { color: #007acc; font-weight: 600; }
        &::after {
          content: '';
          position: absolute;
          bottom: 12px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #007acc;
          border-radius: 2px;
        }
      }
      &:first-of-type { margin-left: 0; }
    }
  }

  /* 移动端样式 */
  @media (max-width: 768px) {
    height: 60px;
    line-height: 60px;
    .hamburger { display: flex; }
    .nav-list {
      display: block;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background: #fff;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease-out;
      &.open {
        max-height: 900px; /* 根据项目栏目数调整 */
        transition: max-height 0.5s ease-in;
      }
      .nav-item {
        margin: 0;
        border-bottom: 1px solid #eee;
        text-align: center;
        a { display: block; padding: 1rem 0; font-size: 1.2rem; }
        &.active a { background: #f5faff; }
      }
    }
  }
}
</style>
