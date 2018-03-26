<template>
  <div class="footer" :class="{closed: !sidebar.opened}">
    <strong style="color: #606266;font-size: 14px">
      <a href="http://www.wzdgm.com/" target="_blank">
        <img src="../../../assets/dgm_logo.jpg" alt=""></a>
      <span class="unselectable">Copyright ©2017 浙江帝杰曼信息科技股份有限公司</span>
    </strong>
    <div class="pull-right unselectable" style="line-height: 25px;font-size: 14px">
      电话：400-8400-999
    </div>
    
  </div>
</template>
<script>
  export default {
    name: 'AppFooter',
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
  

</script>
<style lang="scss">
  .footer{
    width: 100%;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 10px 0 200px;
    border: 1px solid #99a9bf;
    background-color: #fff;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
    strong {
      line-height: 25px;
      img {
        vertical-align: middle;
      }
    }
  }
  .closed {
    padding-left: 55px;
  }
  .pull-right {
    line-height: 25px;
    float: right;
    color: #606266;
    font-weight: 600;
  }
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
