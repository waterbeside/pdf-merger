<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { NModal, NInput, NFormItem, NForm, NButton } from 'naive-ui'
import ipcStore from '../../utils/ipcStore'



const props = defineProps<{show: boolean}>()

const emit = defineEmits(['update:show'])
const showModal = ref<boolean>(props.show)

watch(showModal, (val) => {
  emit('update:show', val)
  if (val) {
    getSettingFromStore()
  }
})

watch(() => props.show, (val) => {
  showModal.value = val
})

const settingData = ref<SettingData>({saveNamePrefix: 'merged_'})

function getSettingFromStore() {
  ipcStore('setting').get<SettingData>().then(res => {
    if (res) {
      settingData.value = res
    }
  })
}

async function saveSetting() {
  await ipcStore('setting').set({...settingData.value})
  window.$message.success('保存成功')
  showModal.value = false
}

</script>

<template>
<n-modal
  v-model:show="showModal"
  preset="dialog"
  title="Dialog"
  :show-icon="false"
  positive-text="确认"
  negative-text="取消"
  @positive-click="saveSetting"
  @negative-click="() => { showModal = false }"
  >
  <template #header>
    <div>设置</div>
  </template>
  <div class="setting-content">
  <n-form>
    <n-form-item path="saveNamePrefix" label="保存时文件名添加前缀：">
      <n-input v-model:value="settingData.saveNamePrefix" placeholder="保存时文件名添加前缀" />
    </n-form-item>
  </n-form>

   
  </div>
  
</n-modal>
  
</template>

<style scoped lang="scss">
.setting-content {
  padding: 20px;
}
</style>