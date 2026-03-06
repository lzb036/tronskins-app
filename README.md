### 项目采用uniapp ui框架使用uview,由于本项目对性能要求比较高，所以采用nvue.
### [uniapp](https://uniapp.dcloud.net.cn/)
### [uview](https://uviewui.com/guide/demo.html)
### [nvue开发注意事项](https://uniapp.dcloud.net.cn/tutorial/nvue-outline.html#nvue%E5%BC%80%E5%8F%91%E4%B8%8Evue%E5%BC%80%E5%8F%91%E7%9A%84%E5%B8%B8%E8%A7%81%E5%8C%BA%E5%88%AB)
### 模块设计
├── 首页（home）
├── 商品市场模块（product）
│   └── 饰品市场 （product-market）
│   │	└── 最新上架 NewArrivalList
│   │	└── 热门饰品 HotItems
│   │	└── *饰品详情 product-detail
├── 店铺模块 （shop）
│   │── 店铺管理 （shop-manage）
│   │	└── *index
│   │── 求购模块 (buying)
│   │	└── 我的求购 (my-buying)
│   │	└── 发布求购 (buying-request)
│   │	└── 求购记录 (buying-records)
│   │── 订单管理模块 （order-manage）
│   │	└── 待发货 (waiting-delivery)
│   │	└── 待收货 (waiting-receipt)
│   │	└── 我的购买 (my-purchase)
│   │	└── *购买记录 (purchase-records)
│   │── 商品与出售管理模块 (sale-manage)
│   │	└── *商品收藏（product-collect）
│   │	└── *库存管理 （inventory-manage）
│   │	└── 在售中 （on-sale）
│   │	└── 出售记录 （sales-record）
│   │	└── 供应 （supply）
├── 通知中心 (notify-center)
│   └── 待办消息  (todo-message)
│   └── 我的通知:交易通知，公共通知（notify）
├── 帮助中心	(help-center)
│   └── 我的反馈 (feedback)
│   └── 新用户 (new-user-help-center)
├── 用户模块 (user)
│   └── 安全令牌模块（guard）
│   └── 资产模块 (user-assets)
│   │	└── 钱包 (wallet)       
│   │	└── 积分 (integral)      
│   │	└── 权益卡劵 (coupons)    
│   └── 店铺（shop）
│   │	└── *店铺详情（shop-detail）
│   │	└── *店铺设置（shop-settings）
│   └── 用户设置	(user-settings)
│   │	└── 修改密码 (set-password)
│   │	└── 修改昵称 (set-nickname)
│   └── steam管理 (steam)
│   │	└── 获取apiKey （steam-apikey）
│   │	└── 获取交易链接 （steam-transaction-link）
│   │	└── steam会话使用协议 （steam-session）
│   └── 系统设置	(system-settings)
│   │	└── 版本号 (version-number)
│   │	└── 多语言 (multilingual)
│   │	└── 多节点 (multi-node)
├── 登录模块 auth
│   └── 登录 (login)
│   └── steam登录 (steam-login)
│   └── 注册 (register)

### 项目规范
├── 目录命名:全部采用小写方式，以中划线分隔，有复数结构时，要采用复数命名法，缩写不用复数。demo-styles
├── 组件命名:全部采用首字母大写，html上转成小写，以中划线分隔。UserManagement => <user-management></user-management>
├── JS、CSS、SCSS、HTML、PNG文件命名 全部采用小写方式，以中划线分隔。render-dom.js
├── css规范：全部采用小写方式，以中划线分隔 class="user-container"
├── js 规范：全部采用驼峰式 userInfo
├── 标签使用一定要用自闭合组件  <user-management></user-management>  不可以这样  <user-management />
├── 无论是scss 还是html（显示层） 尽量将嵌套深度限制在 3 级避免大量的嵌套规则。当可读性受到影响时，将之打断。

### 存储架构设计
├── utils/storage/
├── memory/              # 内存优化层
│   ├── LRUCache.js      # 智能内存缓存
│   └── WeakRefMap.js    # 弱引用存储
├── disk/                # 磁盘存储层
│   ├── SecureStorage.js # 加密存储
│   └── FileSystem.js    # 大文件管理
├── sync/                # 数据同步
│   ├── QueueManager.js  # 操作队列
│   └── ConflictSolver.js# 冲突解决
└── autoClean.js         # 自动清理策略
└── index.js             # 统一接口
1. 安全存储敏感数据
import { Storage } from '@/utils/storage'

// 存储用户凭证
await Storage.secure.setItem('user_token', {
  token: 'xxxx',
  expire: Date.now() + 3600000
})

// 读取时自动解密
const tokenData = await Storage.secure.getItem('user_token')

2. 高频数据内存缓存
// 缓存城市数据
Storage.memory.set('cities', cityList)

// 获取时优先走内存
function getCities() {
  return Storage.memory.get('cities') || 
         fetchCities().then(data => {
           Storage.memory.set('cities', data)
           return data
         })
}
### 
### http 请求封装
├── utils/http
│   ├── interceptors/      # 拦截器
│   │   ├── auth.js       # 认证拦截
│   │   ├── cache.js      # 缓存管理
│   │   └── error.js      # 错误处理
│   ├── adapters/         # 适配器
│   │   └── uview.js      # uView适配层
│   ├── core/             # 核心逻辑
│   │   ├── Http.js       # 基础封装
│   │   └── Cache.js      # 缓存策略
│   └── index.js          # 统一出口
1. 基础请求
import { get, post } from '@/utils/http'

// GET 请求
get('/users', { page: 1 }, { useCache: true })
  .then(data => console.log(data))
  .catch(err => console.error(err))

// POST 请求
post('/login', { username: 'admin', password: '123456' })
  .then(data => console.log(data))
  .catch(err => console.error(err))
2. 自定义配置
http.request({
  url: '/products',
  method: 'GET',
  params: { category: 'electronics' },
  headers: { 'X-Custom-Header': 'value' },
  useCache: true
})
### 
### 多语言
├── locales/               # 多语言资源
│   ├── en.js             # 英文
│   ├── zh-CN.js          # 中文
│   └── index.js          # 语言管理器
└── plugins/
    └── i18n.js       	  # NVUE 专用多语言工具
	
import i18n from '@/utils/nvue-i18n'
export default {
  data() {
    return {
      i18n: i18n
    }
  },
}
界面上使用 <text class="title">{{ i18n.t('welcome') }}</text>
### 
### 上拉刷新下拉加载组件

```vue
<list-refresh :dataList="listData" @refresh="refresh()" @loadMore="loadMore()">
	<template #item="{ item }">
		<text class="name">{{ item.title }}</text>
	</template>
</list-refresh>
```

 
### 热更