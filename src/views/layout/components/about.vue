<template>
  <div class="about">
    <el-row>
      <el-col :xs="4" :sm="7" :md="7" :lg="7" >
        <img src="../../../assets/applogo.png" width="100%">
      </el-col>
      <el-col :xs="20" :sm="17" :md="17" :lg="17">
        <el-form ref="aboutForm" :model="temp" class="aboutForm"
                 style="margin-top: -30px" label-position="right" label-width="100px">
          <el-form-item label="名称">{{temp.appName}}</el-form-item>
          <el-form-item label="版本">{{temp.appVer}}</el-form-item>
          <el-form-item label="描述">{{temp.appDesc}}</el-form-item>
          <el-form-item label="CPU">{{temp.CPU}}</el-form-item>
          <el-form-item label="内存">{{"总量:" + temp.total + "  MB,可用:" + temp.free + "  MB"}}</el-form-item>
          <el-form-item label="操作系统">{{temp.OS}}</el-form-item>
          <el-form-item label="WebServer">{{temp.WEB}}</el-form-item>
          <el-form-item label="推荐浏览器">{{temp.brower}}</el-form-item>
          <!--格式："总量:10   MB   可用:9   MB"-->
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="right">
        Copyright ©2018 浙江帝杰曼信息科技股份有限公司
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import request from '@/utils/request'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        temp: {
          appName: '',
          appVer: '',
          appDesc: '',
          WEB: '',
          OS: '',
          CPU: '',
          total: '',
          free: '',
          brower:'谷歌浏览器/火狐浏览器/360浏览器/IE9.0+',
        }
      }
    },
    created() {
      this.reqWEB();
      this.reqOther();
    },
    methods: {
      //获取WEB
      reqWEB(){
//        var req = new XMLHttpRequest();
//        req.open('GET', document.location, false);
//        req.send();
//        var message = req.getResponseHeader('WEB');
//        if (message){
//          this.temp.WEB = message;
//        }else{
//          this.temp.WEB = 'Unknow';
//        }
        request({
          url: document.location,
          method: 'get'
        }).then(response => {
          this.temp.WEB = response.headers['server'];
          if(this.temp.WEB === ''){
            this.temp.WEB = 'Unknow'
          }
        })
      },
      //获取其他数据
      reqOther() {
        request({url:'/about',method: 'post'}).then( response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            Message.error(data.msg);
          }
          this.temp.appName = data.appName;
          this.temp.appVer = data.appVer;
          this.temp.appDesc = data.appDesc;
          this.temp.OS = data.OS;
          this.temp.CPU = data.CPU;
          this.temp.total = data.total;
          this.temp.free = data.free;
        })
      }
    }
  }
</script>

<style scoped>
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 0px;
  }
  .right {
    font-size: 14px;
    color: grey;
    text-align: center;
    margin-top: 20px;
  }
</style>
