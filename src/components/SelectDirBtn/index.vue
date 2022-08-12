<template>
  <div class="select-dir-btn" @click="selectDir">
    <n-icon v-if="isNoSlot" class="select-dir-btn__icon">
      <folder48-regular />
    </n-icon>
    <slot name="icon"></slot>
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import { ref, defineComponent, watch, computed } from 'vue'
  import { ipcRenderer } from 'electron'

  import { Folder48Regular } from '@vicons/fluent'
  import { NIcon } from 'naive-ui'

  export default defineComponent({
    name: 'SelectDirBtn',
    components: {
      NIcon,
      Folder48Regular
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: '请选择文件夹 '
      }
    },
    emits: ['update:value', 'after-selected'],
    setup(props, ctx) {
      // data
      const dirValue = ref(props.value)
      // watch
      watch(dirValue, (val) => {
        if (val) ctx.emit('update:value', val)
        console.log('watch select-dir', val)
      })
      // computed
      const isNoSlot = computed(() => {
        return ctx.slots.default ? false : true
      })
      // methods
      const selectDir = () => {
        if (!ipcRenderer) {
          return false
        }
        ipcRenderer.invoke('open-directory-dialog').then((res: any) => {
          if (!res.canceled) {
            dirValue.value = res.filePaths[0]
            ctx.emit('after-selected', res)
          }
        })
      }

      return {
        dirValue,
        isNoSlot,
        selectDir
      }
    }
  })
</script>

<style lang="scss" scoped>
  .select-dir-btn {
    display: inline-flex;
    cursor: pointer;
    color: #666;
    &__icon {
      transform: translateY(2px);
      margin-right: 2px;
    }
    :deep(#{&}__icon) {
      transform: translateY(2px);
      font-size: 16px;
      margin: 0 2px;
    }
  }
</style>
