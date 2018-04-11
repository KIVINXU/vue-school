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
                添加学生
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(studentInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改学生
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, studentInfo)"
                         :disabled="currentRowIndex === -1">
                删除学生
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
        <el-table :data="studentInfo" ref="studentTable"
                  border highlightCurrentRow
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column type="expand" width="20px">
            <template slot-scope="props">
              <el-form class="demo-table-expand" label-position="right">
                <el-row>
                  <el-col :sm="5">
                    <el-form-item label="父亲" style="margin-bottom: 0;"><span>{{ props.row.father}}</span></el-form-item>
                  </el-col>
                  <el-col :sm="4">
                    <el-form-item label="电话" style="margin-bottom: 0;"><span>{{ props.row.fa_contact }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="5">
                    <el-form-item label="单位" style="margin-bottom: 0;"><span>{{ props.row.fa_company }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="3">
                    <el-form-item label="证件" style="margin-bottom: 0;"><span>{{ props.row.fa_id_type_name }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6">
                    <el-form-item label="证件号" style="margin-bottom: 0;"><span>{{ props.row.fa_id_number }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :sm="5">
                    <el-form-item label="母亲" style="margin-bottom: 0;"><span>{{ props.row.mother}}</span></el-form-item>
                  </el-col>
                  <el-col :sm="4">
                    <el-form-item label="电话" style="margin-bottom: 0;"><span>{{ props.row.mo_contact }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="5">
                    <el-form-item label="单位" style="margin-bottom: 0;"><span>{{ props.row.mo_company }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="3">
                    <el-form-item label="证件" style="margin-bottom: 0;"><span>{{ props.row.mo_id_type_name }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6">
                    <el-form-item label="证件号" style="margin-bottom: 0;"><span>{{ props.row.fa_id_number }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="id" :show-overflow-tooltip="true" label="学生编号（证件号码）" width="150px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="姓名"></el-table-column>
          <el-table-column prop="D_OF_B" :show-overflow-tooltip="true" label="出生日期"></el-table-column>
          <el-table-column prop="sex" :show-overflow-tooltip="true" label="性别"></el-table-column>
          <el-table-column prop="flagName" :show-overflow-tooltip="true" label="状态"></el-table-column>
          <el-table-column prop="address" :show-overflow-tooltip="true" label="住址"></el-table-column>
          <el-table-column prop="id_type_name" :show-overflow-tooltip="true" label="证件类型"></el-table-column>
          <el-table-column prop="master" :show-overflow-tooltip="true" label="责任人"></el-table-column>
          <el-table-column prop="relationName" :show-overflow-tooltip="true" label="与责任人关系"></el-table-column>
          <el-table-column prop="code" :show-overflow-tooltip="true" label="学号"></el-table-column>
          <el-table-column prop="flagName" :show-overflow-tooltip="true" label="状态"></el-table-column>
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
        <el-button type="primary" @click="rowDelete(currentRowIndex, studentInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px" width="60%">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <template v-if="!parentDialogVisible">
          <el-row>
            <el-col :sm="24" :md="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="temp.name" :maxlength="16"
                          style="float: left;margin-right:10px;width:50%;min-width: 87px"></el-input>
                <el-radio-group v-model="temp.sex">
                  <el-radio-button label="M">男</el-radio-button>
                  <el-radio-button label="F">女</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="出生日期" prop="D_OF_B">
                <el-date-picker v-model="temp.D_OF_B" placeholder="请选择出生日期"
                                align="right" style="width: 100%"
                                type="date" format="MM/dd/yyyy" value-format="MM/dd/yyyy">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="证件类别" prop="id_type">
                <el-select v-model="temp.id_type" placeholder="请选择证件类别" style="width: 100%">
                  <el-option v-for="item in id_typeOption"
                             :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="id">
                <el-input v-model="temp.id" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="住址" prop="address">
                <el-input v-model="temp.address" :maxlength="64"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="责任人" prop="master">
                <el-input v-model="temp.master" :maxlength="16"></el-input>
              </el-form-item>
              <el-form-item label="证件号码" prop="masterid">
                <el-input v-model="temp.masterid" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="关系" prop="relation">
                <el-select v-model="temp.relation" placeholder="请选择学生与责任人关系" style="width: 100%">
                  <el-option v-for="item in relationOption"
                             :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态" prop="flag">
                <el-select v-model="temp.flag" placeholder="请选择学生状态" style="width: 100%">
                  <el-option v-for="item in flagOption"
                             :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="学号" prop="code">
                <el-input v-model="temp.code" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="说明" prop="descr">
            <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr"
                      :autosize="{ minRows: 1, maxRows: 4 }"></el-input>
            <span style="font-size: 12px" v-show="leftLength">剩余可输入{{leftLength()}}个字</span>
          </el-form-item>
        </template>
        <template v-else>
          <el-row>
            <el-col :sm="24" :md="12">
              <el-form-item label="父亲" prop="father">
                <el-input v-model="temp.father" :maxlength="16"></el-input>
              </el-form-item>
              <el-form-item label="证件类别" prop="fa_id_type">
                <el-select v-model="temp.fa_id_type" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in id_typeOption"
                             :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="fa_id_number">
                <el-input v-model="temp.fa_id_number" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="联系" prop="fa_contact">
                <el-input v-model="temp.fa_contact" :maxlength="24"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="fa_company">
                <el-input v-model="temp.fa_company" :maxlength="24"></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="12">
              <el-form-item label="母亲" prop="mother">
                <el-input v-model="temp.mother" :maxlength="16"></el-input>
              </el-form-item>
              <el-form-item label="证件类别" prop="mo_id_type">
                <el-select v-model="temp.mo_id_type" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in id_typeOption"
                             :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="证件号码" prop="mo_id_number">
                <el-input v-model="temp.mo_id_number" :maxlength="18"></el-input>
              </el-form-item>
              <el-form-item label="联系" prop="mo_contact">
                <el-input v-model="temp.mo_contact" :maxlength="24"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="mo_company">
                <el-input v-model="temp.mo_company" :maxlength="24"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" style="height: 0; margin-top: -50px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="parentDialogVisible" @click="nextStep">主要信息</el-button>
        <el-button type="primary" v-else @click="nextStep">附加信息</el-button>
        <el-button type="primary" v-if="dialogStatus === 'create'" @click="createData">保 存</el-button>
        <el-button type="primary" v-else @click="updateData">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchList, SubmitTable, valueToLabel, labelToValue} from '@/api/table';
  import {validateTel, validateIdentity18, validatePassport} from "../../../../utils/validate";
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {ElRow},
    data() {
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
        } else if(this.temp.id_type === '2') {
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
          {key: '1', label: '学生编号'},
          {key: '2', label: '学生姓名'},
          {key: '3', label: '学生状态'},
          {key: '4', label: '班级编号'},
          {key: '5', label: '所属学校'},
          {key: '6', label: '入学年份'},
        ],
        //加载图标
        listLoading: true,
        studentInfo: [
          {
            id: '123456789123456789',
            name: '汪涵爱新觉罗',
            D_OF_B: '12/28/2012',
            sex: '男',
            address: '温州市鹿城区高新路5号',
            id_type: '0',
            id_type_name: '身份证',
            father: '爱新觉罗波涛大海',
            fa_id_type: '0',
            fa_id_type_name: '身份证',
            fa_id_number: '123456789123456789',
            fa_contact: '12345678900',
            fa_company: '浙江帝杰曼',
            mother: '谢小小',
            mo_id_type: '1',
            mo_id_type_name: '身份证',
            mo_id_number: '123456788',
            mo_contact: '12345678900',
            mo_company: '无',
            masterid: '1001',
            master: '谢娜',
            relation: '1',
            relationName: '父母',
            relnum: '0',
            code: '201433025023',
            flag: '0',
            flagName: '在读',
            descr: '11'
          },
        ],
        //行数
        currentRowIndex: -1,
        //-----添加/修改对话框--------
        //对话框状态
        dialogVisible: false,
        //父母亲信息对话框状态
        parentDialogVisible: false,
        //对话框状态
        dialogStatus: '',
        //对话框标题
        textMap: {
          create: '添加学生',
          update: '修改学生'
        },
        //对话框内容
        temp: {
          id: '',
          name: '',
          D_OF_B: '',
          sex: '',
          address: '',
          id_type: '',
          id_type_name: '',
          father: '',
          fa_id_type: '',
          fa_id_type_name: '',
          fa_id_number: '',
          fa_contact: '',
          fa_company: '',
          mother: '',
          mo_id_type: '',
          mo_id_type_name: '',
          mo_id_number: '',
          mo_contact: '',
          mo_company: '',
          masterid: '',
          master: '',
          relation: '',
          relnum: '',
          relationName: '',
          code: '',
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
        //标志选项
        flagOption: [
          {
            value: '0',
            label: '在读'
          },
          {
            value: '1',
            label: '毕业'
          },
          {
            value: '2',
            label: '准备'
          },
          {
            value: '3',
            label: '休学'
          },
        ],
        //关系选项
        relationOption: [
          {
            value: '1',
            label: '父母',
          },
          {
            value: '2',
            label: '爷奶',
          },
          {
            value: '3',
            label: '父系长辈',
          },
          {
            value: '4',
            label: '母系长辈',
          },
        ],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          name: {required: true, message: '请输入学生姓名', trigger: 'blur'},
          sex: {required: true, message: '请选择学生性别', trigger: 'blur'},
          D_OF_B: {required: true, message: '请选择出生日期', trigger: 'blur'},
          id_type: {required: true, message: '请选择证件类别', trigger: 'blur'},
          id: [{required: true, message: '请输入正确的证件号码', trigger: 'blur'},
            {validator: checkid_number, trigger: 'change'}],
          // fa_contact: {validator: checkTel, trigger: 'change'},
          fa_id_type: {required: true, message: '请选择证件类别', trigger: 'blur'},
          fa_id_number: [{validator: checkid_number, trigger: 'change'}],
          // mo_contact: {validator: checkTel, trigger: 'change'},
          mo_id_type: {required: true, message: '请选择证件类别', trigger: 'blur'},
          mo_id_number: [{validator: checkid_number, trigger: 'change'}],
          masterid: {required: true, message: '请输入责任人证件号码', trigger: 'blur'},
          master: {required: true, message: '请输入责任人姓名', trigger: 'blur'},
          relation: {required: true, message: '请选择与责任人关系', trigger: 'blur'},
          flag: {required: true, message: '请选择学生状态', trigger: 'blur'},

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
        // fetchList('/studentInfo', this.listQuery).then( response => {
        //   this.studentInfo = response.data.studentInfo;
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
          D_OF_B: '',
          sex: 'M',
          address: '',
          id_type: '0',
          id_type_name: '',
          father: '',
          fa_id_type: '0',
          fa_id_type_name: '',
          fa_id_number: '',
          fa_contact: '',
          fa_company: '',
          mother: '',
          mo_id_type: '0',
          mo_id_type_name: '',
          mo_id_number: '',
          mo_contact: '',
          mo_company: '',
          masterid: '',
          master: '',
          relation: '',
          relnum: '0',
          relationName: '',
          code: '',
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
        //默认父母信息对话框隐藏
        this.parentDialogVisible = false;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //添加完毕上传
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable('/studentInfo', this.temp).then(() => {
//              this.studentInfo.unshift(this.temp);
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
            this.temp.fa_id_type_name = valueToLabel(this.id_typeOption, this.temp.fa_id_type);
            this.temp.mo_id_type_name = valueToLabel(this.id_typeOption, this.temp.mo_id_type);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            this.temp.relationName = valueToLabel(this.relationOption, this.temp.relation);
            //添加到表格
            console.log(this.temp);
            this.studentInfo.push(this.temp);
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
        //默认父母信息对话框隐藏
        this.parentDialogVisible = false;
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      //修改完毕上传
      updateData(index) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
//            SubmitTable('/studentInfo', this.temp).then(() => {
//
//            })
            //通过select的value值找到label的值，显示给用户
            this.temp.sex = valueToLabel(this.sexOption, this.temp.sex);
            this.temp.id_type_name = valueToLabel(this.id_typeOption, this.temp.id_type);
            this.temp.fa_id_type_name = valueToLabel(this.id_typeOption, this.temp.fa_id_type);
            this.temp.mo_id_type_name = valueToLabel(this.id_typeOption, this.temp.mo_id_type);
            this.temp.flagName = valueToLabel(this.flagOption, this.temp.flag);
            this.temp.relationName = valueToLabel(this.relationOption, this.temp.relation);
            // for (const v of this.studentInfo) {
            //   if (v.id === this.temp.id) {
            //     const index = this.studentInfo.indexOf(v);
            //由于学生id是可修改的证件号码 所以无法通过id修改条目
            this.studentInfo.splice(index, 1, this.temp);
            //   break;
            // }
            // }
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
        this.currentRowIndex = this.studentInfo.indexOf(val);
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
      nextStep() {
        this.parentDialogVisible = !this.parentDialogVisible;
      },
    }
  }
</script>
<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 60px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item__content {
    margin-right: 0;
    margin-bottom: 0;
    float: left;
    text-align: left;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 5px;
  }

  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
    line-height: 20px;
  }
</style>
