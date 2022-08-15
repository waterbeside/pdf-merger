<script setup lang="ts">
import { NTooltip, NButton, NIcon } from 'naive-ui'
import { defineProps, defineEmits, Component } from 'vue'
const props = defineProps<{tooltipText: string}>()

const emit = defineEmits(['click'])
function clickBtn(e: MouseEvent) {
  emit('click', e)
}

</script>

<template>
<n-tooltip placement="bottom" trigger="hover">
  <template #trigger>
    <n-button class="btn"  circle strong secondary size="small" color="rgb(195, 226, 251)" @click="clickBtn" >
      <template #icon>
        <n-icon>
          <slot></slot>
        </n-icon>
      </template>
    </n-button>
  </template>
  <span>{{tooltipText}}</span>
</n-tooltip>
</template>