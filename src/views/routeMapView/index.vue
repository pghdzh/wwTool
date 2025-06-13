<template>
  <section class="route-map">
    <h2 class="route-map__title">刷怪路线图</h2>
    <div class="route-map__controls">
      <label for="routeSelect" class="route-map__label">选择路线：</label>
      <select id="routeSelect" v-model="selectedRouteId" class="route-map__select">
        <option v-for="route in routes" :key="route.id" :value="route.id">
          {{ route.name }}
        </option>
      </select>
    </div>
    <div
      class="route-map__image-container"
      v-if="currentRoute"
      @mousedown.prevent="onMouseDown"
      @mousemove.prevent="onMouseMove"
      @mouseup.prevent="onMouseUp"
      @mouseleave.prevent="onMouseUp"
      @wheel.prevent="onWheel"
      ref="container"
    >
      <img
        :src="currentRoute.image"
        :alt="currentRoute.name + ' 路线图'"
        class="route-map__image"
        :style="imageStyle"
        ref="image"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Route { id: string; name: string; image: string; }
const routes = ref<Route[]>([
  { id: 'v2.2.1', name: 'v2.2.1_黎那汐塔新COST3-精简版', image: new URL('@/assets/routes/v2.2.1_黎那汐塔新COST3-精简版.png', import.meta.url).href },
  { id: 'cost3-eternal-light', name: 'Cost3 - 此间永驻之光', image: new URL('@/assets/routes/cost3-eternal-light.jpg', import.meta.url).href },
  { id: 'cost4-storm-of-blades', name: 'Cost4 - 刃雨风暴', image: new URL('@/assets/routes/cost4-storm-of-blades.jpg', import.meta.url).href },
  { id: 'cost5-void-empire', name: 'Cost5 - 虚空帝国', image: new URL('@/assets/routes/cost5-void-empire.jpg', import.meta.url).href },
]);

const selectedRouteId = ref(routes.value[0].id);
const currentRoute = computed(() => routes.value.find(r => r.id === selectedRouteId.value) || null);

// 缩放与拖拽状态
const scale = ref(1);
const minScale = 1;
const maxScale = 3;
const translate = ref({ x: 0, y: 0 });
const dragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

// DOM refs
const container = ref<HTMLElement | null>(null);
const image = ref<HTMLImageElement | null>(null);

// 事件处理
function onWheel(e: WheelEvent) {
  const delta = e.deltaY < 0 ? 0.2 : -0.2;
  const newScale = Math.min(maxScale, Math.max(minScale, scale.value + delta));
  scale.value = newScale;
}

function onMouseDown(e: MouseEvent) {
  dragging.value = true;
  dragStart.value = { x: e.clientX - translate.value.x, y: e.clientY - translate.value.y };
}

function onMouseMove(e: MouseEvent) {
  if (!dragging.value) return;
  translate.value = { x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y };
}

function onMouseUp() {
  dragging.value = false;
}

// 重置状态
watch(currentRoute, () => {
  scale.value = 1;
  translate.value = { x: 0, y: 0 };
});

// 绑定样式
const imageStyle = computed(() => ({
  transform: `translate(${translate.value.x}px, ${translate.value.y}px) scale(${scale.value})`,
  transformOrigin: 'top left',
  cursor: dragging.value ? 'grabbing' : 'grab',
  transition: dragging.value ? 'none' : 'transform 0.2s ease',
}));
</script>

<style lang="scss" scoped>
.route-map {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  font-family: 'Noto Sans SC', sans-serif;

  &__title {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    color: #fff;
    font-size: 1.75rem;
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
  }

  &__controls {
    position: absolute;
    top: 64px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    align-items: center;
    .route-map__label { margin-right: 8px; color: #fff; text-shadow: 0 1px 4px rgba(0,0,0,0.7);}    
    .route-map__select { padding:8px 12px; border:none; border-radius:8px; background:rgba(0,0,0,0.5); color:#fff; cursor:pointer; }
  }

  &__image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: #000;
    overflow: hidden;
  }

  .route-map__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    will-change: transform;
    user-select: none;
  }
}
</style>
