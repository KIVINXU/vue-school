<template>
  <div class="col-sm-8">
    <div class="box">
      <div class="box-header">
      </div>
      <div class="box-body">
        <!-- form start -->
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-xs-2 control-label">权限名称：</label>
            <div class="col-xs-9">
              <input type="text" class="form-control" value="xxx" disabled>
            </div>
          </div>
  
          <div class="form-group">
            <label class="col-xs-2 control-label">反馈信息：</label>
            <div class="col-xs-9">
              <ul class="list-unstyled" data-widget="tree">
                <li class="treeview">
                  <label class="media-middle">
                    <input type="checkbox">
                  </label>
                  <a href="#">终端设备 </a>
                  <ul class="treeview-menu">
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            终端设备一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            设备类型一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            设备故障一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            展示信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
        
                <li class="treeview">
                  <label>
                    <input type="checkbox">
                  </label>
                  <a href="#">人员信息</a>
                  <ul class="treeview-menu">
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            学校信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            学校班级一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            教师信息管理
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            教师岗位一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            教师职位一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            员工信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            员工身份一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            学生信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            家长信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            与学生关系一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            访客信息一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            访客记录查询
                          </label>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
        
                <li class="treeview">
                  <label>
                    <input type="checkbox">
                  </label>
                  <a href="#">照片管理</a>
                  <ul class="treeview-menu">
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            存储目录设置
                          </label>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
        
                <li class="treeview">
                  <label>
                    <input type="checkbox">
                  </label>
                  <a href="#">系统设置</a>
                  <ul class="treeview-menu">
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            后台菜单一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            访问权限一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            管理用户一览
                          </label>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <div class="checkbox">
                          <label>
                            <input type="checkbox">
                            修改登录密码
                          </label>
                        </div>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label class="col-xs-2 control-label">说明：</label>
            <div class="col-xs-9">
              <textarea class="form-control" rows="3"></textarea>
            </div>
          </div>
        
        </form>
      </div>
      <div class="box-footer text-center">
        <a href="#" class="btn btn-primary" style="margin-right: 30px">保存</a>
        <a href="#" class="btn btn-default" @click="$router.go(-1)">返回</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    mounted () {
      $('ul').tree({
        accordion: false,
        trigger: '.treeview a',
      });
    }
  }
</script>
