<template>
  <div>
    <el-row type="flex" justify="space-between" style="margin-bottom: 10px">
      <el-col :xs="18" :sm="18" :md="10" :lg="8">
        <el-input placeholder="请输入查询内容">
          <el-select v-model="listQuery.option" placeholder="查询对象" slot="prepend" style="width: 100px">
            <el-option
              v-for="item in searchOption"
              :key="item.key"
              :label="item.label"
              :value="item.key">
            </el-option>
          </el-select>
          <el-button
            type="primary"
            @click="handleSearch"
            icon="el-icon-search" slot="append">
          </el-button>
        </el-input>
      </el-col>
      <el-col :xs="5" :sm="3" :md="4" :lg="2">
        <el-dropdown>
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="handleCreate">
                添加用户
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(userInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改用户
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, userInfo)"
                         :disabled="currentRowIndex === -1">
                删除用户
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-upload">
                导入
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" icon="el-icon-download">
                导出
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="userInfo" ref="schoolTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="username" :show-overflow-tooltip="true" label="登陆用户" width="120px"></el-table-column>
          <el-table-column prop="maxcon" :show-overflow-tooltip="true" label="最大连接数" width="75px"></el-table-column>
          <el-table-column prop="curcon":show-overflow-tooltip="true" label="当前连接数" width="100px"></el-table-column>
          <el-table-column prop="idle" :show-overflow-tooltip="true" label="空闲期/s" width="70px"></el-table-column>
          <el-table-column prop="alive" :show-overflow-tooltip="true" label="生存期/s" width="70px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" label="状态" width="120px">
            <template slot-scope="scope">
              {{scope.row.flag > 0 ? scope.row.flagName + "  " + scope.row.flag + "  分钟" : scope.row.flagName}}
            </template>
          </el-table-column>
          <el-table-column prop="way" :show-overflow-tooltip="true" label="密保方式"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="说明"></el-table-column>
        </el-table>
        <!--分页条-->
        <el-pagination
          style="margin-top: 10px;margin-left: -9px;"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[20,50,100]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!--删除-->
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
      <span><i class="el-icon-warning"></i>是否确认删除这行数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, userInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="登陆用户" prop="username">
              <el-input v-model="temp.username" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码" prop="passwd">
              <el-input v-model="temp.passwd" :maxlength="16" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwd2">
              <el-input v-model="temp.passwd2" :maxlength="16" type="password" ></el-input>
            </el-form-item>
            <el-form-item label="最大连接数" prop="maxcon">
              <el-input v-model="temp.maxcon" :maxlength="2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="空闲期/s" prop="idle">
              <el-input v-model="temp.idle" :maxlength="4"></el-input>
            </el-form-item>
            <el-form-item label="生存期/s" prop="alive">
              <el-input v-model="temp.alive" :maxlength="5"></el-input>
            </el-form-item>
            <el-form-item label="密保方式" prop="way">
              <el-input v-model="temp.way" :maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="flagValue">
              <el-select v-model="flagValue" placeholder="请选择学校状态"
                         filterable remote style="width: 100%" >
                <el-option v-for="item in statusOption"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁止时间/m" prop="flag" v-if="flagValue >= 1">
              <el-input v-model="temp.flag" placeholder="输入禁止时间" :maxlength="5" type = "number" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 1, maxRows: 4 }">
          </el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
        </el-form-item>
        <!--{{temp.flag +"/" + flagValue}}-->
      </el-form>
      <div slot="footer" style="height: 0; margin-top: -70px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, valueToLabel, labelToValue} from '@/api/table';
  import {isvalidPassword,isvalidUsername,validateTel,validateMail,validateWehat,validateNum} from "../../../utils/validate";

  export default {
    data() {
      //用户名验证
      var checkUsername = (rule, value, callback) => {
        if(!isvalidUsername(value)){
          callback(new Error('3-16位,由数字和大小写字母组成'))
        }else{
          callback();
        }
      };
      //登陆密码验证
      var checkPassword = (rule, value, callback) => {
        if(!isvalidPassword(value)){
          callback(new Error('3-16位,特殊字符,字母,数字都至少一位'))
        }else{
          callback();
        }
      };
      //二次密码验证
      var checkPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.temp.passwd) {
          callback(new Error('两次输入密码不一致！'))
        } else {
          callback();
        }
      };
      //最大连接数限制
      var checkMaxcon = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if(value < 0 || value > 16){
          callback(new Error('限制3-16,默认2'))
        }else{
          callback();
        }
      };
      //空闲期限制
      var checkIdle = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if(value < 300 || value > 7200){
          callback(new Error('限制300s-7200s,默认1800s'))
        }else{
          callback();
        }
      };
      //生存期限制
      var checkAlive = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if(value < 600 || value > 86400){
          callback(new Error('限制600s-86400s,默认28800s'))
        }else{
          callback();
        }
      };
      //状态修改    flagValue
      var checkFlagValue = (rule, value, callback) => {
        if(this.flagValue == '1' && this.temp.flag > 0){
          //当状态为禁止，且flag大于0的时候使两者值相等
          callback();
        }else{
         this.temp.flag = this.flagValue;
          callback();
        }
      };
      //禁止时间限制 flag
      var checkFlag = (rule, value, callback) => {
        if(this.flagValue ==='1'){
          //当状态为禁止时要求flag在1-43200之间
          if (!validateNum(value)) {
            callback(new Error('只能输入纯数字'));
          } else if(value < 1 || value > 43200){
            callback(new Error('禁止时间限制0m-43200m,默认1m'))
          }else{
            callback()
          }
        }else{
          callback();
        }
      };
      //密保方式验证
      var checkWay = (rule, value, callback) => {
        if(!validateTel(value) && !validateMail(value) && !validateWehat(value)){
          callback(new Error('请输入正确的邮箱、手机或微信号'))
        }else{
          callback();
        }
      };
      return {
        //弹框一次性数据
        flagValue: '',
        //搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 1,
        searchOption: [
          {key: '1', label: '学校代号'},
          {key: '2', label: '学校名称'},
          {key: '3', label: '学校类型'}
        ],
        //加载图标
        listLoading: true,
        userInfo: [
          {
            username: 'test2',
            passwd: 'a.1',
            maxcon: '12',
            curcon: '1',
            idle: '1800',
            alive: '28800',
            flag: '5',
            flagName: '禁止',
            // changer: '',
            way: '13905770000',
            descr: '',
          },
        ],
        statusOption: [
          {
            value: '-1',
            label: '注销',
          },
          {
            value: '0',
            label: '正常',
          },
          {
            value: '1',
            label: '禁止',
          },
        ],
        //行数
        currentRowIndex: -1,
        //-----添加/修改对话框--------
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加用户',
          update: '修改用户'
        },
        //对话框内容
        temp: {
          username: '',
          passwd: '',
          maxcon: '',
          curcon: '',
          idle: '',
          alive: '',
          flag: '',
          flagName: '',
          // changer: '',
          way: '',
          descr: '',
        },
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          username: [{required: true, message: '登录用户名不能为空', trigger: 'blur'},
            {validator: checkUsername, trigger: 'change'}],
          passwd: [{required: true, message: '登录密码不能为空', trigger: 'blur'},
            {validator: checkPassword, trigger: 'blur'}],
          passwd2: [{required: true, message: '确认密码不能为空', trigger: 'blur'},
            {validator: checkPass, trigger: 'blur'}],
          maxcon:[{required: true, message: '最大连接数不能为空',trigger: 'blur'},
            {validator: checkMaxcon, trigger: 'change'}],
          idle:[{required: true, message: '空闲期不能为空',trigger: 'blur'},
            {validator: checkIdle, trigger: 'change'}],
          alive:[{required: true, message: '生存期不能为空',trigger: 'blur'},
            {validator: checkAlive, trigger: 'change'}],
          flagValue: [
            {validator: checkFlagValue, trigger: 'change'},],
          flag: [{required: true, message: '禁止时间不能为空',trigger: 'blur'},
            {validator: checkFlag, trigger: 'change'},],
          way:[
            {validator: checkWay, trigger: 'change'},],
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      //获取列表
      getList() {
//        this.listLoading = true;
//        fetchList('/userInfo', this.listQuery).then( response => {
//          this.userInfo = response.data.userInfo;
//          this.total = response.data.total;
//          this.listLoading = false;
//        })
      },
      //搜索内容
      handleSearch() {
        console.log('搜索')
      },
      resetTemp() {
        this.flagValue = '0';
        this.temp = {
          username: '',
          passwd: '',
          maxcon: '2',
          curcon: '0',
          idle: '1800',
          alive: '28800',
          flag: '0',
          flagName: '正常',
          // changer: '0',
          way: '',
          descr: '',
        }
      },
      //添加对话框
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //添加完毕上传
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable('/userInfo', this.temp).then(() => {
//              this.userInfo.unshift(this.temp);
//              this.dialogVisible = false;
//              this.$notify({
//                title: '成功',
//                message: '创建成功',
//                type: 'success',
//                duration: 2000
//              })
//            })
            this.total = this.total + 1;
            //通过select的value值找到label的值，显示给用户
            this.temp.flagName = '禁止';
              // valueToLabel(this.statusOption, this.temp.flagValue);
            //添加到表格
            this.userInfo.push(this.temp);
            this.dialogVisible = false;
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }
        })
      },
      //修改对话框
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.temp.flag > 0 ? this.flagValue = '1' : this.flagValue = this.temp.flag;
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable('/userInfo', this.temp).then(() => {
//
//            })
            this.temp.flagName = valueToLabel(this.statusOption, this.flagValue);
            for (const v of this.userInfo) {
              if (v.username === this.temp.username) {
                const index = this.userInfo.indexOf(v);
                this.userInfo.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogVisible = false;
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }
        });

      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.userInfo.indexOf(val);
      },
      //改变显示条目
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      //改变页面事件
      handlePageChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      //descr剩余长度计算
      leftLength() {
        return 128 - this.temp.descr.length
      },
      //删除行
      handleDelete() {
        this.deleteDialogVisible = true;
      },
      rowDelete(index, row) {
        if (index !== -1) {
          this.total = this.total - 1,
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000,
            });
          row.splice(index, 1);
          this.deleteDialogVisible = false;
        }
      },
    }
  }

</script>

