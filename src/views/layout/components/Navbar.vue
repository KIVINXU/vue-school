<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb></breadcrumb>
      <el-dropdown class="avatar-container" trigger="click">
        <el-button type="warning">
          当前用户：{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              回到主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="aboutVisible = true">关于我们</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出用户</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <el-dialog title="关于我们" :visible.sync="aboutVisible" width="700px" top="10px">
      <About></About>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import About from './about.vue'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      About
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name'
      ])
    },
    data() {
      return {
        aboutVisible: false,
        username: window.sessionStorage.getItem('username')
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }
    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

