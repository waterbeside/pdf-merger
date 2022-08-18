<script setup lang="ts">
import { Dismiss32Filled } from '@vicons/fluent'
import { NIcon } from 'naive-ui'
import { shell } from 'electron'
const props = defineProps<{ data: any }>()
const emit = defineEmits(['click', 'delete'])

function clickItem() {
  emit('click', props.data)
}

function remove() {
  emit('delete', props.data)
}

function openFile(filePath: string) {
  shell.openPath(filePath)
}
</script>

<template>
  <li class="file-list__item" :title="data.name" @click.stop="clickItem" @dblclick.stop="openFile(data.file.path)">
    <div class="icon">
      <img src="../../assets/pdf.png">
    </div>
    <span class="file-list__name">{{ data.name }}</span>
    <div class="remove" @click.stop="remove">
      <n-icon>
        <Dismiss32Filled />
      </n-icon>
    </div>
  </li>
</template>

<style lang="scss" scoped>
  .file-list__item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    height: 180px;
    padding: 0.5rem;
    overflow: hidden;
  }
  .file-list__name {
    padding-top: 4px;
    font-size: 16px;
    color: #fff;
    line-height: 1.2;
  }
  .icon {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa;
    img {
      width: 100%;
    }
  }
  .remove {
    position: absolute;
    top: 0;
    left: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    padding: 2px;
    border-radius: 50%;
    font-size: 14px;
    background-color: rgba(0,0,0,0.4);
    color: #fff;
    cursor: pointer;
  }
</style>