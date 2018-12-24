<template>
  <div id="app">
    <transition :name="transitionName" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import {mapState,mapMutations} from 'vuex'

  export default {
    data() {
      return {
        transitionName: 'slide-fade',
      }
    },
    computed:{
      ...mapState(['online'])
    },
    mounted() {
      window.addEventListener('online', this.setOnlineStatus.bind(this))
      window.addEventListener('offline', this.setOnlineStatus.bind(this))
      this.checkUpdate();
    },
    methods: {
      // 设置在线状态
      setOnlineStatus() {
        this.setOnLine(navigator.onLine)
      },
      // 获取检查更新过程
      checkUpdate(){
        ipcRenderer.send("checkForUpdate")
        ipcRenderer.on('message',(event,arg)=>{
          console.log(event,arg)
        })
      },
      ...mapMutations({
        setOnLine:'setOnLine'
      })
    },
    watch: {
      $route(to, from) {
        if (!from) return 'slide-fade'
        let toDepth = to.path.split('/').length
        let fromDepth = from.path.split('/').length
        return toDepth <= fromDepth ? 'slide-right' : 'slide-left'
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
</style>
