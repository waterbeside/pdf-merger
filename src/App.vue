<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import ipcStore from './utils/ipcStore'
import { ipcRenderer, shell } from 'electron'
import { NUpload, NUploadDragger, NButton, NIcon, NInput, NMessageProvider, useMessage } from 'naive-ui'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import SelectDirBtn from './components/SelectDirBtn/index.vue'
import { Save20Filled, FolderOpen16Filled, Delete16Filled } from '@vicons/fluent'
import { FileFilled, FolderOpenFilled } from '@vicons/antd'
import { ref } from 'vue'
import PdfListItem from './components/PdfListItem/index.vue'
import MessageApi from './components/MessageApi.vue'
import Loading from './components/Loading/index.vue'
import About from './components/About/index.vue'
import fs from 'fs'
import path from 'path'
import { debounce } from './utils'

    

const fileListRt = ref<UploadFileInfo[]>([])
const uploadRef = ref<UploadInst | null>(null)
const savedDir = ref(localStorage.getItem('saved-dir') || '')
const defaultSavedDir = localStorage.getItem('saved-dir')
const saveFileName = ref<string>('')
const loading = ref<boolean>(false)

if (defaultSavedDir) {
  ipcStore('saved-dir').set(defaultSavedDir)
}

// 上传pdf文件
const uploadChange = function(options: any) {
  const { file, fileList  } = options
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
    if (oldList.length === 0 || saveFileName.value === '') {
      saveFileName.value = 'merged_' + file.name
    }
    oldList.push(file)
    fileListRt.value = oldList
    ipcStore('file-list').set(fileListRt.value.map((item: UploadFileInfo) => ({
      name: item.name,
      path: item.file?.path,
      id: item.id
    })))
  } else {
    window.$message.error(`${file.name} 不是一个有效的pdf文件`)
  }
}
// 选择保存的目标目录
const selectSavedDir = function(res: any) {
  if (res) {
    ipcStore('saved-dir').set(res.filePaths[0])
    savedDir.value = res.filePaths[0]
    localStorage.setItem('saved-dir', res.filePaths[0])
  } 
}

// 移除文件
const removeItem = function(fileData: UploadFileInfo) {
  fileListRt.value = fileListRt.value.filter(item => item.id !== fileData.id)
  ipcStore('file-list').set(fileListRt.value.map((item: UploadFileInfo) => ({
    name: item.name,
    path: item.file?.path,
    id: item.id
  })))
}

// 合并文件（点击保存）
const save = debounce(function () {
  if (savedDir.value === '') {
    window.$message.warning('请选择保存目录')
    return
  }
  if (fileListRt.value.length < 2) {
    window.$message.warning('最少需要两个文件')
    return
  }
  loading.value = true
  ipcRenderer.invoke('merge-pdf', {fileName: saveFileName.value}).then(() => {
    window.$message.success('保存成功')
  }).catch(() => {
    window.$message.error('合并失败')
  }).finally(() => {
    loading.value = false
  })
}, 300)

// 清空文件
const clear = function() {
  fileListRt.value = []
  ipcStore('file-list').set([])
  saveFileName.value = ''
}

// 打开目录
const showDir = debounce(function () {
  const fullPath = path.join(savedDir.value, saveFileName.value)
  if (saveFileName.value && fs.existsSync(fullPath)) shell.showItemInFolder(fullPath) // shell.showItemInFolder(fullPath)
  else shell.openPath(savedDir.value)
}, 300)

// 打开文件
const openFile = debounce(function () {
  const fullPath = path.join(savedDir.value, saveFileName.value)
  if (saveFileName.value && fs.existsSync(fullPath)) shell.openPath(fullPath) // shell.showItemInFolder(fullPath)
  else window.$message.error('文件不存在')
  // setTimeout(() => {
  //   ipcRenderer.send('mainwin-size', {action: 'blur'})
  // }, 500)
}, 300)



</script>

<template>
<n-message-provider>
  <MessageApi/>
