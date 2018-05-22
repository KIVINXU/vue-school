<template>
  <el-form ref="parentForm" :rules="parentRules" :model="parentForm" label-width="100px">
    <el-row class="el-table-margin">
      <el-col :span="16" :offset="5">
        <el-select v-model.trim="listQuery.key"
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
                  @keyup.enter.native="handleFilter()">
        </el-input>
        <el-button
          type="info" plain
          @click="handleFilter()"
          :disabled="listQuery.key === ''
            || listQuery.value === ''"
          icon="el-icon-search">查询
        </el-button>
        <el-button
          icon="el-icon-search"
          type="info" plain
          @click="handleExtFilter()"
          :disabled="listQuery.key === ''
            || listQuery.value === ''">相似</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="parentForm">
        <el-form-item label-width="125px">
          <el-button type="text" class="avatar" @click="toggleShow" title="点击上传照片">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" style="width: 98%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-button>
          <image-upload field="img" img-format="jpg"
                        inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess" :no-circle="true"
                        :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="主监护人:" label-width="82px">
          <el-input v-model.trim="parentForm.name"
                    style="float: left;margin-right:10px;width:60%;min-width: 87px"></el-input>
          <el-radio-group v-model="parentForm.gender">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id" label-width="82px">
          <el-tooltip  content="注意：从服务器抓取信息会重置表单内容" placement="top">
            <el-input v-model.trim="parentForm.id">
              <el-button slot="append" @click="handleStudentInfo">抓取信息</el-button>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel" label-width="82px">
          <el-input v-model.trim="parentForm.tel" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址:" prop="addr" label-width="82px">
          <el-input v-model.trim="parentForm.addr" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="desc" label-width="82px">
          <el-input type="textarea" v-model.trim="parentForm.desc" :maxlength="128"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('parentForm')">确认录入</el-button>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="12" :md="14" :lg="16" style="margin-left: -1px">
        <el-table :data="list" class="tab2">
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="stuName"></el-table-column>
          <el-table-column label="与学生关系" width="90px">
            <template slot-scope="scope">
              <el-button type="text" @click="selectShow(scope.row)"
                         v-if="!scope.row.clickshow"
                         style="font-size: 14px;color: #606266"
                         title="点击可修改关系">
                {{scope.row.stuRela}}
              </el-button>
              <el-select v-model="scope.row.stuRela"
                         @change="selectShow(scope.row)"
                         @blur="selectShow(scope.row)"
                         size="mini" style="width: 90px" v-else>
                <el-option
                  v-for="item in options"
                  :key="item.key" :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="所属学校" width="160px" prop="stuSchool"></el-table-column>
          <el-table-column label="所属班级" width="80px" prop="stuClass"></el-table-column>
          <el-table-column label="委托人（点击可操作）">
            <template slot-scope="scope">
              <el-button-group v-for="(item, index) in scope.row.guardianName"
                               :key="index">
                <el-popover trigger="click" ref="popover" placement="bottom">
                  <p>是否解除该委托人？</p>
                  <div>
                    <el-button type="warning" @click="handleDeleteTrans(scope.row, index)">
                      解除
                    </el-button>
                    <el-button type="text" @click="handleTrans(scope.row)">
                      添加其他接送人
                    </el-button>
                  </div>
                  <el-button size="mini" type="text"
                             slot="reference"
                             title="点击可修改委托人"
                             style="font-size: 14px;color: #606266;margin-left: 5px">
                    {{item}}
                  </el-button>
                </el-popover>
              </el-button-group>
              <el-button type="text" v-if="scope.row.guardianName.length === 0" @click="handleTrans(scope.row)">
                添加接送人
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ImageUpload from 'vue-image-crop-upload'
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";
  import ElButtonGroup from "../../../node_modules/element-ui/packages/button/src/button-group.vue";
  import { fetchList, SubmitTable, fetchSearchOption } from '@/api/table'
  import {validateTel, validateIdentity18} from "@/utils/validate";

  export default {
    components: {
      ElButtonGroup,
      ElRadioButton,
      ElButton,
      'image-upload': ImageUpload
    },
    data() {
      //证件号码验证
      const checkID_number = (rule, value, callback) => {
        if (!validateIdentity18(value)) {
          callback(new Error('请输入正确的18位身份证号码'))
        } else {
          callback()
        }
      };
      //电话号码校验
      const checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话号码不能为空'));
        }
        if (!validateTel(value)) {
          callback(new Error('请输入正确的11位号码'));
        } else {
          callback();
        }
      };
      return {
        //搜索内容
        listQuery: {
          method: '',
          ext: undefined,
          key: '',  //查询对象的key值
          value: ''  //查询对象内容
        },
        searchOption: [],
        //学生数据
        list: [
          {
            stuName: '汪涵',
            stuRela: "父母",
            stuSchool: "温州市鹿城第八十八小学",
            stuClass: "六<52>班",
            guardianName: [],
            responseName: '谢娜',
            //select是否显示
            clickshow: false,
          },
          {
            stuName: '吴亦凡',
            stuRela: "爷奶",
            stuSchool: "温州市鹿城区第三小学",
            stuClass: "六<2>班",
            guardianName: ['慕容复', '诸葛亮'],
            responseName: '谢娜',
            //select是否显示
            clickshow: false,
          },
          {
            stuName: '爱国主义',
            stuRela: "保姆",
            stuSchool: "温州市鹿城区小学",
            stuClass: "六<2>班",
            guardianName: ['黄飞鸿', '慕容复', '诸葛亮'],
            responseName: '谢娜',
            //select是否显示
            clickshow: false,
          },
          {
            stuName: '赵AA',
            stuRela: "父母",
            stuSchool: "温州市鹿城区小学",
            stuClass: "六<2>班",
            guardianName: ['赵阿三', '周王', '赵孙李', '周吴郑', '钱孙李'],
            responseName: '谢娜',
            //select是否显示
            clickshow: false,
          },
          {
            stuName: '汪涵',
            stuRela: "父母",
            stuSchool: "温州市鹿城区小学",
            stuClass: "六<2>班",
            guardianName: ['赵钱孙李', '周吴郑王', '赵钱孙李', '周吴郑王', '赵钱孙李'],
            responseName: '谢娜',
            //select是否显示
            clickshow: false,
          },
        ],
        //主监护人数据
        parentForm: {
          name: '',
          gender: '男',
          id: '',
          tel: '',
          addr: '',
          desc: '',
        },
        parentRules: {
          id: [
            {required: true, message: '请输入正确的证件号码', trigger: 'blur'},
            {validator: checkID_number, trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '请输入有效电话', trigger: 'blur'},
            {validator: checkTel, trigger: 'change'}
          ],
          addr: [{required: true, message: '请输入有效住址', trigger: 'blur'}]
        },
        //上传图片
        showImage: false,
        avatarUrl: '',
        //与学生关系选项
        options: [
          {
            key: 1,
            label: '父母',
          },
          {
            key:  2,
            label: '爷奶',
          },
          {
            key: 3,
            label: '父系长辈',
          },
          {
            key: 4,
            label: '母系长辈',
          },
        ],
      }
    },
    methods: {
      //请求后台
      requestList (List){
        fetchList('/portraits', List).then( response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'error',
              duration: 2000
            });
          }
          if(data.data){
            this.list = data.data;
            this.total = data.total;
          }else {
            this.list = [];
            this.total = 0;
          }
        })
      },
      //获取列表
      getList () {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'List';
        this.requestList(this.listQuery);
      },
      //直接查询
      handleFilter() {
        this.listQuery.ext = undefined;
        this.listQuery.method = 'Query';
        this.requestList(this.listQuery);
      },
      //相似查询
      handleExtFilter() {
        this.listQuery.ext = 'like';
        this.listQuery.method = 'Query';
        this.requestList(this.listQuery);
      },
      selectShow(row) {
        row.clickshow = !row.clickshow;
      },
      toggleShow() {
        this.showImage = !this.showImage;
      },
      cropSuccess(avatarUrl, field) {
        console.log('-------- 裁剪成功 --------');
        this.avatarUrl = avatarUrl;
      },
  
      //输入身份证编号可以自动补全表单内容和表格内容
      handleStudentInfo() {
        fetchSearchOption('/portraits', { method: 'FieldIdnumber', idnumber: this.parentForm.id})
          .then(response => {
            const data = response.data;
            if (data.msg && data.msg !== '') {
              this.$message({
                showClose: true,
                message: data.msg,
                type: 'error',
                duration: 2000
              });
            }
            if (data.data && data.data !== []) {
              this.list = data.data;
            }
          });
      },
      //上传主监护人信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.parentForm = Object.assign(this.parentForm, {imgUrl: this.avatarUrl});
            SubmitTable('/portraits', this.parentForm).then((response) => {
              this.$notify({
                title: '录入成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      //解除委托人
      handleDeleteTrans(row, index) {
        var deleteData = Object.assign({method: 'Delete'}, {guardianName: row.guardianName[index]});
        SubmitTable('/portraits', deleteData).then(response => {
          const data = response.data;
          if(data.msg && data.msg !== ''){
            this.$message({
              showClose: true,
              message: data.msg,
              type: 'info',
              duration: 2000
            });
          }
          if(data.id === '00000') {
            this.$notify({
              title: '成功',
              message: '解除成功',
              type: 'success',
              duration: 2000
            });
            row.guardianName.splice(index, 1);
            document.querySelector("#app").click();//模拟点击空白区域关闭弹框
          }
        });
      },
      //添加接送人跳转
      handleTrans(row) {
        this.$router.push({name: 'consigners', params: {stuName: row.stuName, responseName: row.responseName}})
      },
      //select获取焦点后请求数据
      handleFocus() {
        if(this.searchOption.length === 0) {
          fetchSearchOption('/portraits',{method: 'FieldQuery'})
            .then(response => {
              const data = response.data;
              if(data.msg && data.msg !== ''){
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'error',
                  duration: 2000
                });
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
    }
  }
</script>
<style lang="scss">
  .parentForm {
    border-radius: 8px;
    border: #AAAAAA 1px solid;
    padding: 10px;
  }

  .tab2 {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #aaa;

  }

  .avatar {
    border: #3a8ee6 1px dashed;
    border-radius: 6px;
    width: 120px;
    height: 180px;
    text-align: center;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .section {
    position: relative;
    top: -20px;
  }
</style>
