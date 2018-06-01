<template>
  <el-form ref="staffForm" :rules="staffRules" :model="staffForm" label-width="100px">
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="staffForm">
        <el-form-item labelWidth="125px">
          <el-button type="text" class="avatar"
                     :disabled="!idLocked"
                     @click="toggleShow" title="点击上传照片">
            <img v-if="imageInfo.face" :src="imageInfo.face" alt="" style="width: 98%">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-button>
          <image-upload :field="imageInfo.imgField"
                        :img-format="imageInfo.format"
                        :url="imageInfo.url"
                        :params="{id: staffForm.id}"
                        inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess"
                        @crop-upload-success="cropUploadSuccess"
                        :no-circle="true"
                        :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="员工姓名：">
          <el-input v-model.trim="staffForm.name"
                    :readonly="idLocked"
                    style="float: left;width:50%;margin-right: 10px"></el-input>
          <el-radio-group v-model="staffForm.sex">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id">
          <el-input v-model.trim="staffForm.id" :readonly="idLocked">
            <el-button slot="append"
                       :disabled="fetchButton"
                       @click="handleStudentInfo">抓取信息</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="contact">
          <el-input v-model.trim="staffForm.contact" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址：" prop="address">
          <el-input v-model.trim="staffForm.address" :maxlength="64"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="descr">
          <el-input type="textarea" v-model.trim="staffForm.descr" :maxlength="128"></el-input>
          <span style="font-size: 13px; color: #606266;">最近更新时间：{{staffForm.mtime}}</span>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="warning"
                       size="medium"
                       @click="resetForm">
              取消录入
            </el-button>
            <el-button type="primary"
                       size="medium"
                       :disabled="!idLocked"
                       @click="submitForm('staffForm')">
              确认录入
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import ImageUpload from 'vue-image-crop-upload'
  import ElRadioButton from "element-ui/packages/radio/src/radio-button";
  import { fetchList, SubmitTable, fetchSearchOption } from '@/api/table'
  import {validateTel, validateIdentity18} from "@/utils/validate";

  export default {
    components: {
      ElRadioButton,
      ElButton,
      'image-upload': ImageUpload
    },
    data() {
      //证件号码验证
      const checkID_number = (rule, value, callback) => {
        if (!validateIdentity18(value)) {
          this.fetchButton = true;
          callback(new Error('请输入正确的18位身份证号码'))
        } else {
          this.fetchButton = false;
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
        //员工数据
        staffForm: {
          name: '',
          sex: '男',
          id: '',
          facekey: '', //表明后台接受到图片的返回值
          facesize: '', //后台图片的尺寸
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        },
        //监护人名称和ID是否锁定为只读
        idLocked: false,
        //抓取按钮是否可用
        fetchButton: true,
        staffRules: {
          id: [
            {required: true, message: '请输入证件号码', trigger: 'blur'},
            {validator: checkID_number, trigger: ['blur','change']}
          ],
          contact: [
            {required: true, message: '请输入有效电话', trigger: 'blur'},
            {validator: checkTel, trigger: 'blur'}
          ],
        },
        //上传图片
        showImage: false,
        //图片上传插件参数
        imageInfo: {
          url: '/faces',
          face: '',
          imgField: 'face',
          format: 'jpg'
        },
      }
    },
    methods: {
      //传过来是微秒
      timestampToTime(timestamp) {
        let time = timestamp.toString().split('.');
        const date = new Date(parseInt(time[0]) * 1000);
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/';
        const Y = date.getFullYear() + ' ';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return M + D + Y + h + m + s;
      },
      toggleShow() {
        this.showImage = !this.showImage;
      },
      //照片裁剪完成后
      cropSuccess(avatarUrl, field) {
        this.imageInfo.face = avatarUrl;
      },
      //照片上传成功后
      cropUploadSuccess(jsonData, field){
        if(jsonData.id === 0){
          this.staffForm.facekey = jsonData.key;
          this.staffForm.facesize = jsonData.size;
        }
      },
      //输入身份证编号可以自动补全表单内容和表格内容
      handleStudentInfo() {
        fetchSearchOption('/faceStaff', { method: 'FieldIdnumber', idnumber: this.staffForm.id})
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
            if (data.data.id && data.data.name) {
              //监护人表单信息加载
              this.staffForm = data.data;
              //转化时间戳
              if(this.staffForm.mtime){
                this.staffForm.mtime = this.timestampToTime(this.staffForm.mtime);
              }
              //如果存在facekey，图片内容加载
              if(this.staffForm.facekey){
                fetchSearchOption('/face/portraits', {method: 'FieldFacekey', facekey: this.staffForm.facekey}).then(response => {
                  const faceData = response.data;
                  this.imageInfo.face = 'data:image/jpeg;base64,' + faceData.data.face;
                });
              }
              this.idLocked = true;
            }else {
              this.$message({
                showClose: true,
                message: '找不到此证件号码对应的信息',
                type: 'warning',
                duration: 2000
              });
            }
          });
      },
      //重置监护人信息
      resetForm() {
        this.staffForm = {
          name: '',
          sex: '男',
          id: '',
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        };
        this.imageInfo.face = '';
        this.idLocked = false;
      },
      //上传员工信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let temp = Object.assign(this.staffForm, {method: 'Update'});
            delete temp.guarders;
            delete temp.face;
            delete temp.mtime;
            SubmitTable('/faceStaff', temp).then((response) => {
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
                //默认状态不上传 如果图片有变化则上传，状态再改回默认
                this.$notify({
                  title: '成功',
                  message: '录入成功',
                  type: 'success',
                  duration: 2000
                });
                this.resetForm();
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .staffForm {
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
