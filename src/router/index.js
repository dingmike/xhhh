import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },

  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步动态路由表
export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [{
      path: 'page',
      component: _import('permission/page'),
      name: 'pagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'directive',
      component: _import('permission/directive'),
      name: 'directivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    }]
  },

  //-----------my navbar start---------------------//


  //new add router
  {
    path: '/sceneryIntroduce',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('sceneryIntroduce/index'),
      name: 'sceneryIntroduce',
      meta: { title: '景点介绍', icon: 'scenery', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/adPlace',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('adPlace/index'),
      name: 'adPlace',
      meta: { title: '广告位', icon: 'ad', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/enterPark',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('enterPark/index'),
      name: 'enterPark',
      meta: { title: '入园参考', icon: 'park', noCache: true, roles: ['admin','editor'] }
    }]
  },

  {
    path: '/userManage',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('userManage/index'),
      name: 'userManage',
      meta: { title: '会员管理', icon: 'user', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/editUser',
    component: Layout,
    redirect: '/userManage/editUser',
    children: [{
      path: 'index',
      component: _import('userManage/editUser'),
      name: 'editUser',
      meta: { title: '编辑会员', icon: 'documentation', noCache: true }
    }],
    hidden: true
  },
  {
    path: '/userDegree',
    component: Layout,
    redirect: '/userManage/userDegree',
    children: [{
      path: 'index',
      component: _import('userManage/userDegree'),
      name: 'userDegree',
      meta: { title: '编辑会员等级', icon: 'documentation', noCache: true }
    }],
    hidden: true
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/officeNews/office-news-list',
    name: 'news',
    meta: {
      title: 'news',
      icon: 'example'
    },
    children: [
      {
        path: '/news/office-news',
        component: _import('news/officeNews/index'),
        redirect: '/news/officeNews/office-news-list',
        name: 'officeNews',
        meta: {
          title: 'officeNews',
          icon: 'table'
        },
        children: [
          { path: 'office-news-list', component: _import('news/officeNews/officeNewsList'), name: 'officeNewsList', meta: { title: 'officeNewsList', noCache: true }},
          { path: 'add-office-news', component: _import('news/officeNews/addOfficeNews'), name: 'addOfficeNews', meta: { title: 'addOfficeNews', noCache: true }},
          { path: 'edit-office-news', component: _import('news/officeNews/editOfficeNews'), name: 'editOfficeNews', meta: { title: 'editOfficeNews', noCache: true}, hidden: true }
        ]
      },
      // { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
      {
        path: '/news/office-notifice',
        component: _import('news/officeNotifice/index'),
        redirect: '/news/officeNotifice/office-notifice-list',
        name: 'officeNotifice',
        meta: {
          title: 'officeNotifice',
          icon: 'table'
        },
        children: [
          { path: 'office-notifice-list', component: _import('news/officeNotifice/officeNotificeList'), name: 'officeNotificeList', meta: { title: 'officeNotificeList', noCache: true }},
          { path: 'add-office-notifice', component: _import('news/officeNotifice/addOfficeNotifice'), name: 'addOfficeNotifice', meta: { title: 'addOfficeNotifice', noCache: true }},
          { path: 'edit-office-notifice', component: _import('news/officeNotifice/editOfficeNotifice'), name: 'editOfficeNotifice', meta: { title: 'editOfficeNotifice', noCache: true}, hidden: true }
        ]
      },
    ]
  },

/*  {
    path: '/news',
    component: Layout,
    // redirect: 'noredirect',
    redirect: '/news/officeNews/index',
    name: 'news',
    meta: {
      title: '新闻咨询',
      icon: 'news',
      roles: ['admin','editor']
    },
    hidden: false,
 /!*   children: [
      { path: 'newsList', component: _import('news/newsList'), name: 'newsList', meta: { title: '新闻资讯', noCache: true }},
      { path: 'addNews', component: _import('news/addNews'), name: 'addNews', meta: { title: '新增咨询', noCache: true }},
      { path: 'editNews', component: _import('news/editNews'), name: 'editNews', meta: { title: '修改咨询', noCache: true }}
    ],*!/

    children: [
      {
        path: '/news/officeNews',
        component: _import('news/officeNews/index'),
        redirect: '/news/officeNews/index',
        name: 'officeNews',
        meta: {
          title: '新闻咨询',
          icon: 'table',
          roles: ['admin','editor']
        },
        children: [
          { path: 'index', component: _import('news/officeNews/index'), name: 'index', meta: { title: '新闻资讯', noCache: true ,roles: ['admin','editor']}},
          { path: 'addNews', component: _import('news/officeNews/addNews'), name: 'addNews', meta: { title: '新增咨询', noCache: true ,roles: ['admin','editor']}},
          { path: 'editNews', component: _import('news/officeNews/editNews'), name: 'editNews', meta: { title: '修改咨询', noCache: true ,roles: ['admin','editor']},hidden: true}
          /!*{ path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
          { path: 'custom-tree-table', component: _import('example/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}*!/
        ]
      },
      { path: '/news/officeNotifice',

        component: _import('news/officeNotifice/index'),
        redirect: '/news/officeNotifice/index',
        name: 'officeNotifice',
        meta: { title: '官方公告',icon: 'tab',roles: ['admin','editor']},
        children: [
          { path: 'index', component: _import('news/officeNotifice/index'), name: 'index', meta: { title: '官方公告', noCache: true ,roles: ['admin','editor']}},
          { path: 'addNews', component: _import('news/officeNotifice/addNews'), name: 'addNews', meta: { title: '新增公告', noCache: true ,roles: ['admin','editor']}},
          { path: 'editNews', component: _import('news/officeNotifice/editNews'), name: 'editNews', meta: { title: '修改公告', noCache: true ,roles: ['admin','editor']}}
          ]
      }
    ]
  },*/


  {
    path: '/classify',
    component: Layout,
    redirect: 'noredirect',
    name: 'classify',
    meta: {
      title: '分类管理',
      icon: 'classify'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: '种酒类别', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: '景点类别', noCache: true }}
    ]
  },
  {
    path: '/basicFile',
    component: Layout,
    redirect: 'noredirect',
    name: 'basicFile',
    meta: {
      title: '基本资料',
      icon: 'basic'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: '公司简介', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: '地址', noCache: true }},
    ]
  },




  //news end
  {
    path: '/productManage',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('productManage/index'),
      name: 'productManage',
      meta: { title: 'productManage', icon: 'scenery', noCache: true, roles: ['admin','editor'] }
    }]
  },
  // { path: '/addProduct', component: _import('productManage/addProduct'), hidden: false },
  {
    path: '/addProduct',
    component: Layout,
    redirect: '/productManage/addProduct',
    children: [{
      path: 'index',
      component: _import('productManage/addProduct'),
      name: 'addProduct',
      meta: { title: 'addProduct', icon: 'documentation', noCache: true, roles: ['admin','editor'] }
    }],
    hidden: false
  },
  {
    path: '/editProduct',
    component: Layout,
    redirect: '/productManage/editProduct',
    children: [{
      path: 'index',
      component: _import('productManage/editProduct'),
      name: 'editProduct',
      meta: { title: 'editProduct', icon: 'documentation', noCache: true }
    }],
    hidden: false
  },




  //-----------my navbar end---------------------//
  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'tinymce', component: _import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
      { path: 'markdown', component: _import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
      { path: 'json-editor', component: _import('components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      { path: 'dnd-list', component: _import('components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'splitpane', component: _import('components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: _import('components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: _import('components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
      { path: 'sticky', component: _import('components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
      { path: 'count-to', component: _import('components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
      { path: 'mixin', component: _import('components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: _import('components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
      { path: 'drag-dialog', component: _import('components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
      { path: 'drag-kanban', component: _import('components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: 'noredirect',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table/complex-table',
    name: 'example',
    meta: {
      title: 'example',
      icon: 'example'
    },
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/complex-table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
          { path: 'tree-table', component: _import('example/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
          { path: 'custom-tree-table', component: _import('example/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip' },
    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: _import('i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
