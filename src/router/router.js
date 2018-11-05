import Vue from 'vue'
import Router from 'vue-router'
//探物
import Home from '../pages/home/home'
const Search = r => require.ensure([], () => r(require('../pages/home/search')), 'group-home')
const SearchResult = r => require.ensure([], () => r(require('../pages/home/searchResult')), 'group-home')
const SuggestProduct = r => require.ensure([], () => r(require('../pages/home/suggestProduct')), 'group-home')
const ProductDetails = r => require.ensure([], () => r(require('../pages/home/productDetails')), 'group-home')
const Appraise = r => require.ensure([], () => r(require('../pages/home/appraise')), 'group-home')
const AppraiseAdd = r => require.ensure([], () => r(require('../pages/home/appraiseAdd')), 'group-home')
const AppraiseSuccess = r => require.ensure([], () => r(require('../pages/home/appraiseSuccess')), 'group-home')
const PlaceOrder = r => require.ensure([], () => r(require('../pages/home/placeOrder')), 'group-home')
const Selfs = r => require.ensure([], () => r(require('../pages/home/selfs')), 'group-discover')
const Remark = r => require.ensure([], () => r(require('../pages/home/remark')), 'group-home')
const SelectCoupon = r => require.ensure([], () => r(require('../pages/home/selectCoupon')), 'group-home')
const ProductByRentType = r => require.ensure([], () => r(require('../pages/home/productByRentType')), 'group-home')
const Pay = r => require.ensure([], () => r(require('../pages/home/pay')), 'group-home')
const PaySuccess = r => require.ensure([], () => r(require('../pages/home/paySuccess')), 'group-home')
const PaySuccessHuabei = r => require.ensure([], () => r(require('../pages/home/paySuccessHuabei')), 'group-home')
const Rule = r => require.ensure([], () => r(require('../pages/home/rule')), 'group-home')
/*
import Search from '../pages/home/search'
import SearchResult from '../pages/home/searchResult'
import SuggestProduct from '../pages/home/suggestProduct'
import ProductDetails from '../pages/home/productDetails'
import Appraise from '../pages/home/appraise'
import AppraiseAdd from '../pages/home/appraiseAdd'
import AppraiseSuccess from '../pages/home/appraiseSuccess'
import PlaceOrder from '../pages/home/placeOrder'
import Selfs from '../pages/home/selfs'
import Remark from '../pages/home/remark'
import SelectCoupon from '../pages/home/selectCoupon'
import ProductByRentType from '../pages/home/productByRentType'
import Pay from '../pages/home/pay'
import PaySuccess from '../pages/home/paySuccess'
import Rule from '../pages/home/rule'
*/

