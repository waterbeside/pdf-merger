<script setup lang="ts">
import { PlusOutlined } from '@vicons/antd'
import { ref, defineEmits, defineProps, watch } from 'vue'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import ipcStore from '../../utils/ipcStore'
import PdfListItem from '../../components/PdfListItem/index.vue'

import { 
  NUpload,
  NIcon,
  NUploadTrigger
  } from 'naive-ui'

const props = defineProps<{
    files: UploadFileInfo[]
    saveFileName: string
  }>()
const emit = defineEmits(['update:files', 'update:saveFileName'])
const fileListRt = ref<UploadFileInfo[]>([])
const uploadRef = ref<UploadInst | null>(null)


watch(() => props.files, (val) => {
  fileListRt.value = val
  console.log('inwatch', val)
}, { immediate: true })



// 上传pdf文件
const uploadChange = function(options: any) {
  if (dragItemTarget.value) return
  const { file  } = options
  const oldList = fileListRt.value
  // let reader = new window.FileReader()
  // re
  const isInList = oldList.some((item: any) => item.file.path === file.file.path)
  if (isInList) {
    window.$message.warning(`${file.name} 已经存在于列表中`)

    uploadRef.value?.clear()
    return
  }
  if (file.type === 'application/pdf') {
    if (oldList.length === 0 || props.saveFileName === '') {
      emit('update:saveFileName', 'merged_' + file.name)
    }
    oldList.push(file)
    fileListRt.value = oldList
    ipcStore('file-list').set(fileListRt.value.map((item: any) => ({
      name: item.name,
      path: item.file?.path || item?.path,
      id: item.id
    })))
    emit('update:files', oldList)
    
  } else {
    window.$message.error(`${file.name} 不是一个有效的pdf文件`)
  }
}

// 移除文件
const removeItem = function(fileData: UploadFileInfo) {
  fileListRt.value = fileListRt.value.filter(item => item.id !== fileData.id)
  emit('update:files', fileListRt.value)
  ipcStore('file-list').set(fileListRt.value.map((item: any) => ({
    name: item.name,
    path: item.file?.path || item?.path,
    id: item.id,
  })))
}


// 拖动添加文件
const drop = function (e: any) {
  e.preventDefault
  e.stopPropagation()
  const files = e.dataTransfer.files
  for (const file of files) {
    const fileInfo = {
      name: file.name,
      file,
      id: Math.random(),
      type: file.type,
    }
    uploadChange({file: fileInfo})
  }
}

const dragover = function (e: any) {
  e.preventDefault()
  e.stopPropagation()
}

// 拖动排序
const dragItemTarget = ref<any>(null)
const handleDragend = function (item: UploadFileInfo) {
  if (!dragItemTarget.value ) return
  let targetIdx = -1
  let sourceIdx = -1
  for (let i = 0; i < fileListRt.value.length; i++) {
    if (fileListRt.value[i].id === dragItemTarget.value.id) {
      targetIdx = i
    }
    if (fileListRt.value[i].id === item.id) {
      sourceIdx = i
    }
  }
  const newList = [...fileListRt.value]
  newList.splice(sourceIdx, 1)
  newList.splice(targetIdx, 0, item)
  fileListRt.value = newList
  ipcStore('file-list').set(fileListRt.value.map((item: any) => ({
    name: item.name,
    path: item.file?.path || item?.path,
    id: item.id,
  })))
  emit('update:files', newList)
  dragItemTarget.value = null
}

const handleDragenter = function (item: UploadFileInfo) {
  dragItemTarget.value = item
}

</script>

<template>

  <n-upload
    class="upload-box"
    :multiple="true"
    accept="application/pdf"
    @change="uploadChange"
    ref="uploadRef"
    directory-dnd
    abstract
  >

    <div class="upload-box__outer">
      <n-upload-trigger #="opt" abstract>
          <div class="drager-area n-upload-trigger">
            <ul class="file-list"  dropable @drop="drop" @dragover="dragover">
              <template v-for="item in fileListRt" :key="item.id">
                <pdf-list-item
                  :data="item"
                  @delete="removeItem"
                  @dragend.stop.prevent="handleDragend(item)"
                  @dragenter.stop.prevent="handleDragenter(item)"
                >
                </pdf-list-item>
              </template>
              <li>
              <div class="upload-btn" @click="opt.handleClick">
                <div class="upload-btn__icon">
                  <n-icon><PlusOutlined /></n-icon>
                </div>
                <p>添加文件</p>
              </div>
              </li>
            </ul>
          </div>
      </n-upload-trigger>
    </div>
  </n-upload>
</template>

<style lang="scss" scoped>
$topbar-height: 60px;
$titlebar-height: 30px;

.upload-box__outer {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
  padding-top: $topbar-height + $titlebar-height + 20px;
  display: flex;
  box-sizing: border-box;
  background-color: #292c32;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  :deep(.n-upload-trigger) {
    display: flex;
    width: 100%;
    flex-grow: 1;
    height: 100%;
  }
  .drager-area {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
  }
  .upload-btn {
    
    float: left;
    margin-left: 20px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    &__icon {
      margin-top: 7px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      border: 1px dashed rgba(255, 255, 255, 0.4);;
      border-radius: 5px;
      font-size: 30px;
      background: rgba(255, 255, 255, 0.1);
    }
    p {
      padding: 3px 0;
      margin: 0;
    }
    &:hover {
      color: #fff;
    }
  }

  .file-list {
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    &__item {
      float: left;
      width: 120px;
      margin-right: 30px;

    }

  }
}
</style>