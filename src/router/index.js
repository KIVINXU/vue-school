import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
   { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  //{ path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/main',
    hidden: true,
    children: [{
      path: 'main',
      component: () => import('@/views/main/index'),
    }]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/deviceHome',
    name: 'device',
    meta: { title: '终端设备', icon: 'n1' },
    children: [
      {
        path: 'deviceHome',
        component: () => import('@/views/device/deviceChildren/01-deviceHome'),
        name: 'deviceHome',
        meta: { title: '设  备', icon: 'n1_1'}
      },
      {
        path: 'devicePicture',
        component: () => import('@/views/device/deviceChildren/02-devicePicture'),
        name: 'devicePicture',
        meta: { title: '图片库', icon: 'n1_2'}
      },
      {
        path: 'deviceShow',
        component: () => import('@/views/device/deviceChildren/03-deviceShow'),
        name: 'deviceShow',
        meta: { title: '展示信息', icon: 'n1_3'}
      },
    ]
  },
  {
    path: '/school',
    component: Layout,
    redirect: '/school/schoolHome',
    name: 'school',
    meta: {
      title: '学校管理',
      icon: 'n2'
    },
    children: [
      {
        path: 'schoolHome',
        component: () => import('@/views/school/schoolChildren/01-schoolHome'),
        name: 'schoolHome',
        meta: { title: '学  校', icon: 'n2_1' }
      },
      {
        path: 'schoolClass',
        component: () => import('@/views/school/schoolChildren/02-schoolClass'),
        name: 'schoolClass',
        meta: { title: '班  级', icon: 'n2_2' },
      },
      {
        path: 'classDetail/:class_id',
        component: () => import('@/views/school/schoolChildren/classDetail'),
        name: 'classDetail',
        hidden: true,
        meta: { title: '班级详情' },
      },
      {
        path: 'schoolTeacher',
        component: () => import('@/views/school/schoolChildren/03-schoolTeacher'),
        name: 'schoolTeacher',
        meta: { title: '教职工', icon: 'n2_3' }
      },
      {
        path: 'schoolStudent',
        component: () => import('@/views/school/schoolChildren/04-schoolStudent'),
        name: 'schoolStudent',
        meta: { title: '学  生', icon: 'n2_4' }
      },
    ]
  },
  {
    path: '/person',
    component: Layout,
    redirect: '/person/parentInfo',
    name: 'person',
    meta: {
      title: '人员管理',
      icon: 'n3'
    },
    children: [
      {
        path: 'parentInfo',
        component: () => import('@/views/person/personChildren/01-parents/parentsInfo'),
        name: 'parentInfo',
        meta: { title: '家长信息', icon: 'n3_1' }
      },
      {
        path: 'visitorLog',
        component: () => import('@/views/person/personChildren/03-visitorLog'),
        name: 'visitorLog',
        meta: { title: '访问记录', icon: 'n3_2' }
      },
    ]
  },
  {
    path: '/portraits',
    component: Layout,
    redirect: '/portraits/masters',
    name: 'portraits',
    meta: {
      title: '人脸录入',
      icon: 'n4'
    },
    children: [
      {
        path: 'masters',
        component: () => import('@/views/portraits/01-responsibles'),
        name: 'masters',
        meta: { title: '主监护人', icon: 'n4_1' }
      },
      {
        path: 'consigners',
        component: () => import('@/views/portraits/02-guardians'),
        name: 'consigners',
        meta: { title: '委托人', icon: 'n4_2' }
      },
      {
        path: 'visitors',
        component: () => import('@/views/portraits/03-visitors'),
        name: 'visitors',
        meta: { title: '访  客', icon: 'n4_3' }
      },
      {
        path: 'staffs',
        component: () => import('@/views/portraits/04-staffs'),
        name: 'staffs',
        meta: { title: '教职工', icon: 'n4_4' }
      },
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/visitPermission',
    name: 'permission',
    meta: {
      title: '系统设置',
      icon: 'n5'
    },
    children: [
      {
        path: 'visitPermission',
        component: () => import('@/views/permission/perChildren/01-visitPermission'),
        name: 'visitPermission',
        meta: { title: '访问权限', icon: 'n5_1' }
      },
      {
        path: 'SuserHome',
        component: () => import('@/views/permission/perChildren/02-SuserHome'),
        name: 'SuserHome',
        meta: { title: '管理用户', icon: 'n5_2' }
      },
      {
        path: 'SuserOnline',
        component: () => import('@/views/permission/perChildren/03-SuserOnline'),
        name: 'SuserOnline',
        meta: { title: '在线用户', icon: 'n5_3' }
      }
    ]
  },

  //{ path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

