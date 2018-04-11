<template>
  <div>
    <el-row type="flex" justify="space-between" style="margin-bottom: 10px">
      <el-col :xs="18" :sm="18" :md="10" :lg="8">
        <el-input placeholder="请输入查询内容"
                  :disabled="searchOption.length === 0">
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
                添加学校
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-edit"
                         @click="handleUpdate(schoolInfo[currentRowIndex])"
                         :disabled="currentRowIndex === -1">
                修改学校
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text"
                         icon="el-icon-delete"
                         @click="handleDelete(currentRowIndex, schoolInfo)"
                         :disabled="currentRowIndex === -1">
                删除学校
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
        <el-table :data="schoolInfo" ref="schoolTable"
                  border highlight-current-row
                  @current-change="handleCurrentChange"
                  @row-dblclick="handleUpdate">
          <el-table-column prop="ID" :show-overflow-tooltip="true" label="学校代码" width="110px"></el-table-column>
          <el-table-column prop="name" :show-overflow-tooltip="true" label="学校名称" width="150px"></el-table-column>
          <el-table-column prop="levels" :show-overflow-tooltip="true" label="学校类型"></el-table-column>
          <el-table-column prop="address" :show-overflow-tooltip="true" label="学校地址"></el-table-column>
          <el-table-column prop="head" :show-overflow-tooltip="true" label="负责人"></el-table-column>
          <el-table-column prop="director" :show-overflow-tooltip="true" label="主管部门"></el-table-column>
          <el-table-column prop="flag" :show-overflow-tooltip="true" label="状态">
          </el-table-column>
          <el-table-column prop="eqpId" :show-overflow-tooltip="true" label="设备ID"></el-table-column>
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
        <el-button type="primary" @click="rowDelete(currentRowIndex, schoolInfo)">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加/修改-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" top="10px">
      <el-form ref="dataForm" :rules="rules" :model="temp"
               style="margin-top: -30px" label-position="right" label-width="100px">
        <el-row>
          <el-col :sm="24" :md="12">
            <el-form-item label="学校代码" prop="id">
              <el-input v-model="temp.id" :maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" :maxlength="24"></el-input>
            </el-form-item>
            <el-form-item label="教育程度" prop="levels">
              <el-select v-model="temp.levels" placeholder="请选择教育程度" style="width: 100%">
                <el-option v-for="item in levelsOption"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="负责人" prop="head">
              <el-input v-model="temp.head" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="主管部门" prop="director">
              <el-input v-model="temp.director" :maxlength="24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="flag">
              <el-select v-model="temp.flag" placeholder="请选择学校状态" style="width: 100%">
                <el-option v-for="item in statusOption"
                           :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" prop="eqpid">
          <el-select v-model="temp.eqpid" placeholder="请选择设备编号"
                     multiple style="width: 100%">
            <el-option v-for="item in eqpidOption"
                       :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.value }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px; margin-right: 15px">{{ item.label }}</span>
            </el-option>
          </el-select>
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
          page: 1,
          limit: 20,
          option: '' //查询对象的key值
        },
        //总条目数
        total: 2,
        searchOption: [
          {key: '1', label: '学校代号'},
          {key: '2', label: '学校名称'},
          {key: '3', label: '学校类型'}
        ],
        //加载图标
        listLoading: true,
        schoolInfo: [
          {
            id: 's1001',
            name: '温州市鹿城区第三小学',
            levels: '0',
            levelsName: '幼儿园',
            address: '温州市鹿城区高新路3号',
            head: '潘老师',
            director: '温州市鹿城区教育局',
            flag: '0',
            flagName: '正常',
            eqpid: ["EQP1001", "EQP101010101010", "EQP20202020"],//格式：[ "EQP1001", "EQP101010101010", "EQP20202020" ]
            descr: '好学校'
          },
          {
            id: 's1002',
            name: '温州市鹿城区帝杰曼',
            levels: '7',
            levelsName: '培训中心',
            address: '温州市鹿城区高新路3号',
            head: '潘老师',
            director: '温州市鹿城区教育局',
            flag: '0',
            flagName: '正常',
            eqpid: ["EQP1001", "EQP101010101010", "EQP20202020"],//格式：[ "EQP1001", "EQP101010101010", "EQP20202020" ]
            descr: '好学校'
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
          create: '添加学校',
          update: '修改学校'
        },
        //对话框内容
        temp: {
          ID: '',
          name: '',
          levels: '',
          levelsName: '',
          address: '',
          head: '',
          director: '',
          flag: '',
          flagName: '',
          eqpid: '',
          descr: ''
        },
        //教育水平选项
        levelsOption: [
          {
            value: '0',
            label: '幼儿园'
          }, {
            value: '1',
            label: '小学'
          }, {
            value: '2',
            label: '初中'
          }, {
            value: '7',
            label: '培训中心'
          }],
        //学校状态选项
        statusOption: [{
          value: '-1',
          label: '注销'
        }, {
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '停办'
        }],
        //设备编号选项
        eqpidOption: [{
          value: 'EQP1001',
          label: '三小学校前门'
        }, {
          value: 'EQP101010101010',
          label: '三小后门'
        }, {
          value: 'EQP20202020',
          label: '八中正门'
        }],
        //-----删除对话框----
        //对话框状态
        deleteDialogVisible: false,
        //内容验证规则
        rules: {
          ID: [{required: true, message: '学校代码不能为空', trigger: 'blur'},
            {validator: checkID, trigger: 'blur'}],
          name: [{required: true, message: '学校名称不能为空', trigger: 'blur'}],
          levels: [{required: true, message: '请选择教育程度', trigger: 'change'}],
          flag: [{required: true, message: '请选择学校状态', trigger: 'change'}],
          eqpid: [{required: true, message: '设备类型不能为空', trigger: 'blur'}],
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
//        fetchList('/schoolInfo', this.listQuery).then( response => {
//          this.schoolInfo = response.data.schoolInfo;
//          this.total = response.data.total;
//          this.listLoading = false;
//        })
      },
      //搜索内容
      handleSearch() {
        console.log('搜索')
      },
      resetTemp() {
        this.temp = {
          ID: '',
          name: '',
          levels: '',
          levelsName: '',
          address: '',
          head: '',
          director: '',
          flag: '',
          flagName: '',
          eqpid: '',
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
//            SubmitTable('/schoolInfo', this.temp).then(() => {
//              this.schoolInfo.unshift(this.temp);
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
            this.temp.levelsName = valueToLabel(this.levelsOption, this.temp.levels);
            this.temp.flagName = valueToLabel(this.statusOption, this.temp.flag);
            //添加到表格
            this.schoolInfo.push(this.temp);
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
//            SubmitTable('/schoolInfo', this.temp).then(() => {
//
//            })
            this.temp.levelsName = valueToLabel(this.levelsOption, this.temp.levels);
            this.temp.flagName = valueToLabel(this.statusOption, this.temp.flag);
            for (const v of this.schoolInfo) {
              if (v.ID === this.temp.ID) {
                const index = this.schoolInfo.indexOf(v);
                this.schoolInfo.splice(index, 1, this.temp);
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
        this.currentRowIndex = this.schoolInfo.indexOf(val);
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

