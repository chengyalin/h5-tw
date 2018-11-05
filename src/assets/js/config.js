//测试
// const hostActivity = "https://alpha.api2.tanwuapp.cn";
//开发
//const hostActivity = "https://devbeta.tanwuapp.cn";
//预发布
//const hostActivity = "https://prepub.api.tanwuapp.com";
//不帅
//const hostActivity = "http://192.168.199.77:8282";
// 梁
//const hostActivity = "https://dev.tanwuapp.cn";
//生产环境
const hostActivity = "https://api.tanwuapp.com";
//梁梁梁
//const hostActivity = "http://192.168.199.201:8060";


//const encodeLink = 'https%3a%2f%2fdever2m.tanwuapp.cn';

//const encodeLink = 'https%3a%2f%2falpha.m2.tanwuapp.cn';

const encodeLink = 'https%3a%2f%2fm.tanwuapp.com';

var productFlag = true;
var uploadFileUrlBase64 =  productFlag ? 'https://up.qbox.me/putb64/-1' : 'https://up-z2.qbox.me/putb64/-1';
var imageHost = productFlag ? 'https://resource.tanwuapp.com/' : 'http://test.resource.tanwuapp.com/';

const host = hostActivity + "/iOS/2.0.0";

export const CONFIG = {
    //七牛 base64
    uploadFileUrlBase64: uploadFileUrlBase64,
    //图片前缀
    imageHost:imageHost,
    //获取七牛上传token
    uploadToken:host+'/user/upload',
    //首页数据
	homes:host+"/homes",
  	//首页活动弹框
 	enterAppCueInfo:host+'/enterAppCueInfo',
	//产品类型
	productTypes: host+'/productTypes',
	//短租产品 初始化价格
    productPrice: host+'/product/price',
	//短租产品 初始化可选租期
    optionalDate:host+'/order/optional/date',
    //短租产品 点击筛选日期
    optionalEndDate: host+'/order/optional/endDate',
    //长租产品 初始化属性
	productInit:host+"/product/init",
	//美恰 获取用户信息
	userbaseInfo:host+'/user/baseInfo',
	//根据地址获取
	productSendDay:host+'/product/sendDay',
	//长租短租列表
	products:host+'/products',
	//口碑 点赞
	appraisePraise:host+"/appraise/1/praise",
	//保存订单
	orderSave:host+'/order/save',
	//生成支付签名
	shoppingPaySign:host+'/shopping/paySign',
	//信用借还
	alipayRentCreate:host+'/alipay/rent/create',
	//长租支付接口
	paymentLongPaySign:host+'/payment/longPaySign',
	//猜你喜欢
	productGuess:host+'/product/guess',

	//用户信息
	user:host+'/user',
	//订单状态
	userHeader:host+'/user/header',
	//订单详情
	orderInfoDetailsInfo:host+'/orderInfo/details/info',
	//类型状态订单
	orderInfoTypeList:host+'/orderInfo/type/list',
	//全部订单状态
	orderInfoList:host+'/orderInfo/list',
	//咨询问题
	help:host+'/help/question',
	//关于我
	notifyAboutMe:host+'/notify/about-me',
	//通知
	notifyPush:host+'/notify/push',
	//跟踪订单
	orderCourier:host+'/order/courier',
	//优惠券
	userCouponList:hostActivity+'/iOS/V2.0/user/coupon/v2/list',
	//兑换优惠券
	activityCovertCoupon: host +'/activity/covertCoupon',
	//常见问题
	help:host+'/help/question',
	//个人资料
	userHeader:host+'/user/header',
	//个人动态
	userShares:host+"/user/shares",
	//购物清单
	shoppingList:host+'/shopping/list',
	//更新数据购物清单
	shoppingUpdate:host+'/shopping/update',
	//删除购物清单数据
	shoppingDelete:host+'/shopping/delete',
	//购物车 下单 初始化
	shoppingOrderInit:host+'/shopping/order/init',
	//购物车 下单
	shoppingOrderSave:host+'/shopping/order/save',
	//验证码登陆
	userLoginSMS:host+'/user/login/SMS',
	//密码登录
	login:host+'/user/login',
	//微信授权登陆
	wechatAuthorization: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3f44f85ee06b85f8&redirect_uri=http%3A%2F%2F150.api.tanwuapp.com%2Fwechat%2Fauth&response_type=code&scope=snsapi_userinfo&state=login#wechat_redirect',
	//三方登陆
	loginThird:host+'/user/login/thirdParty',
	//app登陆
	webLoginAuth:host+'/web/login/auth',
	//登录发送验证码
	userSMScode:host+'/user/SMScode',
	//是否已经绑定手机号码
	updataThirdInfo:host+'/user/update/thirdInfo',
	//注册
	register:host+'/user/register',
	//注册验证码
	checkTelCode:host+'/user/Register/SMScode',
	//忘记密码
	userForgetPwd:host+'/user/forget/pwd',
	//忘记密码发送验证码
	userCheckSMScode:host+'/user/CheckSMScode',
	//帮助中心有帮助和没帮助的
	ruleCountTools:host+'/rule/countTools',
	//退出登录
	logout:host+'/user/logout',
	//个人资料信息
	userInfo:host+'/user/info',
	//收货地址
	addresses:host+'/user/addresses',
	//修改地址
	addressesInfo :host+'/user/address/info',
	//修改默认地址
	addressDefault :host+'/user/address/default',
	//删除地址
	addressesDelete :host+'/user/address/delete',
	//修改地址
	addressesUpdate:host+'/user/address/update',
	//保存地址
	addressesSave :host+'/user/address/save',
	//支付宝
	//zhimaOpenAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016062101539662&scope=auth_zhima,auth_user&redirect_uri=https%3a%2f%2fm.tanwuapp.com/self/zhima.html',
	zhimaOpenAuth:'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016062101539662&scope=auth_zhima,auth_user&redirect_uri=' + encodeLink + '%2f%23%2fzhima',
	//支付宝授权查询
	authAuthQuery:host+"/auth/authQuery",
	//支付宝内初始化
	payZmxyInit:host+'/pay/zmxy/init',
	//支付宝code 查询用户
	authAuthStart:host+"/auth/authStart",
	//查询芝麻分
	authZhimaScore:host+"/auth/zhimaScore",

	payZmxyAuth:host+'/pay/zmxy/auth',

	payZmxyScore:host+'/pay/zmxy/score',

	uploadToken:host+'/user/upload',
	//身份证校验
	authOcridcard:host+"/auth/ocridcard",
	//人脸识别结果查询
	authFaceQuery:host+"/auth/faceQuery",
	//人脸识别初始化
	authFaceInit:host+"/auth/faceInit",
	//
	userUpdate:host+'/user/update',
	//退款、售后初始化
	serviceInit:host+"/service/init",
	//取消订单
	orderInfoCancel:host+'/orderInfo/cancel',
	//申请退款
	orderInfoApplyServiceOrRefund:host+'/orderInfo/applyServiceOrRefund',
	//订单退款/售后详情
	orderInfoRefundInfo:host+'/orderInfo/refund/info',
	//订单删除
	orderInfoDelete:host+'/orderInfo/delete',


	//产品详情
	product :host+'/product/1',
	//产品详情服务
	longRectQueryCommonConfig:host+'/longRect/queryCommonConfig',
	//口碑 头部数据
	appraisesHeader:host+'/product/1/appraises/data',
	//口碑 列表
	appraises:host+'/product/1/appraises',
	//口碑添加 订单
	orderAppraiseSave:host+'/order/appraise/save',
	//口碑添加 产品
    productAppraiseSave:host+'/product/appraise/save',
    //口碑 领取优惠券
    appraiseCoupon: host+'/order/appraise/coupon',
    //产品信息
    productBrief:host+'/product/1/brief',
	//优惠券 领取
	couponReceive: host+'/coupon/receive',
	//单订单初始化
	orderInfo:host+'/order/info',
	//确认订单
    orderSave:host+'/order/save',
    //自提点
    orderSelfs:host+'/order/selfs',
    //加入购物车
    shoppingSave:host+'/shopping/save',
    //问题分类接口
	ruleTypes:host+"/rule/types",
	//产品、类型下的问题列表
	ruleList:host+"/rule/list",

	//动态 列表
	shares:host+"/shares",
	//动态标签 列表
	sharesByTag:host+"/sharesByTag",
	//动态所有标签
	sharesTags:host+"/share/tags",
	//动态 评论 列表
	shareComments:host+"/share/comments",
	//动态 评论
	shareComment:host+"/share/comment",
	//动态 评论 点赞
	shareCommentPraise:host+"/share/comment/praise",
	//动态 点赞
	sharePraise:host+"/share/1/praise",
	//动态 添加
	shareInsert:host+"/share/insert",
	//动态 举报
	reportShare:host+"/report/share",
	//动态 删除
	shareDelete:host+"/share/delete",
	//视频 列表
    videos:host+"/videos",
	//视频 详情
	videoDetails:host+'/video/details',
	//视频 点赞
	videoPraise:host+'/video/praise',
	//视频 评论
	videoCommentRelease: host+'/video/comment/release',
	//视频 评论 列表
	videoComment:host+'/video/comment',
	//视频 评论 点赞
	videoCommentPraise:host+'/video/comment/praise',
    //资讯 列表
    news:host+"/news",
	//精选专题 列表
    themes:host+'/themes',
    //精选专题 详情
    themesInfo:host+'/theme/info',
    //精选专题 点赞
    themesPraise:host+'/theme/praise',
    //精选专题 评论 列表
    themesComment:host+'/theme/comment',
    //精选专题 评论
    themeCommentRelease:host+'/theme/comment/release',
    //精选专题 评论 点赞
    themeCommentPraise:host+'/theme/comment/praise',
    //热门搜索
    searchKey:host+'/searchKey',
    //搜索结果 产品
    searchProducts:host+'/search/products',
    //搜索栏模糊查询
    searchBar:host+'/search/bar',
    //意见反馈
    feedbackOpinion:hostActivity+'/iOS/V2.0/feedback/v2/opinion',

    userHeadThumbs:host+'/user/headThumbs',


    //全部退款明细
	orderInfoRefundAllDetail:host+'/orderInfo/refund/allDetail',
	//订单退款明细
	orderInfoRefundDetail:host+'/orderInfo/refund/detail',
	//关注列表
	userFollows:host+'/user/follows',
	//关注人列表
	userFollowers:host+'/user/followers',
	//关注
	userFollow:host+'/user/follow',
	//订单产品
	orderProduct:host+'/order/product',
	//获取地址
	reservationCheck:host+'/order/reservation/check',
	//预约产品寄回  初始化
	orderInfoReservationCheck:host+'/orderInfo/reservation/check',
	//预约产品寄回  提交
	orderInfoReservationSave:host+'/orderInfo/reservation/save',
	//预约产品寄回  详情
	orderInfoReservationInfo:host+'/orderInfo/reservation/info',
	//预约产品寄回  填写单号
	orderInfoReservationExpress:host+'/orderInfo/reservation/express',
	//续租 初始化
	orderInfoRenewalInit:host+'/orderInfo/renewal/init',
	//续租 签名
	shoppingRenewPaySign:host+'/shopping/renewPaySign',
	//寄回续租 筛选列表(不用了)
	orderInfoReservationList:host+'/orderInfo/reservation/list',
	//可寄回
	orderNotReturned:host+'/order/notReturned',
	//可续租
	orderRenew:host+'/order/renew',
	//总账单
	longRectQueryInstalmentBillsRest:host+'/longRect/queryInstalmentBillsRest',
	//总账单 详情
	longRectQueryBillDetailRest:host+'/longRect/queryBillDetailRest',
	//分期账单
	longRectOrderDetailToBill:host+'/longRect/orderDetailToBill',
	//剩余待还
	longRemainWaitPayBill:host+'/longRect/remainWaitPayBill',
	//订单删除
	orderInfoDelete:host+'/orderInfo/delete',
	//客户端日志记录
	systemClientLog:host+'/system/clientLog',
	//客户端日志记录 查询
	systemClientLogView:host+'/system/clientLogView/h5/info',

	//活动 领取优惠券
	activityExtendGrantCoupon:hostActivity+'/activity/extendGrantCoupon',
	//活动 初始化
	activityExtendInit :hostActivity+'/activity/extendInit',
	//页面 分享
	wechatSignature :host+'/wechat/signature',
	//登陆 + 注册
	activityLaterAction :host+'/activity/laterAction'
};
