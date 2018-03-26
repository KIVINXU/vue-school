<template>
  <el-form ref="staffForm" :rules="staffRules" :model="staffForm" label-width="100px">
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
          <el-input v-model="staffForm.name" readonly style="float: left;width:50%;margin-right: 10px"></el-input>
          <el-radio-group v-model="staffForm.gender">
            <el-radio-button label="M">男</el-radio-button>
            <el-radio-button label="F">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input v-model="staffForm.id" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input v-model.number="staffForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="联系住址：" prop="addr">
          <el-input v-model="staffForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="所属学校：" prop="school">
          <el-input type="textarea" v-model="staffForm.school" max="128"></el-input>
        </el-form-item>
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
        staffForm: {
          Name: '',
          gender: 'M',
          id: '',
          tel: '',
          addr: '',
          school:'',
        },
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
      }
    },
    methods: {
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
</style>