//发现
const Discover = r => require.ensure([], () => r(require('../pages/discover/discover')), 'group-discover')
const Share = r => require.ensure([], () => r(require('../pages/discover/share')), 'group-discover')
const ShareAdd = r => require.ensure([], () => r(require('../pages/discover/shareAdd')), 'group-discover')
const ShareSuccess = r => require.ensure([], () => r(require('../pages/discover/shareSuccess')), 'group-discover')
const ShareByTag = r => require.ensure([], () => r(require('../pages/discover/shareByTag')), 'group-discover')
const Comment = r => require.ensure([], () => r(require('../pages/discover/comment')), 'group-discover')
const Information = r => require.ensure([], () => r(require('../pages/discover/information')), 'group-discover')
const Video = r => require.ensure([], () => r(require('../pages/discover/video')), 'group-discover')
const VideoDetails = r => require.ensure([], () => r(require('../pages/discover/videoDetails')), 'group-discover')
const Theme = r => require.ensure([], () => r(require('../pages/discover/theme')), 'group-discover')
const ThemeDetails = r => require.ensure([], () => r(require('../pages/discover/themeDetails')), 'group-discover')
/*
import Discover from '../pages/discover/discover'
import Share from '../pages/discover/share'
import ShareAdd from '../pages/discover/shareAdd'
import ShareByTag from '../pages/discover/shareByTag'
import Comment from '../pages/discover/comment'
import Information from '../pages/discover/information'
import Video from '../pages/discover/video'
import VideoDetails from '../pages/discover/videoDetails'
import Theme from '../pages/discover/theme'
import ThemeDetails from '../pages/discover/themeDetails'
*/
//客服
import Message from '../pages/message/message'
// 我的
import Self from '../pages/self/self'
/*
import Order from '../pages/self/order/order'//订单列表
import OrderDetails from '../pages/self/order/orderDetails' // 订单详情
import Express from '../pages/self/order/express' // 追踪物流
*/
import Coupon from '../pages/self/coupon' // 优惠券
import CouponAdd from '../pages/self/couponAdd' // 兑换优惠券
import Suggestion from '../pages/self/suggestion' // 意见反馈
import SelfEdit from '../pages/self/selfEdit' // 个人主页
import Follower from '../pages/self/follower'//关注列表
import Help from '../pages/self/help' // 个人资料
import ShoppingCart from '../pages/self/shoppingCart' // 购物车
import Login from '../pages/self/login' // 登录
import Register from '../pages/self/register' // 注册
import ZhimaAccredit from '../pages/self/zhimaAccredit' // 授权芝麻信用
import CopyrightTerms from '../pages/self/copyright-terms' // 隐私与知识产权说明
import ServiceTerms from '../pages/self/service-terms' // 法律声明及服务条款
/*
import PasswordForget from '../pages/self/setup/passwordForget' // 忘记密码
import Setup from '../pages/self/setup/setup' // 设置
import PersonalInfo from '../pages/self/setup/personalInfo' // 个人资料
import Address from '../pages/self/setup/address' // 收货地址
import AddressSave from '../pages/self/setup/addressSave' // 编辑地址
import PasswordEdit from '../pages/self/setup/passwordEdit' // 修改密码
import Zhima from '../pages/self/zhima/zhima' // 芝麻分
import ZhimaFace from '../pages/self/zhima/zhimaFace' // 芝麻分
import ZhimaSuccess from '../pages/self/zhima/zhimaSuccess' // 芝麻分
import ZhimaRule from '../pages/self/zhima/zhimaRule' // 芝麻分规则
import ZhimaIDcard from '../pages/self/zhima/zhimaIDcard' // 上传身份证
import ApplyCancel from '../pages/self/order/applyCancel' // 取消订单
import ServiceRelet from '../pages/self/order/serviceRelet' // 续租
import OrderMultiselect from '../pages/self/order/orderMultiselect' // 归还
import ServiceSuccess from '../pages/self/order/serviceSuccess' // 申请成功
import ServiceAfterSale from '../pages/self/order/serviceAfterSale' // 申请售后
import ServiceRefundExchange from '../pages/self/order/serviceRefundExchange' // 申请售后-上传图片
import RefundBill from '../pages/self/order/refundBill'
import ReturnProduct from '../pages/self/order/returnProduct'
import ReturnSelf from '../pages/self/order/returnSelf'
import ReturnResult from '../pages/self/order/returnResult'
import ReturnSF from '../pages/self/order/returnSF'
import ReturnNumber from '../pages/self/order/returnNumber'
import Relet from '../pages/self/order/relet'
import OrderBill from '../pages/self/order/orderBill'
import DivideBill from '../pages/self/order/divideBill'
import OverdueBill from '../pages/self/order/overdueBill'
*/

const Order = r => require.ensure([], () => r(require('../pages/self/order/order')), 'group-order')
const OrderDetails = r => require.ensure([], () => r(require('../pages/self/order/orderDetails')), 'group-order')
const Express = r => require.ensure([], () => r(require('../pages/self/order/express')), 'group-order')

const PasswordForget = r => require.ensure([], () => r(require('../pages/self/setup/passwordForget')), 'group-setup')
const Setup = r => require.ensure([], () => r(require('../pages/self/setup/setup')), 'group-setup')
const PersonalInfo = r => require.ensure([], () => r(require('../pages/self/setup/personalInfo')), 'group-setup')
const Address = r => require.ensure([], () => r(require('../pages/self/setup/address')), 'group-setup')
const AddressSave = r => require.ensure([], () => r(require('../pages/self/setup/addressSave')), 'group-setup')
const PasswordEdit = r => require.ensure([], () => r(require('../pages/self/setup/passwordEdit')), 'group-setup')

