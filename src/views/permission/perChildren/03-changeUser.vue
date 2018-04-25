<template>
  <div class="col-sm-8">
    <div class="box">
      <div class="box-header">
      </div>
      <div class="box-body">
        <!-- form start -->
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-xs-3 control-label">选择权限：</label>
            <div class="col-xs-8">
              <select v-model="add_users.selected" name="" class="form-control" disabled>
                <option value="0">--请选择权限--</option>
                <option value="1">班主任</option>
                <option value="2">设备管理员</option>
                <option value="3">信息编辑员</option>
              </select>
              <span class="text-red small" v-show="add_users.selected === '0'">必须选择一个权限</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">用户名：</label>
            <div class="col-xs-8">
              <input v-model="add_users.username"
                     type="text"
                     class="form-control"
                     @keyup="add_users.username = add_users.username.replace(/[^0-9A-Za-z_]/g,'')">
              <span class="text-red small" v-show="!userReg.test(add_users.username)">
                用户名必须由英文、数字或下划线组成，长度3到16位</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">密码：</label>
            <div class="col-xs-8">
              <input v-model="add_users.passwd"
                     type="password"
                     class="form-control">
              <span class="text-red small"
                    v-show="!passReg.test(add_users.passwd)">
                密码必须由至少1位英文、数字和特殊字符组成，长度3到16位</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">确认密码：</label>
            <div class="col-xs-8">
              <input v-model="add_users.passwd2"
                     type="password"
                     class="form-control">
              <span class="text-red small"
                    v-show="add_users.passwd2 !== '' && add_users.passwd2 !== add_users.passwd">
                两次密码输入不一致</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">连接数：</label>
            <div class="col-xs-8">
              <input v-model.number="add_users.maxcon"
                     type="number" class="form-control"
                     placeholder="--输入范围0-16,不能为空--">
              <span class="text-red small"
                    v-show="add_users.maxcon<0 || add_users.maxcon>16">输入错误，请检查</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">空闲期：</label>
            <div class="col-xs-8">
              <input v-model.number="add_users.idle"
                     type="number" class="form-control"
                     placeholder="--输入范围300-7200ms,不能为空--" step="100">
              <span class="text-red small"
                    v-show="add_users.idle<300 || add_users.idle>7200">输入错误，请检查</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">生存期：</label>
            <div class="col-xs-8">
              <input v-model.number="add_users.alive"
                     type="number"
                     class="form-control"
                     placeholder="--输入范围600-86400ms,不能为空--" step="100">
              <span class="text-red small" v-show="add_users.alive<600 || add_users.alive>86400">输入错误，请检查</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">选择状态：</label>
            <div class="col-xs-8">
              <select v-model="add_users.flag" name="" class="form-control">
                <option value="-2">--请选择状态--</option>
                <option value="-1">注销</option>
                <option value="0">正常</option>
                <option value="1">禁用</option>
              </select>
              <span class="text-red small" v-show="add_users.flag === '-2'">必须选择一个状态</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">找回密码方式：</label>
            <div class="col-xs-8">
              <textarea v-model.trim="add_users.way"
                        maxlength="32"
                        class="form-control" rows="4"
                        placeholder="email:abc.home.com|mobiel:13905770000|webchat:123_abc ...">
              </textarea>
              <span class="text-muted small">剩余可输入{{leftLength(32, add_users.way.length)}}个字符</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-3 control-label">说明：</label>
            <div class="col-xs-8">
              <textarea v-model.trim="add_users.descr"
                        maxlength="128"
                        class="form-control" rows="4">
              </textarea>
              <span class="text-muted small">剩余可输入{{leftLength(128, add_users.descr.length)}}个字符</span>
            </div>
          </div>
        
        </form>
      </div>
      <div class="box-footer text-center">
        <a href="#" class="btn btn-primary" style="margin-right: 30px" @click="addUsers">保存</a>
        <a href="#" class="btn btn-default" @click="$router.go(-1)">返回</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { getUserInfo } from '../../../api/login'
  export default {
    data () {
      return {
        add_users: {
          selected: '1',
          username: '',
          passwd: '',
          passwd2: '',
          maxcon: '2',
          idle: 1800,
          alive: 28800,
          flag: '0',
          way: '',
          descr: ''
        },
        userReg: /^[0-9A-Za-z_]{3,16}$/,
        passReg: /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!#$%&()*+,-.:;<=>?@\[\]^_`{|}~]).{3,16}$/,
      }
    },
    
    methods: {
      //textarea剩余长度计算
      leftLength (maxLength ,length) {
        return maxLength - length
      },
      //添加用户
      addUsers () {
        if(this.add_users.selected !== '0' &&
          this.userReg.test(this.add_users.username) &&
          this.passReg.test(this.add_users.passwd) &&
          this.add_users.passwd2 === this.add_users.passwd &&
          this.add_users.maxcon >= 0 && this.add_users.maxcon <=16 &&
          this.add_users.idle >= 300 && this.add_users.idle <= 7200 &&
          this.add_users.alive >= 600 && this.add_users.alive <= 86400 &&
          this.add_users.flag !== '-2') {
          
          var add_users = {
            selected: this.add_users.selected,
            username: this.add_users.username,
            password: this.add_users.passwd,
            maxcon: this.add_users.maxcon,
            idle: this.add_users.idle,
            alive: this.add_users.alive,
            flag: this.add_users.flag,
            way: this.add_users.way,
            descr: this.add_users.descr
          }
          //向后端请求
          console.log(add_users)
          getUserInfo(add_users)
            .then(response => {
              var data = response.data;
              if(data.msg && data.msg !== ''){
                alert(data.msg);
              }
              if(data.token_id){
                //登录成功后
                console.log(response)
              }
              
            });
        }
      }
    }
  }
</script>
