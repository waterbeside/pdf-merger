<script setup lang="ts">
import { NModal, NIcon } from 'naive-ui'
import { ref } from 'vue'
import { ipcRenderer } from 'electron'
import { GithubFilled } from '@vicons/antd'

const showModal = ref<boolean>(false)

ipcRenderer.on('show-about', () => {
  showModal.value = true
})

</script>

<template>
<n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false">
  <template #header>
    <div>About</div>
  </template>
  <div class="content">
    <p>Electron-pdf-merger @0.0.5</p>
    <p>
      <n-icon class="icon">
        <GithubFilled />
      </n-icon>
      <a target="_blank" href="https://github.com/waterbeside/pdf-merger">Github</a>
    </p>
  </div>
  
</n-modal>
</template>

<style lang="scss" scoped>
.content {
  color: #666;
  font-size: 16px;
  line-height: 1.2;
  
}
.icon {
  font-size:18px;
  transform: translateY(3px);
  margin-right: 5px;
}
</style>