const Zhima = r => require.ensure([], () => r(require('../pages/self/zhima/zhima')), 'group-zhima')
const ZhimaFace = r => require.ensure([], () => r(require('../pages/self/zhima/zhimaFace')), 'group-zhima')
const ZhimaSuccess = r => require.ensure([], () => r(require('../pages/self/zhima/zhimaSuccess')), 'group-zhima')
const ZhimaRule = r => require.ensure([], () => r(require('../pages/self/zhima/zhimaRule')), 'group-zhima')
const ZhimaIDcard = r => require.ensure([], () => r(require('../pages/self/zhima/zhimaIDcard')), 'group-zhima')

const ApplyCancel = r => require.ensure([], () => r(require('../pages/self/order/applyCancel')), 'group-order')
const ServiceRelet = r => require.ensure([], () => r(require('../pages/self/order/serviceRelet')), 'group-order')
const OrderMultiselect = r => require.ensure([], () => r(require('../pages/self/order/orderMultiselect')), 'group-order')
const ServiceSuccess = r => require.ensure([], () => r(require('../pages/self/order/serviceSuccess')), 'group-order')
const ServiceAfterSale = r => require.ensure([], () => r(require('../pages/self/order/serviceAfterSale')), 'group-order')
const ServiceRefundExchange = r => require.ensure([], () => r(require('../pages/self/order/serviceRefundExchange')), 'group-order')
const RefundBill = r => require.ensure([], () => r(require('../pages/self/order/refundBill')), 'group-order')
const ReturnProduct = r => require.ensure([], () => r(require('../pages/self/order/returnProduct')), 'group-order')
const ReturnSelf = r => require.ensure([], () => r(require('../pages/self/order/returnSelf')), 'group-order')
const ReturnResult = r => require.ensure([], () => r(require('../pages/self/order/returnResult')), 'group-order')
const ReturnSF = r => require.ensure([], () => r(require('../pages/self/order/returnSF')), 'group-order')
const ReturnNumber = r => require.ensure([], () => r(require('../pages/self/order/returnNumber')), 'group-order')
const Relet = r => require.ensure([], () => r(require('../pages/self/order/relet')), 'group-order')
const OrderBill = r => require.ensure([], () => r(require('../pages/self/order/orderBill')), 'group-order')
const DivideBill = r => require.ensure([], () => r(require('../pages/self/order/divideBill')), 'group-order')
const OverdueBill = r => require.ensure([], () => r(require('../pages/self/order/overdueBill')), 'group-order')

//常驻
import CalendarH5 from '../pages/permanent/calendarH5' // 时间选择器 提供给其他客户端
import VisitCus from '../pages/permanent/visitCus' // 客户信息 提供给支付宝小程序的客服
import TimeOut from '../pages/permanent/timeOut' // 服务超时
import NotFound from '../pages/permanent/notFound' // 未找到页面
import ClientLog from '../pages/permanent/clientLog' // 日志打印

//活动

const BackToSchool = r => require.ensure([], () => r(require('../pages/activity/backToSchool')), 'group-activity') //开学季 发福利
const NationalDay = r => require.ensure([], () => r(require('../pages/activity/nationalDay')), 'group-activity') //国庆节 常规
const NationalDayAlipay = r => require.ensure([], () => r(require('../pages/activity/nationalDayAlipay')), 'group-activity') //国庆节 支付宝 常规
const NationalDayProducts = r => require.ensure([], () => r(require('../pages/activity/nationalDay/nationalDayProducts')), 'group-activity') //国庆节 相机
const Iqiyi = r => require.ensure([], () => r(require('../pages/activity/iqiyi/iqiyi')), 'group-activity') //iqiyi
const Iqiyi2018_10_23 = r => require.ensure([], () => r(require('../pages/activity/iqiyi/iqiyi2018_10_23')), 'group-activity') //爱奇艺活动优惠券兑换
const MidAutumn = r => require.ensure([], () => r(require('../pages/activity/midAutumn')), 'group-activity') //中秋节
const Pico = r => require.ensure([], () => r(require('../pages/activity/pico')), 'group-activity') //pico
const Botao = r => require.ensure([], () => r(require('../pages/activity/botao/botao')), 'group-activity') //botao
const BotaoTW = r => require.ensure([], () => r(require('../pages/activity/botao/botaoTW')), 'group-activity') //botao
const Suning = r => require.ensure([], () => r(require('../pages/activity/suning/suning')), 'group-activity') //suning

Vue.use(Router)

