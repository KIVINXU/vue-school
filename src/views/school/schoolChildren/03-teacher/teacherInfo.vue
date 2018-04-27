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
        <el-table :data="list" border
                  ref="classTable"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="id" :show-overflow-tooltip="true" label="教师编号" width="100px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名" width="120px"></el-table-column>
          <el-table-column prop="sex" :show-overflow-tooltip="true" label="性别" width="50px"></el-table-column>
          <el-table-column prop="contact" :show-overflow-tooltip="true" label="联系方式" width="100px"></el-table-column>
          <el-table-column prop="contact2" :show-overflow-tooltip="true" label="联系方式2"></el-table-column>
          <el-table-column prop="address" :show-overflow-tooltip="true" label="联系住址" width="110px"></el-table-column>
          <el-table-column prop="schoolName" :show-overflow-tooltip="true" label="学校名称" width="160px"></el-table-column>
          <el-table-column prop="flagName" :show-overflow-tooltip="true" label="状态" width="70px"></el-table-column>
          <el-table-column prop="validity" :show-overflow-tooltip="true" label="合同效期" width="75px"></el-table-column>
          <el-table-column prop="id_type_name" :show-overflow-tooltip="true" label="证件类型"
                           width="65px"></el-table-column>
          <el-table-column prop="id_number" :show-overflow-tooltip="true" label="证件号" width="100px"></el-table-column>
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
            <el-form-item label="教师编号" prop="id">
              <el-input v-model="temp.id" :maxlength="18" :readonly="dialogStatus=='update'"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" :maxlength="16"
                        style="float: left;margin-right:10px;width:50%;min-width: 87px"></el-input>
              <el-radio-group v-model="temp.sex">
                <el-radio-button label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="temp.contact" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="联系方式2" prop="contact2">
              <el-input v-model="temp.contact2" :maxlength="32"></el-input>
            </el-form-item>
            <el-form-item label="联系住址" prop="address">
              <el-input v-model="temp.address" :maxlength="64"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="学校名称" prop="schoolid">
              <el-select v-model="temp.schoolid"
                         filterable=""
                         placeholder="请选择学校名称"
                         style="width: 100%">
                <el-option v-for="item in schoolidOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件类别" prop="id_type">
              <el-select v-model="temp.id_type"
                         placeholder="请选择证件类别"
                         style="width: 100%">
                <el-option v-for="item in id_typeOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码" prop="id_number">
              <el-input v-model="temp.ID_number" placeholder="请输入证件号码" :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="合同效期" prop="validity">
              <el-date-picker v-model="temp.validity" placeholder="请选择合同期限"
                              align="right" style="width: 100%"
                              type="date" format="MM/dd/yyyy" value-format="MM/dd/yyyy"
                              :editable=false>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model="temp.flag"
                         placeholder="请选择状态"
                         style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.key"
                           :label="item.label"
                           :value="item.key">
                </el-option>
              </el-select>
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
      <div slot="footer" style="height: 0; margin-top: -50px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, valueToLabel, labelToValue} from '@/api/table';
  import {validateTel, validateIdentity18, validatePassport, validateOther} from "../../../../utils/validate";
  import ElRow from "element-ui/packages/row/src/row";
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";

  export default {
    components: {
      ElRadioButton,
      ElRow
    },
    data() {
      //编号验证
      var checkID = (rule, value, callback) => {
        if (!validateOther(value)) {
          callback(new Error('只能输入数字和英文字母'));
        } else {
          callback();
        }
      }
      //电话号码验证
      var checkTel = (rule, value, callback) => {
        if (!validateTel(value)) {
          callback(new Error('请输入正确的手机或电话号码'))
        } else {
          callback()
        }
      };
      //证件号码验证
      var checkID_number = (rule, value, callback) => {
        if (this.temp.id_type === '0') {
          if (!validateIdentity18(value)) {
            callback(new Error('请输入正确的18位身份证号码'))
          } else {
            callback()
          }
        } else if (this.temp.id_type === '1') {
          if (!validatePassport(value)) {
            callback(new Error('请输入正确的护照号码'));
          } else {
            callback();
          }
        } else if (this.temp.id_type === '2') {
          if (!validateOther(value)) {
            callback(new Error('只能输入数字和英文字母'));
          } else {
            callback();
          }
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
          create: '添加教师',
          update: '修改教师'
        },
        //对话框内容
        temp: {
          id: '',
          name: '',
          sex: '',
          id_type: '',
          id_type_name: '',
          id_number: '',
          contact: '',
          contact2: '',
          address: '',
          schoolid: '',
          schoolName: '',
          validity: '',
          flag: '',
          flagName: '',
          descr: ''
        },
        sexOption: [
          {
            key:'男',
            label:'男'
          },
          {
            key:'女',
            label:'女'
          }
        ],
        //证件类型
        id_typeOption: [],
        //学校ID选项
        schoolidOption: [],
        //标志选项
        flagOption: [],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        deleteName: '',
        //内容验证规则
        rules: {
          id: [{required: true, message: '教师编号不能为空', trigger: 'blur'},
            {validator: checkID, trigger: 'blur'}],
          name: {required: true, message: '请输入教师姓名', trigger: 'blur'},
          sex: {required: true, message: '请选择性别', trigger: 'blur'},
          id_type: {required: true, message: '请选择证件类别', trigger: 'blur'},
          id_number: [{validator: checkID_number, trigger: 'change'}],
          contact: [{required: true, message: '请输入联系方式', trigger: 'blur'},
            {validator: checkTel, trigger: 'change'}],
          schoolid: {required: true, message: '请选择所属学校名称', trigger: 'blur'},
          flag: {required: true, message: '请选择教师状态', trigger: 'blur'},

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
        fetchList('/teacherHome', List).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            Message.error(data.msg);
          }
          this.list = [];
          if (data.data) {
            for (let i = 0; i < data.data.length; i++) {
              let tempData = {};
              tempData.id = data.data[i][0];
              tempData.name = data.data[i][1];
              tempData.sex = data.data[i][2];
              tempData.id_type = data.data[i][3];
              tempData.id_type_name = data.data[i][4];
              tempData.id_number = data.data[i][5];
              tempData.contact = data.data[i][6];
              tempData.contact2 = data.data[i][7];
              tempData.address = data.data[i][8];
              tempData.schoolid = data.data[i][9];
              tempData.schoolName = data.data[i][10];
              tempData.validity = data.data[i][11];
              tempData.flag = data.data[i][12];
              tempData.flagName = data.data[i][13];
              tempData.descr = data.data[i][14];
              this.list.push(tempData);
            }
            this.total = data.total;
          } else {
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
          fetchSearchOption('/teacherHome', {method: 'FieldSelect'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                Message.error(data.msg);
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
        if (this.levelsOption.length === 0) {
          fetchSearchOption('/teacherHome', {method: 'FieldLabel'})
            .then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                Message.error(data.msg);
              }
              if (data.data) {
                this.id_typeOption = data.data.ID_TYPE;
                this.schoolidOption = data.data.SCHOOLID;
                this.flagOption = data.data.FLAG;
              }
            });
        }
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          sex: '男',
          id_type: '0',
          id_type_name: '',
          id_number: '',
          contact: '',
          contact2: '',
          address: '',
          schoolid: '',
          schoolName: '',
          validity: '',
          flag: '0',
          flagName: '',
          descr: ''
        }
      },
      //添加对话框
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogVisible = true;
        this.handleOption();
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //添加完毕上传
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id_type_name = valueToLabel(this.id_typeOption, this.temp.id_type);
            this.temp.schoolName = valueToLabel(this.schoolIDOption, this.temp.schoolID);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            var temp = Object.assign({method: 'Insert'}, this.temp);
            delete temp.schoolName;
            delete temp.flagName;
            SubmitTable('/teacherHome', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                Message.info(data.msg);
              }
              if (data.id === '00000') {
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
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.handleOption();
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id_type_name = valueToLabel(this.id_typeOption, this.temp.id_type);
            this.temp.schoolName = valueToLabel(this.schoolIDOption, this.temp.schoolID);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            let temp = Object.assign({method: 'Update'}, this.temp);
            delete temp.schoolName;
            delete temp.flagName;
            SubmitTable('/teacherHome', temp).then(response => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                Message.info(data.msg);
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
        SubmitTable('/teacherHome', deleteData).then(response => {
          const data = response.data;
          if (data.msg && data.msg !== '') {
            Message.info(data.msg);
          }
          if (data.id === '00000') {
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
