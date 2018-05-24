<template>
  <el-form ref="parentForm" :rules="parentRules" :model="parentForm" label-width="82px">
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="parentForm">
        <el-form-item labelWidth="125px">
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
        <el-form-item label="主监护人:">
          <el-input v-model.trim="parentForm.name"
                    style="float: left;margin-right:10px;width:60%;min-width: 87px"></el-input>
          <el-radio-group v-model="parentForm.gender">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id">
          <el-tooltip  content="注意：从服务器抓取信息会重置表单内容" placement="top">
            <el-input v-model.trim="parentForm.id">
              <el-button slot="append" @click="handleStudentInfo">抓取信息</el-button>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="联系电话:" prop="tel">
          <el-input v-model.trim="parentForm.tel" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址:" prop="addr">
          <el-input v-model.trim="parentForm.addr" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="desc">
          <el-input type="textarea" v-model.trim="parentForm.desc" :maxlength="128"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%;" @click="submitForm('parentForm')">确认录入</el-button>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="12" :md="14" :lg="16" style="margin-left: -1px">
        <el-table :data="list" class="tab2">
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="学生姓名" width="80px" prop="name"></el-table-column>
          <el-table-column label="与学生关系" width="90px">
            <template slot-scope="scope">
              <el-button type="text" @click="scope.row.selectShow = true"
                         v-show="!scope.row.selectShow"
                         style="font-size: 14px;color: #606266"
                         title="点击可修改关系">
                {{scope.row.relation.label}}
              </el-button>
              <el-select v-model="scope.row.relation"
                         value-key="label"
                         @visible-change="handleSelectShow($event, scope.row)"
                         size="mini" style="width: 90px"
                         v-show="scope.row.selectShow">
                <el-option
                  v-for="item in options"
                  :key="item.key" :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="所属学校" width="160px" prop="schoolname"></el-table-column>
          <el-table-column label="所属班级" width="80px" prop="classname"></el-table-column>
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
              <!--<el-button type="text" v-if="scope.row.guardianName.length === 0" @click="handleTrans(scope.row)">-->
                <!--添加接送人-->
              <!--</el-button>-->
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
        //学生数据
        list: [],
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
        options: [],
      }
    },
    created () {
      this.getList();
    },
    methods: {
      //获取学生关系下拉框选项
      getList() {
        if(this.options.length === 0) {
          fetchSearchOption('/faceMaster',{method: 'FieldLabel'})
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
              if(data.data && data.data !== []){
                this.options = data.data.RELATION;
              }
            })
        }
      },
      //下拉菜单显示和隐藏触发
      handleSelectShow(e, row) {
        if(!e) {
          row.selectShow = e;
        }
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
        fetchSearchOption('/faceMaster', { method: 'FieldIdnumber', idnumber: this.parentForm.id})
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
              //给每条数据添加对象--显示下拉框
              this.list.forEach(item => {
                item.selectShow = false;
              })
            }
          });
      },
      //上传主监护人信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.parentForm = Object.assign(this.parentForm, {imgUrl: this.avatarUrl});
            SubmitTable('/faceMaster', this.parentForm).then((response) => {
              const data = response.data;
              if (data.msg && data.msg !== '') {
                this.$message({
                  showClose: true,
                  message: data.msg,
                  type: 'info',
                  duration: 2000
                });
              }
              if (data.id === '00000') {
                this.$notify({
                  title: '录入成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
              }
              
            })
          }
        })
      },
      //解除委托人
      handleDeleteTrans(row, index) {
        var deleteData = Object.assign({method: 'Delete'}, {guardianName: row.guardianName[index]});
        SubmitTable('/faceMaster', deleteData).then(response => {
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
