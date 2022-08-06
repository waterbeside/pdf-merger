<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import ipcStore from './utils/ipcStore'
import { NUpload, NUploadDragger, NButton, NIcon } from 'naive-ui'
import SelectDirBtn from './components/SelectDirBtn/index.vue'
import { Save20Regular, FolderOpen16Filled } from '@vicons/fluent'
import { ref } from 'vue'


const savedDir = ref(localStorage.getItem('saved-dir') || '')
const defaultSavedDir = localStorage.getItem('saved-dir')
if (defaultSavedDir) {
  ipcStore('saved-dir').set(defaultSavedDir)
}

// 上传pdf文件
const uploadChange = function(options: any) {
  console.log(options)
}
// 选择保存的目标目录
const selectSavedDir = function(res: any) {
  if (res) {
    ipcStore('saved-dir').set(res.filePaths[0])
    savedDir.value = res.filePaths[0]
    localStorage.setItem('saved-dir', res.filePaths[0])
  }
  
}

</script>

<template>
  <div class="top-bar">
    <div class="saved-dir">
      <SelectDirBtn class="saved-dir__btn" @after-selected="selectSavedDir">
        <template #icon>
          <n-icon class="select-dir-btn__icon">
            <FolderOpen16Filled />
          </n-icon>
        </template>
        保存到：<input class="saved-dir__input" :value="savedDir" readonly/>
      </SelectDirBtn>
    </div>
    <div class="saved-btn">
      <n-button type="info" round>
        <template #icon>
          <Save20Regular/>
        </template>
        保 存
      </n-button>
    </div>
  </div>
  <NUpload
    class="upload-box"
    :multiple="true"
    accept="application/pdf"
    @change="uploadChange"
  >
    <NUploadDragger class="upload-box__inner">
      <div class="tips">
      <p>Drag files here</p>
      <p>拖动文件到此处，或点击添加。</p>
      </div>
    </NUploadDragger>
  </NUpload>
<!--   
  <div class="logo-box">
    <img style="height:140px;" src="./assets/electron.png" >
    <span/>
    <img style="height:140px;" src="./assets/vite.svg" >
    <span/>
    <img style="height:140px;" src="./assets/vue.png" >
  </div>
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
  <div class="static-public">
    Place static files into the <code>/public</code> folder
    <img style="width:77px;" :src="'./node.png'" >
  </div> -->
</template>

<style lang="scss" scoped>
$topbar-height: 74px;
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
  
}
.saved-dir {
  border: 1px solid #ccc;
  border-radius: 40px;
  padding: 4px 12px;
  background-color: #fff;
  &__input {
    border: none;
    min-width: 200px;
  }
}

.save-btn {

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
    display: flex;
    justify-content: center;
    flex-grow: 1;
    background-color: #292c32;
    border: none;
    .tips {
      padding: 20px;
      font-size: 14px;
      color: #999;
    }

  }
}

</style>
