<script setup lang="ts">
import { useSlots, ref, defineEmits } from 'vue'
import { CaretDown20Filled, Dismiss20Regular, Maximize20Regular, Subtract20Regular, WindowMultiple20Regular } from '@vicons/fluent'
import vDrag from '../../directives/vDrag'
import { NIcon, NDropdown, NButton } from 'naive-ui'
import { ipcRenderer } from 'electron'

const slots = useSlots()

const emit = defineEmits(['clickSetting', 'clickAbout'])

const handleSelect = (key: string) => {
  if (key === 'setting') emit('clickSetting')
  if (key === 'about') emit('clickAbout')
}

// const isMaximized = ref(checkMaximized())
const isMaximized = ref(false)

function minisize() {
  ipcRenderer.send('mainwin-size', {action: 'minimize'})
}

function maximize() {
  if (isMaximized.value) {
    ipcRenderer.send('mainwin-size', {action: 'restore'})
    isMaximized.value = false
  } else {
    ipcRenderer.send('mainwin-size', {action: 'maximize'})
    isMaximized.value = true
  }
}

function close() {
  ipcRenderer.send('mainwin-size', {action: 'close'})
}

function handleDrag(pos: {x: number, y: number}){
  ipcRenderer.send('mainwin-move', pos)
}

const dropdownMenu = ref([
        {
          label: '设置',
          key: 'setting',
        },
        {
          label: '关于',
          key: 'about',

        }
      ])
</script>

<template>
  <div class="titlebar" v-drag="handleDrag" @dblclick="maximize">
    <template v-if="!slots.left">
      <div class="left">
        <span class="title">PDF-MERGER</span>
      </div>

    </template>
    <slot name="left"></slot>

    <template v-if="!slots.right">
      <div class="right">
        <n-dropdown :options="dropdownMenu" trigger="click" @select="handleSelect">
          <a class="titlebar__btn">
            <n-icon>
              <CaretDown20Filled />
            </n-icon>
          </a>
        </n-dropdown>
        <a class="titlebar__btn" @click="minisize">
          <n-icon>
            <Subtract20Regular />
          </n-icon>
        </a>

        <a class="titlebar__btn" v-if="isMaximized" @click="maximize">
          <n-icon>
            <WindowMultiple20Regular />
          </n-icon>
        </a>
        <a class="titlebar__btn" v-else @click="maximize">
          <n-icon>
            <Maximize20Regular />
          </n-icon>
        </a>
        <a class="titlebar__btn" @click="close">
          <n-icon>
            <Dismiss20Regular />
          </n-icon>
        </a>
      </div>
    </template>
    <slot name="right"></slot>

  </div>
</template>

<style scope lang="scss">
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    height: 30px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: darken(#2c3034, 2%);
    border-bottom: 1px solid darken(#2c3034, 20%);
    color: #fff;
    .left {
      padding-left: 10px;
      font-weight: bold;
    }
    .right {
      display: flex;
      align-items: stretch;
      justify-content: flex-end;
      height: 100%;
    }
    .title {
      color: rgba(255,255,255,0.8);
    }
    &__btn {
      cursor: pointer;
      font-size: 16px;
      padding:0 12px;
      color: rgba(255, 255, 255, 0.6);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      &:hover {
        color: rgba(255, 255, 255, 0.8);
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
</style>

