<template>
  <div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="22">
        <el-select v-model="listQuery.key"
                   style="width: 10%"
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
          type="primary" plain
          @click="handleFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''"
          icon="el-icon-search">查询
        </el-button>
        <el-button
          icon="el-icon-search"
          type="primary" plain
          @click="handleExtFilter(1)"
          :disabled="listQuery.key === ''
            || listQuery.value === ''">相似</el-button>
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
        <el-table :data="list" ref="schoolTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="学校代码" width="110px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="名称" width="230px"></el-table-column>
          <el-table-column prop="levelsName" :show-overflow-tooltip="true" label="教育程度" width="65px"></el-table-column>
          <el-table-column prop="address" :show-overflow-tooltip="true" label="地址"></el-table-column>
          <el-table-column prop="master" :show-overflow-tooltip="true" label="负责人" width="120px"></el-table-column>
          <el-table-column prop="flagName" :show-overflow-tooltip="true" label="状态" width="65px"></el-table-column>
          <el-table-column prop="director" :show-overflow-tooltip="true" label="主管部门" width="160px"></el-table-column>
          <el-table-column prop="eqpid" :show-overflow-tooltip="true" label="设备编号">
            <template slot-scope="scope">
              <span v-for="eq in scope.row.eqpid">{{eq}} </span>
            </template>
          </el-table-column>
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
            <el-form-item label="学校代码" prop="id">
              <el-input v-model="temp.id" :maxlength="12"
                        :readonly="dialogStatus == 'update'"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" :maxlength="24"></el-input>
            </el-form-item>
            <el-form-item label="教育程度" prop="levels">
              <el-select v-model="temp.levels"
                         placeholder="请选择教育程度"
                         style="width: 100%">
                <el-option v-for="item in levelsOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="负责人" prop="master">
              <el-input v-model="temp.master" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="主管部门" prop="director">
              <el-input v-model="temp.director" :maxlength="24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model="temp.flag"
                         placeholder="请选择学校状态"
                         style="width: 100%">
                <el-option v-for="item in statusOption"
                           :key="item.key" :label="item.label" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="eqpid">
          <!--<el-select v-model="temp.eqpid"-->
                     <!--placeholder="请选择设备编号"-->
                     <!--multiple style="width: 100%">-->
            <!--<el-option v-for="item in eqpidOption"-->
                       <!--:key="item.key" :label="item.label" :value="item.key">-->
              <!--<span style="float: left">{{ item.key }}</span>-->
              <!--<span style="float: right; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.label }}</span>-->
            <!--</el-option>-->
          <!--</el-select>-->
          <el-tag
            :key="tag" closable
            size="medium"
            v-for="tag in temp.eqpid"
            @close="handleCloseTag(tag)">
            {{tag}}
          </el-tag>
          <el-input
            v-if="inputVisible"
            v-model="eqpInput"
            ref="saveTagInput"
            style="width: 110px"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"></el-input>
          <el-button
            v-else
            style="margin-left: 8px"
            @click="showEqpInput">+设备编号</el-button>
        </el-form-item>
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
                   :disabled="inputVisible === true"
                   @click="createData">保 存</el-button>
        <el-button type="primary" v-else
                   :disabled="inputVisible === true"
                   @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, fetchSearchOption, valueToLabel } from '@/api/table'
  import {validateOther} from "../../../../utils/validate";
  import { Message } from 'element-ui'

  export default {
    data() {
      //编号验证
      var checkID = (rule, value, callback) => {
        if (!validateOther(value)) {
          callback(new Error('只能输入数字和英文字母'));
        } else {
          callback();
        }
      };
      return {
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
        list: [],
        //行数
        currentRowIndex: -1,
        //-----添加/修改对话框--------
        //对话框状态
        dialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加学校',
          update: '修改学校'
        },
        //对话框内容
        temp: {
          id: '',
          name: '',
          levels: '',
          levelsName: '',
          address: '',
          master: '',
          director: '',
          flag: '',
          flagName: '',
          eqpid: [],
          descr: ''
        },
        //教育水平选项
        levelsOption: [],
        //学校状态选项
        statusOption: [],
        //设备编号选项
        eqpidOption: [],
        //标签输入框状态
        inputVisible: false,
        //标签输入框内容
        eqpInput: '',
        
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          id: [{required: true, message: '学校代码不能为空', trigger: 'blur'},
            {validator: checkID, trigger: 'change'}],
          name: [{required: true, message: '学校名称不能为空', trigger: 'blur'}],
          levels: [{required: true, message: '请选择教育程度', trigger: 'change'}],
          flag: [{required: true, message: '请选择学校状态', trigger: 'change'}],
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
      requestList (List){
        fetchList('/schoolHome', List).then( response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            Message.error(data.msg);
          }
          this.list = [];
          if(data.data){
            for(let i = 0; i < data.data.length; i++){
              let tempData = {};
              tempData.id = data.data[i][0];
              tempData.name = data.data[i][1];
              tempData.levels = data.data[i][2];
              tempData.levelsName = data.data[i][3];
              tempData.address = data.data[i][4];
              tempData.master = data.data[i][5];
              tempData.director = data.data[i][6];
              tempData.flag = data.data[i][7];
              tempData.flagName = data.data[i][8];
              tempData.eqpid = data.data[i][9];
              tempData.descr = data.data[i][10];
              this.list.push(tempData);
            }
            this.total = data.total;
          }else {
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
        if(this.listQuery.ext === 'like') {
          this.handleExtFilter(1);
        }else if(this.listQuery.method === 'Query') {
          this.handleFilter(1);
        }else if(this.listQuery.method === 'List') {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      //改变页面事件
      handlePageChange(val) {
        if(this.listQuery.ext === 'like') {
          this.handleExtFilter(val);
        }else if(this.listQuery.method === 'Query') {
          this.handleFilter(val);
        }else if(this.listQuery.method === 'List') {
          this.getList();
        }
      },
      //select获取焦点后请求数据
      handleFocus() {
        if(this.searchOption.length === 0) {
          fetchSearchOption('/schoolHome',{method: 'FieldSelect'})
            .then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.error(data.msg);
              }
              if(data.data){
                let keys = Object.keys(data.data);
                let values = Object.values(data.data);
                for(let i = 0; i < keys.length; i++) {
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
        if(this.levelsOption.length === 0) {
          fetchSearchOption('/schoolHome',{method: 'FieldLabel'})
            .then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.error(data.msg);
              }
              if(data.data){
                this.levelsOption = data.data.LEVELS;
                this.statusOption = data.data.FLAG;
              }
            })
        }
      },
      //关闭删除标签
      handleCloseTag(tag) {
        this.temp.eqpid.splice(this.temp.eqpid.indexOf(tag), 1);
      },
      //显示关闭输入框
      showEqpInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },
      //确认添加新标签
      handleInputConfirm() {
        let eqpInput = this.eqpInput;
        if(eqpInput) {
          if(this.temp.eqpid.indexOf(eqpInput) === -1){
            let eqpData = Object.assign({method: 'FieldVerify'}, {eqpid: eqpInput});
            SubmitTable('/schoolHome', eqpData).then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.info(data.msg);
              }
              if(data.id === '00000') {
                this.temp.eqpid.push(eqpInput)
              }
            });
          }else {
            Message.info('该设备编号已被使用，请重新输入');
          }
          
        }
        this.inputVisible = false;
        this.eqpInput = '';
      },
      //重置对话框内容
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          levels: 0,
          levelsName: '',
          address: '',
          master: '',
          director: '',
          flag: 0,
          flagName: '',
          eqpid: [],
          descr: ''
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
            this.temp.levelsName = valueToLabel(this.levelsOption, this.temp.levels);
            this.temp.flagName = valueToLabel(this.statusOption, this.temp.flag);
            var temp = Object.assign({method: 'Insert'}, this.temp);
            delete temp.levelsName;
            delete temp.flagName;
            SubmitTable('/schoolHome', temp).then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.info(data.msg);
              }
              if(data.id === '00000') {
                this.list.unshift(this.temp);
                this.dialogVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
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
        //eqpid不能为null
        if(this.temp.eqpid === null) {
          this.temp.eqpid = [];
        }
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
            this.temp.levelsName = valueToLabel(this.levelsOption, this.temp.levels);
            this.temp.flagName = valueToLabel(this.statusOption, this.temp.flag);
            let temp = Object.assign({method: 'Update'}, this.temp);
            delete temp.levelsName;
            delete temp.flagName;
            SubmitTable('/schoolHome', temp).then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                Message.info(data.msg);
              }
              if(data.id === '00000') {
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
                  duration: 2000
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
        if(this.temp.descr === null){
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
        SubmitTable('/schoolHome', deleteData).then(response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            Message.info(data.msg);
          }
          if(data.id === '00000') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
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

