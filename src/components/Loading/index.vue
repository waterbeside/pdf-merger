<script setup lang="ts">
import { defineProps } from 'vue'
import { SpinnerIos20Filled } from '@vicons/fluent'
import { NIcon } from 'naive-ui'
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})



</script>

<template>
  <div class="backdrop" v-show="loading">
    <div class="loading-content">
    <n-icon class="spinner">
      <SpinnerIos20Filled />
    </n-icon>
    <p>{{text}}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}
.loading-content {
  text-align: center;
}
.spinner {
  animation: rotate 1s linear infinite;
  font-size: 80px;
}
</style>