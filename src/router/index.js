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

/*  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [{
      path: 'index',
      component: _import('documentation/index'),
      name: 'documentation',
      meta: { title: 'documentation', icon: 'documentation', noCache: true }
    }]
  }*/
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步动态路由表
export const asyncRouterMap = [
 /* {
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
  },*/
  //-----------my navbar start---------------------//
  //new add router
  /*{
    path: '/sceneryIntroduce',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('sceneryIntroduce/index'),
      name: 'sceneryIntroduce',
      meta: { title: '景点介绍', icon: 'scenery', noCache: true, roles: ['admin','editor'] }
    }]
  },*/

 /* {
    path: '/enterPark',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('enterPark/index'),
      name: 'enterPark',
      meta: { title: '入园参考', icon: 'ad', noCache: true, roles: ['admin','editor'] }
    }]
  },*/

  {
    path: '/userManage',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('userManage/index'),
      name: 'userManage',
      meta: { title: 'userManage', icon: 'user', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/userWithdraw',
    component: Layout,
    children: [{
      path: 'withdraw-table',
      component: _import('userWithdraw/withdrawTable'),
      name: 'userWithdraw',
      meta: { title: 'userWithdraw', icon: 'withdraw', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/userRecharge',
    component: Layout,
    children: [{
      path: 'recharge-table',
      component: _import('userRecharge/rechargeTable'),
      name: 'rechargeTable',
      meta: { title: 'rechargeTable', icon: 'withdraw', noCache: true, roles: ['admin','editor'] }
    }]
  },
  {
    path: '/userTransfer',
    component: Layout,
    children: [{
      path: 'transfer-table',
      component: _import('userTransfer/transferTable'),
      name: 'userTransfer',
      meta: { title: 'userTransfer', icon: 'transfer', noCache: true, roles: ['admin','editor'] }
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
      meta: { title: 'editUser', icon: 'documentation', noCache: true }
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
      meta: { title: 'userDegree', icon: 'documentation', noCache: true }
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

  //园区景区
  {
    path: '/scenery-manage',
    component: Layout,
    redirect: '/scenery-manage/parks/parks-list',
    name: 'sceneryManage',
    meta: {
      title: 'sceneryManage',
      icon: 'example'
    },
    children: [
      {
        path: '/scenery-manage/parks',
        component: _import('sceneryManage/parks/index'),
        redirect: '/scenery-manage/parks/parks-list',
        name: 'parks',
        meta: {
          title: 'parks',
          icon: 'table'
        },
        children: [
          { path: 'office-news-list', component: _import('sceneryManage/parks/parksList'), name: 'parksList', meta: { title: 'parksList',  icon: 'table', noCache: true }},
          // { path: 'add-office-news', component: _import('news/officeNews/addOfficeNews'), name: 'addOfficeNews', meta: { title: 'addOfficeNews', noCache: true }},
          // { path: 'edit-office-news', component: _import('news/officeNews/editOfficeNews'), name: 'editOfficeNews', meta: { title: 'editOfficeNews', noCache: true}, hidden: true }
        ]
      },
      {
        path: '/scenery-manage/scenery',
        component: _import('sceneryManage/scenery/index'),
        redirect: '/scenery-manage/scenery/scenery-list',
        name: 'scenery',
        meta: {
          title: 'scenery',
          icon: 'table'
        },
        children: [
          { path: 'scenery-list', component: _import('sceneryManage/scenery/sceneryList'), name: 'sceneryList', meta: { title: 'sceneryList', noCache: true }},
          { path: 'add-scenery', component: _import('sceneryManage/scenery/addScenery'), name: 'addScenery', meta: { title: 'addScenery', noCache: true }},
          { path: 'edit-scenery', component: _import('sceneryManage/scenery/editScenery'), name: 'eidtScenery', meta: { title: 'eidtScenery', noCache: true}, hidden: true }
        ]
      }
    ]
  },


  //入园参考
  {
    path: '/park-see',
    component: Layout,
    redirect: '/park-see/park-in/park-in-list',
    name: 'parkSee',
    meta: {
      title: 'parkSee',
      icon: 'example'
    },
    children: [
      {
        path: '/park-see/park-in',
        component: _import('parkSee/parkIn/index'),
        redirect: '/park-see/park-in/park-in-list',
        name: 'parkIn',
        meta: {
          title: 'parkIn',
          icon: 'table'
        },
        children: [
          { path: 'park-in-list', component: _import('parkSee/parkIn/parkInList'), name: 'parkInList', meta: { title: 'parkInList', noCache: true }},
          { path: 'add-parkin', component: _import('parkSee/parkIn/addParkin'), name: 'addParkin', meta: { title: 'addParkin', noCache: true }},
          { path: 'edit-parkin', component: _import('parkSee/parkIn/editParkin'), name: 'editParkin', meta: { title: 'editParkin', noCache: true}, hidden: true }
        ]
      }
    ]
  },



  //众筹景点
  {
    path: '/fund-product',
    component: Layout,
    redirect: '/fund-product/fund-scenery/fund-list',
    name: 'fundProduct',
    meta: {
      title: 'fundProduct',
      icon: 'example'
    },
    children: [
      {
        path: '/fund-product/fund-scenery',
        component: _import('fundProduct/fundScenery/index'),
        redirect: '/fund-product/fund-scenery/fund-list',
        name: 'fundScenery',
        meta: {
          title: 'fundScenery',
          icon: 'table'
        },
        children: [
          { path: 'fund-list', component: _import('fundProduct/fundScenery/fundList'), name: 'fundList', meta: { title: 'fundList', noCache: true }},
          { path: 'share-all-list', component: _import('fundProduct/fundScenery/shareAllList'), name: 'shareAllList', meta: { title: 'shareAllList', noCache: true },hidden: true},
          { path: 'share-one-list', component: _import('fundProduct/fundScenery/shareOneList'), name: 'shareOneList', meta: { title: 'shareOneList', noCache: true },hidden: true},
          { path: 'fund-user-list', component: _import('fundProduct/fundScenery/fundUserList'), name: 'fundUserList', meta: { title: 'fundUserList', noCache: true },hidden:true},
          { path: 'add-fund', component: _import('fundProduct/fundScenery/addFund'), name: 'addFund', meta: { title: 'addFund', noCache: true }},
          { path: 'edit-fund', component: _import('fundProduct/fundScenery/editFund'), name: 'editFund', meta: { title: 'editFund', noCache: true}, hidden: true }
        ]
      }
    ]
  },



  //窖酒
  {
    path: '/wine-manage',
    component: Layout,
    redirect: '/wine-manage/parks/parks-list',
    name: 'wineManage',
    meta: {
      title: 'wineManage',
      icon: 'example'
    },
    children: [

      {
        path: '/wine-manage/classify',
        component: _import('wineManage/classify/index'),
        redirect: '/wine-manage/classify/wine-classify',
        name: 'classify',
        meta: {
          title: 'classify',
          icon: 'table'
        },
        children: [{
          path: 'wine-classify',
          component: _import('wineManage/classify/wineClassify'),
          name: 'wineClassify',
          meta: { title: 'wineClassify', icon: 'documentation', noCache: true }
        }],
        hidden: false
      },
      {
        path: '/wine-manage/wine',
        component: _import('wineManage/wine/index'),
        redirect: '/wine-manage/wine/wine-list',
        name: 'wine',
        meta: {
          title: 'wine',
          icon: 'table'
        },
        children: [
          { path: 'wine-list', component: _import('wineManage/wine/wineList'), name: 'wineList', meta: { title: 'wineList', noCache: true }},
          { path: 'add-wine', component: _import('wineManage/wine/addWine'), name: 'addWine', meta: { title: 'addWine', noCache: true }},
          { path: 'edit-wine', component: _import('wineManage/wine/editWine'), name: 'editWine', meta: { title: 'editWine', noCache: true}, hidden: true }
        ]
      },
      {
        path: '/wine-manage/wine-order',
        component: _import('wineManage/wineOrder/index'),
        redirect: '/wine-manage/wine-order/wine-order-list',
        name: 'wineOrder',
        meta: {
          title: 'wineOrder',
          icon: 'table'
        },
        children: [
          { path: 'wine-order-list', component: _import('wineManage/wineOrder/wineOrderList'), name: 'wineOrderList', meta: { title: 'wineOrderList',icon: 'documentation', noCache: true }},
          { path: 'wine-order-detail', component: _import('wineManage/wineOrder/wineOrderDetail'), name: 'wineOrderDetail', meta: { title: 'wineOrderDetail', noCache: true },hidden: true},
          // { path: 'edit-office-news', component: _import('news/officeNews/editOfficeNews'), name: 'editOfficeNews', meta: { title: 'editOfficeNews', noCache: true}, hidden: true }
        ]
      },
      {
        path: '/wine-manage/wine-now',
        component: _import('wineManage/wineNow/index'),
        // redirect: '/wine-manage/wine-now/wine-list',
        name: 'wineNow',
        meta: {
          title: 'wineNow',
          icon: 'table'
        },
        children: [
          {
            path: 'wine-now',
            component: _import('wineManage/wineNow/index'),
            name: 'wineAddNow',
            meta: { title: 'wineAddNow', icon: 'documentation', noCache: true }
          }
        ]
      },
    ]
  },

  {
    path: '/ad-place',
    component: Layout,
    redirect: '/ad-place/ad-list',
    name: 'adPlace',
    meta: {
      title: 'adPlace',
      icon: 'ad'
    },
    children: [
      { path: 'ad-list', component: _import('ad-place/adList'), name: 'adList', meta: { title: 'adList', noCache: true }},
      { path: 'add-ad', component: _import('ad-place/addAd'), name: 'addAd', meta: { title: 'addAd', noCache: true }},
      { path: 'edit-ad', component: _import('ad-place/editAd'), name: 'editAd', meta: { title: 'editAd', noCache: true}, hidden: true }
    ]
    // { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
  },
  /*{
    path: '/classify',
    component: Layout,
    redirect: 'noredirect',
    name: 'classify',
    meta: {
      title: '种酒分类',
      icon: 'classify'
    },
    children: [
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: '种酒类别', noCache: true }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: '景点类别', noCache: true }}
    ]
  },*/



  //基本资料
  {
    path: '/basicFile',
    component: Layout,
    redirect: 'noredirect',
    name: 'basicFile',
    meta: {
      title: '基本资料',
      icon: 'personCenter'
    },
    children: [
      // { path: 'basic-info', component: _import('basicFile/basicInfo'), name: 'basicInfo', meta: { title: 'basicInfo', noCache: true }},
      { path: 'edit-info', component: _import('basicFile/editInfo'), name: 'editInfo', meta: { title: 'editInfo', icon: 'personCenter', noCache: true }},
    ]
  },
  {
    path: '/buyFundAgreement',
    component: Layout,
    redirect: 'noredirect',
    name: 'buyFundAgreement',
    meta: {
      title: '众筹协议',
      icon: 'personCenter'
    },
    children: [
      // { path: 'basic-info', component: _import('basicFile/basicInfo'), name: 'basicInfo', meta: { title: 'basicInfo', noCache: true }},
      { path: 'edit-info', component: _import('buyFundAgreement/editInfo'), name: 'buyFundAgreementInfo', meta: { title: 'buyFundAgreement', icon: 'personCenter', noCache: true }},
    ]
  },
  {
    path: '/buyWineAgreement',
    component: Layout,
    redirect: 'noredirect',
    name: 'buyWineAgreement',
    meta: {
      title: '基本资料',
      icon: 'personCenter'
    },
    children: [
      // { path: 'basic-info', component: _import('basicFile/basicInfo'), name: 'basicInfo', meta: { title: 'basicInfo', noCache: true }},
      { path: 'edit-info', component: _import('buyWineAgreement/editInfo'), name: 'buyWineAgreementInfo', meta: { title: 'buyWineAgreement', icon: 'personCenter', noCache: true }},
    ]
  },



  //news end
/*  {
    path: '/productManage',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('productManage/index'),
      name: 'productManage',
      meta: { title: 'productManage', icon: 'scenery', noCache: true, roles: ['admin','editor'] }
    }]
  },*/
  // { path: '/addProduct', component: _import('productManage/addProduct'), hidden: false },
 /* {
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
  },*/
  /*{
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
  },*/




  //-----------my navbar end---------------------//
/*  {
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

  { path: '*', redirect: '/404', hidden: true }*/
]
