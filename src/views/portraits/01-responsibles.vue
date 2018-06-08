<template>
  <el-form ref="parentForm" :rules="parentRules" :model="parentForm" label-width="82px">
    <el-row>
      <el-col :xs="16" :sm="11" :md="9" :lg="8" class="parentForm">
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
                        :params="{id: parentForm.id}"
                        inputAccept="image/jpg,image/jpeg" v-model="showImage"
                        @crop-success="cropSuccess"
                        @crop-upload-success="cropUploadSuccess"
                        :no-circle="true"
                        :width="300" :height="420">
          </image-upload>
        </el-form-item>
        <el-form-item label="主监护人:">
          <el-input v-model.trim="parentForm.name"
                    :maxlength="8"
                    :readonly="nameLocked"
                    style="float: left;margin-right:10px;width:60%;min-width: 87px"></el-input>
          <el-radio-group v-model="parentForm.sex">
            <el-radio-button label="男">男</el-radio-button>
            <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号码:" prop="id">
          <el-input v-model.trim="parentForm.id" :readonly="idLocked">
            <el-button slot="append"
                       :disabled="fetchButton"
                       @click="handleStudentInfo">抓取信息</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="contact">
          <el-input v-model.trim="parentForm.contact" :maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="联系住址:" prop="address">
          <el-input v-model.trim="parentForm.address" :maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="说明:" prop="descr">
          <el-input type="textarea" v-model.trim="parentForm.descr" :maxlength="128"></el-input>
          <span style="font-size: 13px; color: #606266;">最近更新时间：{{parentForm.mtime}}</span>
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
                       @click="submitForm('parentForm')">
              确认录入
            </el-button>
          </el-button-group>
        </el-form-item>
      </el-col>
      <el-col :xs="22" :sm="12" :md="14" :lg="16" style="margin-left: -1px">
        <el-table :data="parentForm.guarders" class="tab2">
          <el-table-column label="序号" width="30px" type="index"></el-table-column>
          <el-table-column label="主监护人" width="80px" prop="guarder"></el-table-column>
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
          <el-table-column label="委托人（点击可操作,最多5人）">
            <template slot-scope="scope">
              <el-button-group v-for="(item, index) in scope.row.consigners"
                               :key="index">
                <el-popover trigger="click" ref="popover" placement="bottom">
                  <p>是否解除该委托人？</p>
                  <div>
                    <el-button type="warning" @click="handleDeleteTrans(scope.row, index)">
                      解除
                    </el-button>
                    <el-button type="text"
                               :disabled="scope.row.consigners.length >= 5"
                               @click="handleTrans(scope.row)">
                      添加其他接送人
                    </el-button>
                  </div>
                  <el-button size="mini" type="text"
                             slot="reference"
                             title="点击可修改委托人"
                             style="font-size: 14px;color: #606266;margin-left: 5px">
                    {{item.label}}
                  </el-button>
                </el-popover>
              </el-button-group>
              <el-button type="text" v-if="scope.row.consigners.length === 0" @click="handleTrans(scope.row)">
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
        //主监护人数据
        parentForm: {
          name: '',
          sex: '男',
          id: '',
          facekey: '', //表明后台接受到图片的返回值
          facesize: '', //后台图片的尺寸
          //主监护人表格内容
          guarders: [],
          contact: '',
          address: '',
          mtime: '',
          descr: '',
        },
        //监护人名称和ID是否锁定为只读
        nameLocked: false,
        idLocked: false,
        //抓取按钮是否可用
        fetchButton: true,
        parentRules: {
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
          format: 'jpg',
          key: '',
          size: ''
        },
        //与学生关系选项
        options: [],
      }
    },
    created () {
      this.getList();
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
      //获取学生关系下拉框选项
      getList() {
        fetchSearchOption('/faceGuarder',{method: 'FieldLabel'})
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
      //照片裁剪完成后
      cropSuccess(avatarUrl, field) {
        this.imageInfo.face = avatarUrl;
      },
      //照片上传成功后
      cropUploadSuccess(jsonData, field){
        if(jsonData.id === 0){
          this.imageInfo.key = jsonData.key;
          this.imageInfo.size = jsonData.size;
        }
      },
      //输入身份证编号可以自动补全表单内容和表格内容
      handleStudentInfo() {
        fetchSearchOption('/faceGuarder', { method: 'FieldIdnumber', idnumber: this.parentForm.id})
          .then(response => {
            this.idLocked = true;
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
              this.parentForm = data.data;
              //转化时间戳
              if(this.parentForm.mtime){
                this.parentForm.mtime = this.timestampToTime(this.parentForm.mtime);
              }
              //如果存在facekey，图片内容加载
              if(data.data.facekey){
                fetchSearchOption('/face/portraits', {method: 'FieldFacekey', facekey: this.parentForm.facekey}).then(response => {
                  const faceData = response.data;
                  this.imageInfo.face = 'data:image/jpeg;base64,' + faceData.data.face;
                });
              }
              this.nameLocked = true;
            }else {
              this.nameLocked = false;
            }
            //表格信息加载
            //给每条数据添加对象--显示下拉框
            if(data.data.guarders_id === '00000'){
              this.parentForm.guarders = data.data.guarders;
              this.parentForm.guarders.forEach(item => {
                this.$set(item, 'selectShow', false); //set方法才能添加对象
              });
            }else {
              this.parentForm.guarders = [];
            }
          });
      },
      //重置监护人信息
      resetForm() {
        this.parentForm = {
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
      //上传主监护人信息
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //如果抓取图片不存在,则判断
            if(!this.parentForm.facekey) {
              if(!this.imageInfo.key) {
                this.$message({
                  showClose: true,
                  message: '请先上传照片',
                  type: 'error',
                  duration: 2000
                });
                return;
              }else {
                //如果已上传照片，则复制照片的key
                this.parentForm.facekey = this.imageInfo.key;
                this.parentForm.facesize = this.imageInfo.size;
              }
            }
            let temp = Object.assign(this.parentForm, {method: 'Insert'});
            delete temp.guarders;
            delete temp.face;
            delete temp.mtime;
            delete temp.guarders_id;
            SubmitTable('/faceGuarder', temp).then((response) => {
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
      },
      //解除委托人
      handleDeleteTrans(row, index) {
        let deleteData = {
          method: 'Remove',
          snumber: row.snumber,
          guarderid: this.parentForm.id,
          consigid: row.consigners[index].key
        };
        SubmitTable('/faceGuarder', deleteData).then(response => {
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
            row.consigners.splice(index, 1);
            document.querySelector("#app").click();//模拟点击空白区域关闭弹框
          }
        });
      },
      //添加接送人跳转,及附带参数
      handleTrans(row) {
        this.$router.push({name: 'consigners', params: {
          snumber: row.snumber,
          stuName: row.name,
          guarderid: this.parentForm.id,
          guarderName: row.guarder,
          schoolname: row.schoolname,
          classname: row.classname
        }})
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
    border: #3a8ee6 1px dashed !important;
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

  .section {
    position: relative;
    top: -20px;
  }
</style>
