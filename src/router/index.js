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
    meta: { title: '终端设备', icon: 'device' },
    children: [
      {
        path: 'deviceHome',
        component: () => import('@/views/device/deviceChildren/01-deviceHome'),
        name: 'deviceHome',
        meta: { title: '设  备'}
      },
      {
        path: 'facePics',
        component: () => import('@/views/device/deviceChildren/06-facePics'),
        name: 'facePics',
        meta: { title: '图片库'}
      },
      {
        path: 'callbackMsg',
        component: () => import('@/views/device/deviceChildren/04-callbackMsg'),
        name: 'callbackMsg',
        meta: { title: '展示信息'}
      },
    ]
  },
  {
    path: '/school',
    component: Layout,
    redirect: '/school/schoolInfo',
    name: 'school',
    meta: {
      title: '学校管理',
      icon: 'school'
    },
    children: [
      {
        path: 'schoolInfo',
        component: () => import('@/views/school/schoolChildren/01-school/schoolInfo'),
        name: 'schoolInfo',
        meta: { title: '学  校' }
      },
      {
        path: 'classInfo',
        component: () => import('@/views/school/schoolChildren/02-class/classInfo'),
        name: 'classInfo',
        meta: { title: '班  级' }
      },
      {
        path: 'teacherInfo',
        component: () => import('@/views/school/schoolChildren/03-teacher/teacherInfo'),
        name: 'teacherInfo',
        meta: { title: '教职工' }
      },
      {
        path: 'studentInfo',
        component: () => import('@/views/school/schoolChildren/08-student/studentInfo'),
        name: 'studentInfo',
        meta: { title: '学  生' }
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
      icon: 'person'
    },
    children: [
      {
        path: 'parentInfo',
        component: () => import('@/views/person/personChildren/01-parents/parentsInfo'),
        name: 'parentInfo',
        meta: { title: '家长信息' }
      },
      {
        path: 'visitorInfo',
        component: () => import('@/views/person/personChildren/03-visitorInfo'),
        name: 'visitorInfo',
        meta: { title: '访客信息' }
      },
      {
        path: 'visitorLog/:visit_id',
        component: () => import('@/views/person/personChildren/03-visitorLog'),
        name: 'visitorLog',
        meta: { title: '访客记录查询' }
      },
    ]
  },
  {
    path: '/portraits',
    component: Layout,
    redirect: '/portraits/masters',
    name: 'portraits',
    meta: {
      title: '照片录入',
      icon: 'portraits'
    },
    children: [
      {
        path: 'masters',
        component: () => import('@/views/portraits/01-responsibles'),
        name: 'masters',
        meta: { title: '主监护人' }
      },
      {
        path: 'consigners',
        component: () => import('@/views/portraits/02-guardians'),
        name: 'consigners',
        meta: { title: '委托人' }
      },
      {
        path: 'visitors',
        component: () => import('@/views/portraits/03-visitors'),
        name: 'visitors',
        meta: { title: '访  客' }
      },
      {
        path: 'staffs',
        component: () => import('@/views/portraits/04-staffs'),
        name: 'staffs',
        meta: { title: '教职工' }
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
      icon: 'permission'
    },
    children: [
      {
        path: 'visitPermission',
        component: () => import('@/views/permission/perChildren/02-visitPermission'),
        name: 'visitPermission',
        meta: { title: '访问权限' }
      },
      {
        path: 'userManager',
        component: () => import('@/views/permission/perChildren/03-userManager'),
        name: 'userManager',
        meta: { title: '管理用户' }
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

