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
                添加教师
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(teacherInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改教师
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, teacherInfo)"
                         :disabled="currentRowIndex === -1">
                删除教师
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
        <el-table :data="teacherInfo" ref="teacherTable"
                  border highlightCurrentRow
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
      <span><i class="el-icon-warning"></i>是否确认删除这行数据？确认删除后，将不能恢复！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rowDelete(currentRowIndex, teacherInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="教师编号" prop="id">
              <el-input v-model="temp.id" :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="temp.name" :maxlength="16"
                        style="float: left;margin-right:10px;width:50%;min-width: 87px"></el-input>
              <el-radio-group v-model="temp.sex">
                <el-radio-button label="M">男</el-radio-button>
                <el-radio-button label="F">女</el-radio-button>
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
              <el-select v-model="temp.schoolid" filterable="" placeholder="请选择学校名称" style="width: 100%">
                <el-option v-for="item in schoolidOption"
                           :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件类别" prop="id_type">
              <el-select v-model="temp.id_type" placeholder="请选择证件类别" style="width: 100%">
                <el-option v-for="item in id_typeOption"
                           :key="item.value" :label="item.label" :value="item.value">
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
                              :editable = false>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model="temp.flag" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in flagOption"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明" prop="descr">
          <el-input v-model.trim="temp.descr" :maxlength="128" type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"></el-input>
          <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
        </el-form-item>
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
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 1,
        searchOption: [
          {key: '1', label: '教师编号'},
          {key: '2', label: '联系方式'},
          {key: '3', label: '班级编号'}
        ],
        //加载图标
        listLoading: true,
        teacherInfo: [
          {
            id: '12345678900',
            name: '王安石',
            sex: '男',
            id_type: '0',
            id_type_name: '身份证',
            id_number: '140601197805287304',
            contact: '13758755555',
            contact2: '12345678900@126.com',
            address: '温州市鹿城区高新路5号三楼',
            schoolid: 's1001',
            schoolName: '温州市鹿城区第三小学',
            validity: '12/28/2018',
            flag: '0',
            flagName: '正常',
            descr: '11'
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
            value: 'M',
            label: '男',
          },
          {
            value: 'F',
            label: '女',
          },
        ],
        //证件类型
        id_typeOption: [
          {
            value: '0',
            label: '身份证'
          },
          {
            value: '1',
            label: '护照'
          },
          {
            value: '2',
            label: '其他'
          },
        ],
        //学校ID选项
        schoolidOption: [
          {
            value: 's1001',
            label: '温州市鹿城区第三小学'
          },
          {
            value: 's1002',
            label: '温州市鹿城区第八中学'
          },
        ],
        //标志选项
        flagOption: [
          {
            value: '0',
            label: '正常'
          },
          {
            value: '1',
            label: '休假'
          },
          {
            value: '2',
            label: '退休'
          },
          {
            value: '3',
            label: '离职'
          },
        ],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
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
    methods: {
      //获取列表
      getList() {
        // this.listLoading = true;
        // fetchList('/teacherInfo', this.listQuery).then( response => {
        //   this.teacherInfo = response.data.teacherInfo;
        //   this.total = response.data.total;
        //   this.listLoading = false;
        // })
      },
      //搜索内容
      handleSearch() {
        console.log('搜索')
      },
      resetTemp() {
        this.temp = {
          id: '',
          name: '',
          sex: 'M',
          id_type: '0',
          id_type_name: '',
          id_number: '',
          contact: '',
          contact2: '',
          address: '',
          schoolid: '',
          schoolName: '',
          validity:'',
          flag: '',
          flagName: '',
          descr: ''
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
//            SubmitTable('/teacherInfo', this.temp).then(() => {
//              this.teacherInfo.unshift(this.temp);
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
            this.temp.sex = valueToLabel(this.sexOption, this.temp.sex);
            this.temp.id_type_name = valueToLabel(this.id_typeOption, this.temp.id_type);
            this.temp.schoolName = valueToLabel(this.schoolidOption, this.temp.schoolid);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            //添加到表格
            console.log(this.temp);
            this.teacherInfo.push(this.temp);
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
        this.temp.sex = labelToValue(this.sexOption, this.temp.sex);
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
//            SubmitTable('/teacherInfo', this.temp).then(() => {
//
//            })
            this.temp.sex = valueToLabel(this.sexOption, this.temp.sex);
            this.temp.id_type_name = valueToLabel(this.id_typeOption, this.temp.id_type);
            this.temp.schoolName = valueToLabel(this.schoolidOption, this.temp.schoolid);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            for (const v of this.teacherInfo) {
              if (v.id === this.temp.id) {
                const index = this.teacherInfo.indexOf(v);
                this.teacherInfo.splice(index, 1, this.temp);
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
        this.currentRowIndex = this.teacherInfo.indexOf(val);
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
          this.total = this.total - 1;
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

