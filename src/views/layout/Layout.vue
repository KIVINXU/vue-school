<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, AppFooter } from '@/views/layout/components'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    AppFooter
  },
  mounted() {
    //关闭页面的时候提示
    window.onbeforeunload = function (){
      return '确定要离开么？'
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