const router = new Router({
  // mode: "history",
    routes:  [
    		{ path: '/', redirect: '/home', meta: { title: '探物' } },

    		//探物
	    { path: '/home', component: Home, meta: { keepAlive: true , title: '探物' } },
	    { path: '/search',component: Search,meta: {title: '搜索'}},
	    { path: '/searchResult',name: 'searchResult',component: SearchResult,meta: {title: '搜索结果'}},
	    { path: '/suggestProduct',component: SuggestProduct,meta: {title: '补充产品'}},
	    { path: '/productDetails', component: ProductDetails, meta: { title: '商品详情' } },
	    { path: '/appraise', component: Appraise, meta: { title: '用户口碑' } },
	    { path: '/appraiseAdd', component: AppraiseAdd, meta: { title: '添加口碑' } },
	    { path: '/appraiseSuccess', component: AppraiseSuccess, meta: { title: '审核口碑' } },
	   	{ path: '/placeOrder', component: PlaceOrder, meta: { keepAlive: true , title: '确认订单' } },
	    { path: '/selfs', component: Selfs, meta: { title: '请选择自提点' } },
	    { path: '/remark', component: Remark, meta: { title: '备注信息' } },
	    { path: '/selectCoupon', component: SelectCoupon, meta: { title: '优惠券' } },
	    { path: '/productByRentType', component: ProductByRentType, meta: { title: '优选长租' } },
	    { path: '/pay', component: Pay, meta: { title: '支付中心' } },
	    { path: '/paySuccess', component: PaySuccess, meta: { title: '支付成功' } },
	    { path: '/paySuccessHuabei', component: PaySuccessHuabei, meta: { title: '支付订单' } },
	    { path: '/rule', component: Rule, meta: { title: '常见问题' } },

		//发现
	    { path: '/discover', component: Discover, children:[ { path: '/discover/share', component: Share,meta: { title: '动态' }}, { path: '/discover/information', component: Information,meta: { title: '资讯' }} ],redirect:'/discover/share', meta: { keepAlive: true , title: '发现' }},
	    { path: '/shareAdd', component: ShareAdd, meta: { title: '发布动态' } },
	    { path: '/shareSuccess', component: ShareSuccess, meta: { title: '发布成功' } },
	    { path: '/shareByTag', component: ShareByTag, meta: { title: '动态分类' } },
	    { path: '/comment', component: Comment, meta: { title: '全部评论' } },
	    { path: '/video', component: Video, meta: { title: '热门视频' } },
	    { path: '/videoDetails', component: VideoDetails, meta: { title: '视频详情' } },
	    { path: '/theme', component: Theme, meta: { title: '精选专题' } },
	    { path: '/themeDetails', component: ThemeDetails, meta: { title: '专题详情' } },

		//消息
	    { path: '/message', component: Message, meta: { keepAlive: true , title: '消息' } },

	    //我的
	    { path: '/self', component: Self, meta: { title: '个人' } },
		{ path: '/order', component: Order, meta: { title: '全部订单' } },
		{ path: '/orderDetails', component: OrderDetails, meta: { title: '订单详情' } },
		{ path: '/express', component: Express, meta: { title: '跟踪订单' } },
		{ path: '/coupon', component: Coupon, meta: { title: '优惠券' } },
		{ path: '/couponAdd', component: CouponAdd, meta: { title: '兑换优惠券' } },
		{ path: '/self/suggestion', component: Suggestion, meta: { title: '意见反馈' } },
		{ path: '/self/selfEdit', component: SelfEdit, meta: { title: '个人主页' } },
		{ path: '/follower', component: Follower,  meta: { title: '关注列表' } },
		{ path: '/self/help', component: Help, meta: { title: '帮助中心' } },
		{ path: '/self/shoppingCart', component: ShoppingCart,  meta: { title: '购物清单' } },
		{ path: '/login', component: Login, meta: { title: '登录' } },
		{ path: '/register', component: Register,  meta: { title: '注册' } },
		{ path: '/zhimaAccredit', component: ZhimaAccredit,  meta: { title: '芝麻信用授权' } },
		{ path: '/copyright-terms', component: CopyrightTerms,  meta: { title: '隐私与知识产权说明' } },
		{ path: '/service-terms', component: ServiceTerms,  meta: { title: '法律声明及服务条款' } },
		{ path: '/passwordForget', component: PasswordForget,  meta: { title: '忘记密码' } },
		{ path: '/self/setup', component: Setup,  meta: { title: '设置' } },
		{ path: '/self/personalInfo', component: PersonalInfo,  meta: { title: '个人资料' } },
		{ path: '/self/address', component: Address,  meta: { title: '收货地址' } },
		{ path: '/self/addressSave', component: AddressSave,  meta: { title: '收货地址' } },
		{ path: '/self/passwordEdit', component: PasswordEdit,  meta: { title: '重置密码' } },
		{ path: '/zhima', component: Zhima,  meta: { title: '芝麻信用授权' } },
		{ path: '/zhimaFace', component: ZhimaFace,  meta: { title: '芝麻授权' } },
		{ path: '/zhimaSuccess', component: ZhimaSuccess,  meta: { title: '芝麻分' } },
		{ path: '/zhimaRule', component: ZhimaRule,  meta: { title: '芝麻分规则' } },
		{ path: '/zhimaIDcard', component: ZhimaIDcard,  meta: { title: '认证身份信息' } },
		{ path: '/self/applyCancel', component: ApplyCancel,  meta: { title: '取消订单' } },
		{ path: '/self/serviceRelet', component: ServiceRelet,  meta: { title: '续租' } },
		{ path: '/self/orderMultiselect', component: OrderMultiselect,  meta: { title: '归还' } },
		{ path: '/self/serviceSuccess', component: ServiceSuccess,  meta: { title: '申请成功' } },
		{ path: '/self/serviceAfterSale', component: ServiceAfterSale,  meta: { title: '申请售后' } },
		{ path: '/self/serviceRefundExchange', component: ServiceRefundExchange,  meta: { title: '申请售后' } },
		{ path: '/refundBill', component: RefundBill,  meta: { title: '退款明细' } },
		{ path: '/returnProduct', component: ReturnProduct,  meta: { title: '产品归还' } },
		{ path: '/returnSelf', component: ReturnSelf,  meta: { title: '上门自还' } },
		{ path: '/returnResult', component: ReturnResult,  meta: { title: '产品归还' } },
		{ path: '/returnSF', component: ReturnSF,  meta: { keepAlive: true , title: '预约顺丰' } },
		{ path: '/returnNumber', component: ReturnNumber,  meta: { title: '填写单号' } },
		{ path: '/relet', component: Relet,  meta: { title: '产品续租' } },
		{ path: '/orderBill', component: OrderBill,  meta: { title: '剩余待还' } },
		{ path: '/divideBill', component: DivideBill,  meta: { title: '分期账单' } },
		{ path: '/overdueBill', component: OverdueBill,  meta: { title: '本期明细' } },

		//常驻
		{ path: '/calendarH5', component: CalendarH5,  meta: { title: '选择时间' } },
		{ path: '/visitCus', component: VisitCus,  meta: { title: '客户信息' } },
		{ path: '/timeOut', component: TimeOut,  meta: { title: '服务超时' } },
		{ path: '/clientLog', component: ClientLog,  meta: { title: '日志打印' } },


		//活动
		{ path: '/activity/backToSchool', component: BackToSchool,  meta: { title: '开学季 发福利' } },
		{ path: '/activity/nationalDay', component: NationalDay,  meta: { title: '万份现金鼓励' } },
		{ path: '/activity/nationalDayAlipay', component: NationalDayAlipay,  meta: { title: '万份现金鼓励' } },
		{ path: '/activity/nationalDayProducts', component: NationalDayProducts,  meta: { title: '国庆产品' } },
		{ path: '/activity/iqiyi', component: Iqiyi,  meta: { title: '爱奇艺活动详情' } },
		{ path: '/activity/iqiyi2018_10_23', component: Iqiyi2018_10_23,  meta: { title: '爱奇艺活动优惠券兑换' } },
		{ path: '/activity/midAutumn', component: MidAutumn,  meta: { title: '中秋节' } },
		{ path: '/activity/pico', component: Pico,  meta: { title: 'Pico活动报名' } },
		{ path: '/activity/botao', component: Botao,  meta: { title: '彩色之旅' } },
		{ path: '/activity/botaoTW', component: BotaoTW,  meta: { title: '彩色之旅' } },
		{ path: '/activity/suning', component: Suning,  meta: { title: '帮客家' } },

		{ path:'*',component:NotFound,meta: { title: '页面错误' } }
  	]
})

export default router