</n-message-provider>
<div class="top-bar">
  <div class="top-bar__left">
    <div class="saved-dir">
      <SelectDirBtn class="saved-dir__btn" @after-selected="selectSavedDir">
        <template #icon>
          <n-icon class="select-dir-btn__icon">
            <FolderOpen16Filled />
          </n-icon>
        </template>
        <div class="saved-dir__con" >
          <label>保存到：</label>
          <div class="saved-dir__input">{{savedDir}}</div>
          <input  hidden :value="savedDir" readonly/>
        </div>
      </SelectDirBtn>
    </div>
    <div class="sp"> / </div>
    <div class="saved-name">
      <n-input v-model:value="saveFileName" round size="small" clearable placeholder="请输入文件名" />
    </div>
  </div>
  <div class="top-bar__right">
    
    <n-button class="btn"  circle strong secondary size="small" color="rgb(195, 226, 251)" @click="showDir" >
      <template #icon>
        <n-icon>
          <FolderOpenFilled /> 
        </n-icon>
      </template>
    </n-button>
    <n-button class="btn"   circle secondary size="small" color="rgb(195, 226, 251)" @click="openFile" >
      <template #icon>
        <n-icon>
          <FileFilled /> 
        </n-icon>
      </template>
    </n-button>
    <n-button class="btn"  circle secondary size="small" color="rgb(195, 226, 251)" @click="clear" >
      <template #icon>
        <n-icon>
          <Delete16Filled /> 
        </n-icon>
      </template>
    </n-button>
    
    <div class="saved-btn">
      <n-button type="primary" round @click="save" size="small">
        <template #icon>
          <n-icon>
            <Save20Filled/>
          </n-icon>
        </template>
        保 存
      </n-button>
    </div>
  </div>
</div>
<NUpload
  class="upload-box"
  :multiple="true"
  directory-dnd
  accept="application/pdf"
  @change="uploadChange"
  ref="uploadRef"
>
  <NUploadDragger class="upload-box__inner">
    <div class="tips">
    <p>Drag files here</p>
    <p>拖动文件到此处，或点击添加。</p>
    </div>
    <ul v-if="fileListRt.length > 0" class="file-list">
      <template v-for="item in fileListRt" :key="item.batchId">
        <pdf-list-item
          :data="item"
          @delete="removeItem"
        >
        </pdf-list-item>
      </template>
    </ul>
  </NUploadDragger>
</NUpload>
<Loading :loading="loading" text="正在保存文件..."/>
<About/>
</template>

<style lang="scss" scoped>
$topbar-height: 60px;
body {
  background-color: #292c32;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.top-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: $topbar-height;
  width: 100%;
  padding: 0 12px;
  // border-bottom: 1px solid #ccc;
  position: fixed;
  z-index:  100;
  background-color: #2c3034;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  color: #fff;
  &__left {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    .sp {
      padding: 0 12px;
    }
  }
  &__right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    .btn {
      margin-right: 8px;
    }
  }
  
}
.saved-dir {
  box-sizing: border-box;
  height: 28px;
  border: 1px solid #ccc;
  border-radius: 40px;
  padding: 2px 8px;
  background-color: #fff;
  min-width: 200px;
  max-width: 300px;
  overflow: hidden;
  &__btn {
    width: 100%;
  }
  &__input {
    border: none;
    display: block;
    overflow-x: auto;
    flex-grow: 1;
    white-space: nowrap;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__con {
    display: flex;
    flex-grow: 1;
    width: 100%;
    // min-width: 160px;
    label {
      min-width:60px;
      display: inline-block;
    }
  }
}

.upload-box {
  height: 100vh;
  width: 100%;
  :deep(.n-upload-trigger) {
    display: flex;
    width: 100%;
    flex-grow: 1;
    height: 100%;
  }
  :deep(.n-upload-file-list) {
    display: none;
  }
  
  &__inner {
    padding-top: $topbar-height + 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    background-color: #292c32;
    border: none;
    color: #fff;
    .tips {
      padding: 20px;
      font-size: 14px;
      color: #999;
      line-height: 1.2;
    }
    .file-list {
      width: 100%;
      &__item {
        float: left;
        width: 120px;
      }
    }
  }
}

</style>
