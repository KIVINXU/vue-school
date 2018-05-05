<template>
  <div>
    <el-row class="el-table-margin">
      <el-col :span="16" :offset="5">
        <el-select v-model="listQuery.key"
                   style="width: 14%"
                   @focus="handleFocus"
                   placeholder="查询对象">
          <el-option
            v-for="item in searchOption"
            :key="item.key"
            :label="item.label"
            :value="item.key">
          </el-option>
        </el-select>
        <el-input placeholder="请输入查询内容"
                  style="width: 30%;"
                  clearable
                  :disabled="listQuery.key === ''"
                  v-model.trim="listQuery.value"
                  @clear="getList()"
                  @keyup.enter.native="handleFilter(1)">
        </el-input>
        <el-button
          type="info" plain
          @click="handleFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''"
          icon="el-icon-search">查询
        </el-button>
        <el-button
          icon="el-icon-search"
          type="info" plain
          @click="handleExtFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''">相似
        </el-button>
      </el-col>
      <el-col :span="2">
        <el-dropdown>
          <el-button type="primary">
            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-plus"
                         @click="handleCreate">
                添加
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(list[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex)"
                         :disabled="currentRowIndex === -1">
                删除
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
        <el-table :data="list" ref="userTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="username" :show-overflow-tooltip="true" label="登陆用户" width="120px"></el-table-column>
          <el-table-column prop="maxcon" :show-overflow-tooltip="true" label="最大连接数" width="75px"></el-table-column>
          <el-table-column prop="curcon" :show-overflow-tooltip="true" label="当前连接数" width="100px"></el-table-column>
          <el-table-column prop="idle" :show-overflow-tooltip="true" label="空闲期/s" width="70px"></el-table-column>
          <el-table-column prop="alive" :show-overflow-tooltip="true" label="生存期/s" width="70px"></el-table-column>
          <el-table-column prop="flagname" :show-overflow-tooltip="true" label="状态" width="120px">
          </el-table-column>
          <el-table-column prop="way" :show-overflow-tooltip="true" label="找回密码方式"></el-table-column>
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
      <span><i class="el-icon-warning"></i>是否确认删除名称为【{{deleteName}}】的数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, list)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]"
               :visible.sync="dialogVisible"
               top="10px">
      <el-form ref="dataForm" :rules="rules"
               :model="temp"
               style="margin-top: -30px"
               label-position="right"
               label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="登陆用户" prop="username">
              <el-input v-model="temp.username" :maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码" prop="passwd">
              <el-input v-model="temp.passwd" :maxlength="16" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwd2">
              <el-input v-model="temp.passwd2" :maxlength="16" type="password"></el-input>
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
            <el-form-item label="找回密码方式" prop="way">
              <el-input v-model="temp.way" :maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="flagValue">
              <el-select v-model="temp.flag"
                         placeholder="请选择学校状态"
                         filterable remote
                         style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="禁止时间/m" prop="flag" v-if="flagValue >= 1">
              <el-input v-model="temp.flag" placeholder="输入禁止时间" :maxlength="5" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                    :autosize="{ minRows: 1, maxRows: 4 }">
          </el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
        </el-form-item>
      </el-form>
      <div slot="footer" style="height: 0; margin-top: -70px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   v-if="dialogStatus === 'create'"
                   @click="createData">保 存
        </el-button>
        <el-button type="primary" v-else
                   @click="updateData">保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel} from '@/api/table';
  import {
    isvalidPassword,
    isvalidUsername,
    validateTel,
    validateMail,
    validateWehat,
    validateNum
  } from "../../../utils/validate";

  export default {
    data() {
      //用户名验证
      const checkUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('3-16位,由数字和大小写字母组成'))
        } else {
          callback();
        }
      };
      //登陆密码验证
      const checkPassword = (rule, value, callback) => {
        if (!isvalidPassword(value)) {
          callback(new Error('3-16位,特殊字符,字母,数字都至少一位'))
        } else {
          callback();
        }
      };
      //二次密码验证
      const checkPass = (rule, value, callback) => {
        if (!value) {
          // callback(new Error('请再次输入密码'));
          callback();
        } else if (value !== this.temp.passwd) {
          callback(new Error('两次输入密码不一致！'))
        } else {
          callback();
        }
      };
      //最大连接数限制
      const checkMaxcon = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if (value < 0 || value > 16) {
          callback(new Error('限制3-16,默认2'))
        } else {
          callback();
        }
      };
      //空闲期限制
      const checkIdle = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if (value < 300 || value > 7200) {
          callback(new Error('限制300s-7200s,默认1800s'))
        } else {
          callback();
        }
      };
      //生存期限制
      const checkAlive = (rule, value, callback) => {
        if (!validateNum(value)) {
          callback(new Error('只能输入纯数字'));
        } else if (value < 600 || value > 86400) {
          callback(new Error('限制600s-86400s,默认28800s'))
        } else {
          callback();
        }
      };
      //状态修改    flagValue
      const checkFlagValue = (rule, value, callback) => {
        if (this.flagValue == '1' && this.temp.flag > 0) {
          //当状态为禁止，且flag大于0的时候使两者值相等
          callback();
        } else {
          this.temp.flag = this.flagValue;
          callback();
        }
      };
      //禁止时间限制 flag
      const checkFlag = (rule, value, callback) => {
        if (this.flagValue === '1') {
          //当状态为禁止时要求flag在1-43200之间
          if (!validateNum(value)) {
            callback(new Error('只能输入纯数字'));
          } else if (value < 1 || value > 43200) {
            callback(new Error('禁止时间限制0m-43200m,默认1m'))
          } else {
            callback()
          }
        } else {
          callback();
        }
      };
      //找回密码方式验证
      const checkWay = (rule, value, callback) => {
        if(value){
          if (!validateTel(value) && !validateMail(value) && !validateWehat(value)) {
            callback(new Error('请输入正确的邮箱、手机或微信号'))
          } else {
            callback();
          }
        }else{//允许为空
          callback();
        }
      };
      return {
        //弹框一次性数据
        flagValue: '',
        //搜索内容
        listQuery: {
          method: '',
          page: 1,
          limit: 20,
          ext: undefined,
          key: '',  //查询对象的key值
          value: ''  //查询对象内容
        },
        //总条目数
        total: 0,
        searchOption: [],
        //加载图标
        listLoading: true,
        list: [{
          username: 'adva',
          passwd: 'sdasdasdasdax',
          maxcon: '1',
          curcon: '2',
          idle: '3',
          alive: '1',
          flag: '1',
          flagName: 'sdasd',
          way: 'weixin',
          descr: '',
        }],
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
        //状态选项
        flagOption: [],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          username: [{required: true, message: '登录用户名不能为空', trigger: 'blur'},
            {validator: checkUsername, trigger: 'change'}],
          passwd: [{required: true, message: '登录密码不能为空', trigger: 'blur'},
            {validator: checkPassword, trigger: 'blur'}],
          passwd2: [
            {validator: checkPass, trigger: 'blur'}],
          maxcon: [{required: true, message: '最大连接数不能为空', trigger: 'blur'},
            {validator: checkMaxcon, trigger: 'change'}],
          idle: [{required: true, message: '空闲期不能为空', trigger: 'blur'},
            {validator: checkIdle, trigger: 'change'}],
          alive: [{required: true, message: '生存期不能为空', trigger: 'blur'},
            {validator: checkAlive, trigger: 'change'}],
          flagValue: [
            {validator: checkFlagValue, trigger: 'change'},],
          flag: [{required: true, message: '禁止时间不能为空', trigger: 'blur'},
            {validator: checkFlag, trigger: 'change'},],
          way: [
            {validator: checkWay, trigger: 'change'},],
        },
      }
    },
    created() {
      this.getList();
    },
    watch: {
      $route() {
        this.getList();
      }
    },
    methods: {
      //请求后台
      requestList(List) {
        fetchList('/SuserHome', List).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              message: data.msg,
              type: 'error',
              duration: 2000,
              showClose:true
            });
          }
          if (data.data) {
            this.list = data.data;
            this.total = data.total;
          } else {
            this.list = [];
            this.total = 0;
          }
        })
      },
      //获取列表
      getList() {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'List';
        this.requestList(this.listQuery);
      },
      //直接查询
      handleFilter(val) {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'Query';
        this.listQuery.page = val;
        this.requestList(this.listQuery);
      },
      //相似查询
      handleExtFilter(val) {
        this.listQuery.ext = 'like';
        this.listQuery.method = 'Query';
        this.listQuery.page = val;
        this.requestList(this.listQuery);
      },
      //改变显示条目
      handleSizeChange(size) {
        this.listQuery.limit = size;
        if (this.listQuery.ext === 'like') {
          this.handleExtFilter(1);
        } else if (this.listQuery.method === 'Query') {
          this.handleFilter(1);
        } else if (this.listQuery.method === 'List') {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      //改变页面事件
      handlePageChange(val) {
        if (this.listQuery.ext === 'like') {
          this.handleExtFilter(val);
        } else if (this.listQuery.method === 'Query') {
          this.handleFilter(val);
        } else if (this.listQuery.method === 'List') {
          this.getList();
        }
      },
      //select获取焦点后请求数据
      handleFocus() {
        if (this.searchOption.length === 0) {
          fetchSearchOption('/SuserHome', {method: 'FieldSelect'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  message: data.msg,
                  type: 'error',
                  duration: 2000,
                  showClose:true
                });
              }
              if (data.data) {
                let keys = Object.keys(data.data);
                let values = Object.values(data.data);
                for (let i = 0; i < keys.length; i++) {
                  let optionObj = {};
                  optionObj.key = keys[i];
                  optionObj.label = values[i];
                  this.searchOption.push(optionObj);
                }
              }
            })
        }
      },
      //打开弹出框select请求数据
      handleOption() {
        if (this.flagOption.length === 0) {
          fetchSearchOption('/SuserHome', {method: 'FieldLabel'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  message: data.msg,
                  type: 'error',
                  duration: 2000,
                  showClose:true
                });
              }
              if (data.data) {
                this.flagOption = data.data.FLAG;
              }
            })
        }
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
        this.handleOption();
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
            this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            var temp = Object.assign({method: 'Insert'}, this.temp);
            delete temp.levelsname;
            delete temp.flagname;
            SubmitTable('/SuserHome', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  message: data.msg,
                  type: 'info',
                  duration: 2000,
                  showClose:true
                });
              }
              if (data.id === '00000') {
                this.list.unshift(this.temp);
                this.dialogVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000,
                  showClose:true
                });
                this.total += 1;
              }
            });
          }
        })
      },
      //修改对话框
      handleUpdate(row) {
        this.temp = Object.assign({}, row);
        this.temp.flag > 0 ? this.flagValue = '1' : this.flagValue = this.temp.flag;
        this.handleOption();
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
            this.temp.flagname = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Update'}, this.temp);
            delete temp.levelsname;
            delete temp.flagname;
            SubmitTable('/SuserHome', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  message: data.msg,
                  type: 'info',
                  duration: 2000,
                  showClose:true
                });
              }
              if (data.id === '00000') {
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v);
                    this.list.splice(index, 1, this.temp);
                    break;
                  }
                }
                this.dialogVisible = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000,
                  showClose:true
                });
              }
            });
          }
        });

      },

      //获取index
      handleCurrentChange(val) {
        this.currentRowIndex = this.list.indexOf(val);
      },
      //descr剩余长度计算
      leftLength() {
        if (this.temp.descr === null) {
          this.temp.descr = '';
        }
        return 128 - this.temp.descr.length
      },
      //删除行
      handleDelete(index) {
        this.deleteDialogVisible = true;
        this.deleteName = this.list[index].name
      },
      rowDelete(index, row) {
        var deleteData = Object.assign({method: 'Delete'}, {id: this.list[index].id});
        SubmitTable('/SuserHome', deleteData).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            this.$message({
              message: data.msg,
              type: 'info',
              duration: 2000,
              showClose:true
            });
          }
          if (data.id === '00000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000,
            });
            row.splice(index, 1);
            this.deleteDialogVisible = false;
            this.total -= 1;
          }
        });
      },
    }
  }

</script>

