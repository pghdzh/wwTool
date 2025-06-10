<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <router-link to="/">潮行者助手</router-link>
      </div>
      <ul class="nav-list">
        <li v-for="item in navItems" :key="item.name" :class="[{ active: item.path === currentPath }, 'nav-item']">
          <router-link :to="item.path">{{ item.label }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

type NavItem = {
  name: string
  label: string
  path: string
}

const navItems = ref<NavItem[]>([
  { name: 'home', label: '首页', path: '/' },
  { name: 'chat', label: 'AI对话', path: '/chat' },
  { name: 'teamBuild', label: '阵容搭配', path: '/team-build' },
  { name: 'routeMap', label: '刷怪路线图', path: '/route-map' },
  { name: 'discussion', label: '讨论区', path: '/discussion' }
])

const route = useRoute()
const currentPath = computed(() => route.path)
</script>

<style lang="scss" scoped>
.navbar {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  width: 100%;
  height: 64px;
  line-height: 64px;
  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
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

      &:hover {
        opacity: 0.8;
      }
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
        color: #333333;
        font-size: 1rem;
        transition: color 0.3s;
        padding: 0.5rem 0;

        &:hover {
          color: #007acc;
        }
      }

      &.active {
        a {
          color: #007acc;
          font-weight: 600;
        }

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

      &:first-of-type {
        margin-left: 0;
      }
    }
  }
}
</style>
