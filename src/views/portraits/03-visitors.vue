<template>
  <el-form ref="visitorForm" :rules="parentRules" :model="visitorForm" label-width="100px">
    <el-row style="margin-bottom: 10px">
      <el-col :xs="20" :sm="12" :md="9" :lg="7">
        <el-input placeholder="请输入证件号码">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" @click="submitForm('parentForm')">确认录入</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="7" class="parentForm">
        <el-form-item>
          <el-button type="text" class="avatar" @click="toggleShow" title="点击上传照片">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" style="width: 98%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-button>
          <image-upload field="img" img-format="jpg" inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess" :no-circle="true" :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="访客姓名：">
          <el-input v-model="visitorForm.name" readonly style="float: left;width:50%;margin-right: 10px"></el-input>
            <el-radio-group v-model="visitorForm.gender">
              <el-radio-button label="M">男</el-radio-button>
              <el-radio-button label="F">女</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input v-model="visitorForm.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model="visitorForm.tel" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址：" prop="addr">
          <el-input v-model="visitorForm.addr" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="desc">
          <el-input type="textarea" v-model="visitorForm.desc" :maxlength="128"></el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="20" :md="14" :lg="16" :offset="1">
          <div class="tab">
            <el-form-item label="访问对象：">
              <el-input v-model="visitorForm.visitTo"
                        placeholder="请输入模糊查询内容"
                        :disabled="visitorForm.select !== '3'">
                <el-select v-model="visitorForm.select" slot="prepend" placeholder="请选择查询对象" style="width: 100px">
                  <el-option v-for="item in visitOption"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
                <el-button slot="append"
                           :disabled="visitorForm.select !== '3'"
                           @click="dialogVisible = true">查询
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="访问姓名：" prop="visitTel" style="float: left">
              <el-input v-model="visitorForm.visitName" readonly></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="visitTel" style="float: left">
              <el-input v-model.number="visitorForm.visitTel" readonly></el-input>
            </el-form-item>
            <el-form-item label="访问原因：" prop="visitTel" style="clear: left">
              <el-input v-model.number="visitorForm.visitReason"></el-input>
            </el-form-item>
          </div>
        <el-table :data="teacherInfo" class="tab">
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="姓名" width="80px" prop="teacherName" ></el-table-column>
          <el-table-column label="性别" width="30px" prop="teacherGender"></el-table-column>
          <el-table-column label="职位" width="120" prop="teacherJob"></el-table-column>
          <el-table-column label="所属学校" width="160" prop="school"></el-table-column>
          <el-table-column label="手机号码" width="100"  prop="teacherPhone"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="findResult(scope.row)">
                确认选择
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
  import {createPerson} from '@/api/table'
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";

  export default {
    components: {
      ElRadioButton,
      ElButton,
      'image-upload': ImageUpload
    },
    data() {
      //电话号码校验
      var checkTel = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('电话号码不能为空'));
        }
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
          callback(new Error('请输入正确的11位号码'));
        } else {
          callback();
        }
      };
      return {
        //访客数据
        visitorForm: {
          Name: '',
          gender: 'M',
          id: '',
          tel: '',
          addr: '',
          desc: '',
          visitName:'',
          visitTel:'',
          visitReason:'',
        },
        //教师数据
        teacherInfo: [
          {
            teacherName:'阿根达',
            teacherGender:'女',
            school:'温州鹿城区第十三小学',
            teacherJob:'六二班班主任',
            teacherPhone:'12345678900',
          },
          {
            teacherName:'阿根达斯',
            teacherGender:'男',
            school:'温州鹿城区第十三小学',
            teacherJob:'六年级语文老师',
            teacherPhone:'12345678900',
          },
        ],
        parentRules: {
          tel: [
            {required: true, message: '请输入有效电话', trigger: 'blur'},
            {validator: checkTel, trigger: 'change'}
          ],
          addr: [
            {required: true, message: '请输入有效住址', trigger: 'blur'}
          ]
        },
        //tabs标签切换
        activeName: 'guardian',
        //上传图片
        showImage: false,
        avatarUrl: '',
        //访问对象选项
        visitOption: [{
          value: '1',
          label: '教师姓名'
        }, {
          value: '2',
          label: '手机号码'
        }, {
          value: '3',
          label: '其他模糊查询'
        }],
        value: '',
      }
    },
    methods: {
      findResult(row){
        this.visitorForm.visitName=row.teacherName;
        this.visitorForm.visitTel=row.teacherPhone;
      },
      toggleShow() {
        this.showImage = !this.showImage;
      },
      cropSuccess(avatarUrl, field) {
        console.log('-------- 裁剪成功 --------');
        this.avatarUrl = avatarUrl;
      },
      //上传员工信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createPerson('/portraits', this.visitorForm).then((response) => {
              console.log(response);
              this.$notify({
                title: '录入成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        })
      },
    }
  }
</script>
<style lang="less">
  .parentForm {
    border-radius: 8px;
    border: #AAAAAA 1px solid;
    padding: 10px;
  }

  .tab {
    padding: 20px;
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

</style>
