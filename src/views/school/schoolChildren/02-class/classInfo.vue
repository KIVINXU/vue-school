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
                添加班级
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(classInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改班级
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, classInfo)"
                         :disabled="currentRowIndex === -1">
                删除班级
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
        <el-table :data="classInfo" ref="classTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="ID" :show-overflow-tooltip="true" label="班级编号" width="150px"></el-table-column>
          <el-table-column prop="gradeID" :show-overflow-tooltip="true" label="入学年份" width="70px"></el-table-column>
          <el-table-column prop="classNO" :show-overflow-tooltip="true" label="班级序列" width="65px"></el-table-column>
          <el-table-column prop="teacherID" :show-overflow-tooltip="true" label="班主任" width="70px"></el-table-column>
          <el-table-column prop="head2" :show-overflow-tooltip="true" label="副班主任" width="70px"></el-table-column>
          <el-table-column prop="flag" :show-overflow-tooltip="true" label="班级状态" width="70px"></el-table-column>
          <el-table-column prop="schoolID" :show-overflow-tooltip="true" label="所属学校" width="165px"></el-table-column>
          <el-table-column prop="descr" :show-overflow-tooltip="true" label="备注说明"></el-table-column>
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
        <el-button type="primary" @click="rowDelete(currentRowIndex, classInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="班级编号" prop="ID" v-if="dialogStatus=='update'">
              <el-input v-model="temp.ID" readonly></el-input>
            </el-form-item>
            <el-form-item label="班级序列" prop="classNO">
              <el-input v-model="temp.classNO" type="number"></el-input>
            </el-form-item>
            <el-form-item label="班 主 任" prop="teacherID">
              <el-select v-model="temp.teacherID" filterable placeholder="请选择班主任" style="width: 100%">
                <el-option v-for="item in teacherIDOption"
                  :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="副班主任" prop="head2">
              <el-input v-model="temp.head2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="入学年份" prop="gradeID">
              <el-date-picker v-model="temp.gradeID"
                align="right"
                type="year" value-format="yyyy"
                placeholder="选择入学年份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="所属学校" prop="schoolID">
              <el-select v-model="temp.schoolID" filterable placeholder="请选择学校ID" style="width: 100%">
                <el-option v-for="item in schoolIDOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级状态" prop="flag">
              <el-select v-model="temp.flag" placeholder="请选择状态" style="width: 100%">
                <el-option v-for="item in flagOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注说明" prop="descr">
          <el-input type="textarea" :maxlength="128" v-model.trim="temp.descr" :autosize="{ minRows: 1, maxRows: 4 }"></el-input>
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
  import {fetchList, SubmitTable, valueToLabel, labelToValue} from '@/api/table'

  export default {
    data() {
      return {
        //搜索内容
        listQuery: {
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 2,
        searchOption: [
          {key: '1', label: '班级编号'},
          {key: '2', label: '班级代号'},
          {key: '3', label: '班级名称'}
        ],
        //加载图标
        listLoading: true,
        classInfo: [
          {
            ID: 'c1001',
            classNO: 5,
            gradeID: '2014',
            schoolID: '温州市鹿城区第三小学',
            teacherID: '王维',
            head2: '李白',
            flag: '停办',
            descr: '好班级'
          },
          {
            ID: 'c1002',
            classNO: 8,
            gradeID: '2018',
            schoolID: '温州市鹿城区第八中学',
            teacherID: '王安石',
            head2: '李白',
            flag: '正常',
            descr: '好班级'
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
          create: '添加班级',
          update: '修改班级'
        },
        //对话框内容
        temp: {
          ID: '',
          classNO: '',
          gradeID: '',
          gradeName: '',
          schoolID: '',
          teacherID: '',
          head2: '',
          flag: '',
          descr: ''
        },
        //学校ID选项
        schoolIDOption: [
          {
            value: 's1001',
            label: '温州市鹿城区第三小学'
          }, {
            value: 's1002',
            label: '温州市鹿城区第八中学'
          },
        ],
        //班主任选项
        teacherIDOption: [
          {
            value: 't1001',
            label: '王安石'
          }, {
            value: 't1002',
            label: '李白'
          }, {
            value: 't1003',
            label: '王维'
          },
        ],
        //标志选项
        flagOption: [
          {
            value: '0',
            label: '正常'
          }, {
            value: '1',
            label: '毕业'
          }, {
            value: '2',
            label: '停办'
          },{
            value: '3',
            label: '特殊休息'
          },
        ],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          classNO: [{required: true, message: '班级序列不能为空', trigger: 'blur'}],
          gradeID: [{required: true, message: '请选择入学年份', trigger: 'blur'}],
          teacherID: [{required: true, message: '请选择班主任', trigger: 'blur'}],
          schoolID: [{required: true, message: '请选择学校', trigger: 'blur'}],
          flag: [{required: true, message: '请选择班级状态', trigger: 'change'}],
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
        // fetchList('/classInfo', this.listQuery).then( response => {
        //   this.classInfo = response.data.classInfo;
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
          ID: '',
          classNO: '',
          gradeID: new Date(),
          schoolID: '',
          teacherID:'',
          head2: '',
          flag: '',
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
//            SubmitTable(this.temp).then(() => {
//              this.classInfo.unshift(this.temp);
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
             this.temp.teacherID = valueToLabel(this.teacherIDOption, this.temp.teacherID);
             this.temp.schoolID = valueToLabel(this.schoolIDOption, this.temp.schoolID);
             this.temp.flag = valueToLabel(this.flagOption, this.temp.flag);
            //添加到表格
            console.log(this.temp);
            this.classInfo.push(this.temp);
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
        this.temp.schoolID = labelToValue(this.schoolIDOption, this.temp.schoolID);
        this.temp.teacherID = labelToValue(this.teacherIDOption, this.temp.teacherID);
        this.temp.flag = labelToValue(this.flagOption, this.temp.flag);
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
//            SubmitTable('/classInfo', this.temp).then(() => {
//
//            })
            this.temp.teacherID = valueToLabel(this.teacherIDOption, this.temp.teacherID);
            this.temp.schoolID = valueToLabel(this.schoolIDOption, this.temp.schoolID);
            this.temp.flag = valueToLabel(this.flagOption, this.temp.flag);
            for (const v of this.classInfo) {
              if (v.ID === this.temp.ID) {
                const index = this.classInfo.indexOf(v);
                this.classInfo.splice(index, 1, this.temp);
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
        this.currentRowIndex = this.classInfo.indexOf(val);
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

