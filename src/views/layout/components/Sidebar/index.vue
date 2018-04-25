<template>
  <scroll-bar>
    <el-menu mode="vertical"
             :default-active="$route.path"
             uniqueOpened
             :collapse="isCollapse"
             @open="handleOpen"
             backgroundColor="#f0f2f5"
             activeTextColor="#409eff">
             <!--background-color="#304156"-->
             <!--text-color="#fff" -->
             <!--active-text-color="#409EFF">-->
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    handleOpen (index) {
      this.$router.push({
        name: index
      })
    }
  }
}
</script>
