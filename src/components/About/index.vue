<script setup lang="ts">
import { NModal, NIcon } from 'naive-ui'
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ipcRenderer } from 'electron'
import { GithubFilled } from '@vicons/antd'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show'])

const showModal = ref<boolean>(props.show)

watch(showModal, (val) => {
  emit('update:show', val)
})

watch(() => props.show, (val) => {
  showModal.value = val
})

ipcRenderer.on('show-about', () => {
  // showModal.value = true
  emit('update:show', true)
})

const appinfo = ref<{version: string, name: string}>(ipcRenderer.sendSync('get-appinfo'))

</script>

<template>
<n-modal v-model:show="showModal" preset="dialog" title="Dialog" :show-icon="false">
  <template #header>
    <div>关于</div>
  </template>
  <div class="content">
    <p>{{appinfo.name}} @{{appinfo.version}}</p>
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