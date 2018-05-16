<template>
  <div>
    <div class="footer" :class="{closed: !sidebar.opened}">
      <span style="color: #606266;font-size: 14px;vertical-align: top">
        <a href="http://www.wzdgm.com/" target="_blank">
          <img src="../../../assets/dgm_logo.jpg" alt=""></a>
        <span class="unselectable">Copyright ©2017 浙江帝杰曼信息科技股份有限公司</span>
      </span>
      <div class="pull-right unselectable">
        <span>
            {{username}}
          </span> |
        <el-button type="text" size="medium" @click="aboutVisible = true">
          关于我们 <svg-icon iconClass="about"></svg-icon>
        </el-button> |
        <el-button type="text" size="medium" @click="logout">
          退出 <svg-icon iconClass="quit"></svg-icon>
        </el-button>
      </div>
    </div>
    <!--关于我们对话框-->
    <el-dialog title="关于我们" :visible.sync="aboutVisible" width="700px" top="10px">
      <About></About>
    </el-dialog>
  </div>
</template>
<script>
  import About from './about.vue'
  import SvgIcon from "../../../components/SvgIcon/index.vue";
  export default {
    components: {
      SvgIcon,
      About
    },
    name: 'AppFooter',
    data() {
      return {
        aboutVisible: false,
        username: window.sessionStorage.getItem('username')
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    methods: {
      logout() {
        this.$confirm('是否确认退出当前用户？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            this.$router.push({ path: '/login' })
            //location.reload() // 为了重新实例化vue-router对象 避免bug
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          });
        })
      
      }
    }
  }
  

</script>
<style lang="scss">
  .footer{
    position: fixed;
    z-index: 1999;
    left: 0;
    right: 0;
    bottom: 0;
    /*margin-left: 180px;*/
    margin-left: 160px;
    padding-right: 20px;
    border-top: 1px solid #99a9bf;
    background-color: #fff;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
    span {
      line-height: 25px;
      img {
        vertical-align: middle;
      }
    }
  }
  .closed {
    margin-left: 35px;
  }
  .pull-right {
    line-height: 25px;
    float: right;
    color: #606266;
    font-size: 14px;
    .el-button--medium, .el-button--medium.is-round {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
