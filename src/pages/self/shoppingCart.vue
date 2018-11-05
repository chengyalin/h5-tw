<template>
	<div class="shoppingCart has-footer has-footer-iphoneX">
		<div class="self-info-title">
			<div class="self-info">
				<!--<router-link to="/self" class="goback bg-contain"></router-link>-->
				<p class="shop-cart-title">
					<span class="font-26 font-darkGray">购物清单</span>
					<span class="14 font-grey float-right" v-if=" !noDataFlag && listData.length" @click="editAll">{{editFlag?'完成':'编辑'}}</span>
				</p>
			</div>
		</div>
		<div class="shop-list ">
			<ul class="list">
				<li class="item" v-for="(item, index) in listData">
					<mt-cell-swipe :right="[
			              {
			                  content: '<p>删</p><p>除</p>',
			                  style: { background: '#E6361F', color: '#fff', width: '2.1rem'},
			                  handler: () => deleteSection(index)
			              }
			          ]">
			          	
						<div class="produce-content">
							<div class="produce-checked">
								<p v-if="(item.isOnSale == false || timestampNow > item.beginDate || item.maxNum < item.rentTotal) && !editFlag" class="checked-input-none bg-contain"></p>
								<p v-else class="checked-input bg-contain" :class="{checked:selectData[index]}" @click="changeSelect(index)"></p>
								<!--<p v-else class="checked-input bg-contain" :class="{checked:selectData[index],disabled:timestampNow >= item.beginDate}" @click="changeSelect(index,timestampNow >= item.beginDate)"></p>-->
							</div>
							<div @click="goProductDetails(item.productId)">
								<div class="produce-info">
									<p class="produce-img bg-cover" :style="{'background-image': 'url(' + item.imageSrc + ')'}">
										<span class="product-lose-efficacy font-white font-12" v-if="timestampNow > item.beginDate || item.maxNum < item.rentTotal">已失效</span>
										<span class="product-lose-efficacy font-white font-12" v-if="item.isOnSale == false">已下架</span>
									</p>
									<div>
										<p class="product-name font-bold font-14 font-darkGray line-ellipsis">{{ item.productName }}</p>
										<p class="product-time font-grey font-12">{{item.beginDate | formatTime2}} - {{item.endDate | formatTime2}} ({{item.rentTime}}天) <span @click.stop="calendarShow(item.productId,index,item.listId)" class="timeEdit bg-contain"></span></p>
										<p class="product-price font-grey font-12">租金：￥{{ item.rentAmount }}</p>
									</div>
									<span class="line-normal"></span>
								</div>
							</div>
							<div class="wrap-amount">
								<p class="font-12 wrap-list" @click="listFlagShow(index)">查看包装清单</p>
								<p class="product-amount font-14 font-darkGray">
									<span class="amount-reduce"  :class="{'activeReduce': listData[index].rentTotal == 1}" @click="changeCount('minus', listData[index].rentTotal > 1, index)">-</span>
									<span class="amount">{{ item.rentTotal }}</span>
									<span class="amount-add" :class="{'activeAdd': listData[index].rentTotal >= item.maxNum}" @click="changeCount('plus', listData[index].rentTotal < item.maxNum, index)">+</span>
								</p>
							</div>

						</div>
						
					</mt-cell-swipe>
				</li>
			</ul>
		</div>

		<div class="message-null" v-if=" noDataFlag && !listData.length">
			<img src="~@assets/img/shopping-car.png" />
			<p class="font-14 font-lightGray">暂无任何产品</p>
		</div>
		<div class="footer iphoneX-footer fixd-center" v-if="listData.length">
			<div class="footer-all">
				<div class="produce-amount-all" @click="changeSelect('all')">
					<p class="amount-all" :class="{'checked':selectAllFlag}"></p>
					<p class="font-12">全选</p>
				</div>
				<p class="font-16 font-darkGray" v-if="!editFlag">
					总计：{{rentAll | formatMoney}}
				</p>
			</div>
			<div class="accounts font-14">
				<p v-if="!editFlag" @click="submitForm" :class="{checked: accountFlag}">
					去结算({{rentTotal}})
				</p>
				<p v-else @click="deleteEdit()" :class="{checked: accountFlag}">
					删除 ({{rentTotal}})
				</p>
			</div>
		</div>
		<div class="public-popup-shadow" v-if="everyFaceFlag">
			<div class="popup-layer font-16 font-darkGray">
				<p class="title">账号信息异常</p>
				<p class="content">完成人脸识别可减免押金</p>
				<div class="btn-wrap">
					<span class="btn" @click="goPlaceOrder">算了</span>
					<span @click="goZhimaFace" class="btn">前往认证</span>
				</div>

			</div>
		</div>
		<packList :packListData="packListData" :listFlag='listFlag' @packListHidden="packListHidden"></packList>
		<calendar :tplData="tplData" :mainData="mainData" :calendarFlag="calendarFlag" :askData="askData" :price="price" @calendarHidden="calendarHidden" @submit="submit" ref="calendar"></calendar>
	</div>
</template>

<script>
	import Vue from 'vue'
	import { CellSwipe, MessageBox } from 'mint-ui'
	import { CONFIG } from '@assets/js/config';
	import { network } from '@assets/js/network';
	import packList from '@components/packList';
	import calendar from '@components/calendar';
	import { setBodyColor } from '@assets/js/mUtils';
	Vue.component(CellSwipe.name, CellSwipe, MessageBox);

	export default {
		data() {
			return {
				listData: [],
				//				checkedFlag: false, // 单选按钮
				selectData: [],
				selectAllFlag: false, // 全选开关
				timestampNow: 0, //当前时间
				count: 0, // 已选项数
				rentTotal: 0,
				noDataFlag: false, // 购物车空空的时候
				rentAll: 0,
				useCount: 0,
				editFlag: false,
				delectIndex: '',
				delectListId: [],
				everyFaceFlag: false,
				packListData: {}, // 包装清单
				listFlag: false,
				tplData: { //时间选择器数据
					productId: 0,
					setStatus: 0,
					startStamp: null,
					endStamp: null,
					optionalDate: [],
					hasEmptyGrid: [],
					empytGrids: [],
					public_year: [],
					public_month: [],
					public_days: [],
					noCalendarClearFlag: true //点击关闭按钮 保存数据
				},

				mainData: {
					products: {},
					coupons: [],
					similar_products: [],
					videos: [],
					product_appraise: {
						list: []
					},
				},

				calendarFlag: false, //日期选择器弹出框
				askData: {
					total: 1
				},
				price: [], //长租价格曲线
				selectSku: {},
				accountFlag: false, // 去结算
			}
		},
		mounted() {
			var that = this;
			if(localStorage.getItem("twUser")) {
				that.myInitData()
			} else {
				that.goBack();
			}

		},
		activated() {
			var that = this;
			window.addEventListener('scroll', that.scrollBottom)
		},
		deactivated() {
			var that = this;
			window.scrollTo(0, 0);
			window.removeEventListener('scroll', that.scrollBottom)
		},
		destroyed() {
			var that = this;
			window.scrollTo(0, 0);
			window.removeEventListener('scroll', that.scrollBottom);
			setBodyColor();
		},
		methods: {
			myInitData() {
				var that = this;
				that.timestampNow = new Date().getTime();
				network(CONFIG.shoppingList, {}).then((res) => {
					if(res.head.code == 0) {
						that.faceFlag = res.details.faceFlag; // true 需要人脸识别
						that.listData = res.details.list;
						that.editData = res.details.list;
						var count = 0;
						for(var i = 0; i < that.listData.length; i++) {
							if(that.timestampNow > that.listData[i].beginDate) {
								that.listData[i].overtimeFlag = true;
							} else {
								count++;
							}
						}
						that.useCount = count;
						that.noDataFlag = that.listData.length == 0;
						if (that.listData.length == 0) {
							setBodyColor(true)
						} else {
							setBodyColor()
						}
					}
				})

			},
			// 查看包装清单
			listFlagShow(index) {
				var that = this;
				var packListData = that.listData[index]
				if(!packListData.packList) {
					var list = packListData.productList.split(",");
					for(let i = 0; i < list.length; i++) {
						let arr = list[i].split("*");
						list[i] = {
							name: arr[0],
							count: arr[1]
						}
					}
					packListData.packList = list;
				}
				that.packListData = packListData;
				that.listFlag = true
			},
			packListHidden() {
				var that = this;
				that.listFlag = false;
			},
			scrollBottom() {
				var that = this;
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
				if((scrollTop + clientHeight) == scrollHeight) {
					that.myInitData();
				}
			},
			//隐藏时间选择器
			calendarHidden() {
				var that = this;
				that.calendarFlag = false;
			},

			submit() {
				var that = this;
				var askList = [],
					products = that.listData[that.placeTimeindex]
				askList.push({
					listId: that.placeTimeID,
					rentTotal: products.rentTotal,
					beginDate: that.tplData.startStamp,
					endDate: that.tplData.endStamp
				});

				// 点击一次更新一次数据
				network(CONFIG.shoppingUpdate, {
					lists: askList
				}).then((res) => {
					if(res.head.code == 0) {
						that.myInitData();
					} else {
						Vue.toast(res.head.message, {
							duration: 1500
						})
					}
				})

			},
			goProductDetails(item){
				var that = this
				that.$router.push({
					path: '/productDetails',
					query: {'productId': item}
				})
			},

			//展示时间选择器
			calendarShow(Id, index, listId) {
				var that = this;
				that.placeTimeID = listId // 修改当前订单时间（calendar sumit方法）
				that.placeTimeindex = index // 修改当前订单时间(calendar sumit方法)
				that.tplData.startStamp = that.listData[index].beginDate
				that.tplData.endStamp = that.listData[index].endDate

				that.tplData.diff = that.listData[index].rentTime
				that.tplData.averagePrice = that.listData[index].rentDay / that.listData[index].rentTotal
				that.askData.total = that.listData[index].rentTotal
				that.tplData.productId = that.listData[index].productId
				//			that.tipFlag = false
				if(that.price.length) {
					that.calendarFlag = true;
				} else {
					//need loading
					Indicator.open();
					network(CONFIG.productPrice, {
						"product_id": Id
					}).then((res) => {
						that.price = res.result.price;
						network(CONFIG.optionalDate, {
							"product_id": Id
						}).then((res) => {
							var optionalDate = res.details.optionalDate;
							optionalDate.map(function(item, index) {
								item.begin = item.begin.substring(0, 10) + "000";
								item.end = item.end.substring(0, 10) + "000";
								//备用 返回时间第一天 作为第一天初始化数据
								if(!index) {
									that.firstDayStamp = item.begin;
								}
							})
							that.tplData.optionalDate = optionalDate;
							that.$refs.calendar.initCalendar();
							Indicator.close();
							that.calendarFlag = true;
						});
					});
				}
			},

			//增加减少数量
			changeCount(type, flag, index) {
				var that = this
				//			that.rentAll = 0
				if(!flag && type == "plus") {
					Vue.toast('库存不足', {duration: 1500 })
					return false
				}
				if (!flag && type == "minus") {
					return false
				}
				var products = that.listData[index]
				products.rentTotal = (type == "minus") ? (products.rentTotal - 1) : (products.rentTotal + 1)
				var askList = [];
				askList.push({
					listId: products.listId,
					rentTotal: products.rentTotal,
					beginDate: products.beginDate,
					endDate: products.endDate
				});
				// 点击一次更新一次数据
				network(CONFIG.shoppingUpdate, {
					lists: askList
				}).then((res) => {
					if(res.head.code == 0) {

						that.timestampNow = new Date().getTime();
						network(CONFIG.shoppingList, {}).then((res) => {
							if(res.head.code == 0) {
								that.faceFlag = res.details.faceFlag; // true 需要人脸识别
								that.listData = res.details.list;
								that.editData = res.details.list;
								var count = 0,rentTotal = 0,
									rentAll = 0;
								for(var i = 0; i < that.listData.length; i++) {
									if(that.timestampNow > that.listData[i].beginDate) {
										that.listData[i].overtimeFlag = true;
									} else {
										count++;
									}
								}
								for(var i = 0; i < that.selectData.length; i++) {
									if(that.selectData[i]) {
										if (that.listData[i].isOnSale == true && that.timestampNow <= that.listData[i].beginDate  && that.listData[i].maxNum >= that.listData[i].rentTotal) {
											rentAll += parseFloat(that.listData[i].rentAmount);
											rentTotal += parseInt(that.listData[i].rentTotal)
										}
									}
								}
								that.useCount = count
								that.rentAll = rentAll
								that.rentTotal = rentTotal;
								that.noData = that.listData.length == 0;
							}
						})

					}
				})

				//
			},
			// 单选 or 多选 or 全选
			changeSelect(index) {
				var that = this;
				var count = 0,rentTotal = 0,
					rentAll = 0;
//				if(flag || that.useCount == 0) {
//					return false;
//				};
				// 状态为编辑时
				if(!that.editFlag) {
					if(index == 'all') {
						that.selectAllFlag = !that.selectAllFlag;
						for(var i = 0; i < that.listData.length; i++) {
							if(!that.listData[i].overtimeFlag) {
								that.selectData[i] = that.selectAllFlag;
								if(that.selectAllFlag) {
									count++;
									if (that.listData[i].isOnSale == true && that.timestampNow <= that.listData[i].beginDate  && that.listData[i].maxNum >= that.listData[i].rentTotal) {
										rentAll += parseFloat(that.listData[i].rentAmount);
										rentTotal += parseInt(that.listData[i].rentTotal)
									}
								}
							}
						}

					} else {
						that.selectData[index] = !that.selectData[index]
						for(var i = 0; i < that.selectData.length; i++) {
							if(that.selectData[i]) {
								count++;
								rentAll += parseFloat(that.listData[i].rentAmount);
								rentTotal += parseInt(that.listData[i].rentTotal)
							}
						}
						that.selectAllFlag = count == that.useCount;
					}

				} else {
					
					that.myInitData();

					//			 状态为完成时删除
					if(index == 'all') {
						that.selectAllFlag = !that.selectAllFlag;
						for(var i = 0; i < that.listData.length; i++) {
							that.selectData[i] = that.selectAllFlag;
							if (that.selectData[i]) {
								rentTotal += parseInt(that.listData[i].rentTotal)
							}
							
						}
					} else {
						that.selectData[index] = !that.selectData[index]
						
						for(var i = 0; i < that.selectData.length; i++) {
							if(that.selectData[i]) {
								count++;
								rentAll += parseFloat(that.listData[i].rentAmount);
								rentTotal += parseInt(that.listData[i].rentTotal)
							}
						}
					}
				}
				if (rentTotal > 0) {
					that.accountFlag = true
				} else {
					that.accountFlag = false
				}
				that.count = count;
				that.rentAll = rentAll;
				that.rentTotal = rentTotal;
			},
			deleteSection(index) {
				var that = this;
				var products = that.listData[index]
				MessageBox.confirm('确认删除？').then(action => {
					network(CONFIG.shoppingDelete, {
						listId: products.listId
					}).then((res) => {
						if(res.head.code == 0) {
							// that.listData.splice(index,1);
							that.myInitData();
							that.selectData.splice(index, 1)
	
						}
					});
				});
				
			},
			editAll() {
				var that = this
				that.selectData = []
				that.selectAllFlag = false
				that.editFlag = !that.editFlag;

				that.selectAllFlag ? true : false;

				that.changeSelect()

				if(!that.editFlag) {

				}

			},
			// 删除
			deleteEdit() {
				var that = this
				var products = that.listData
				var selectData = this.selectData
				// 全部删除
				if(that.selectAllFlag) {
					MessageBox.confirm('确认删除？').then(action => {
					  for(var i = 0; i < that.listData.length; i++) {
							network(CONFIG.shoppingDelete, {
								'listId': products[i].listId
							}).then((res) => {
								if(res.head.code == 0) {
									that.listData.splice(i, 1);
									that.myInitData();
								}
							});
						}
					});

				} else {
					// 批量删除
					MessageBox.confirm('确认删除？').then(action => {
						selectData.forEach((item, index) => {
							if(item == true) {
								network(CONFIG.shoppingDelete, {
									listId: that.listData[index].listId
								}).then((res) => {
									if(res.head.code == 0) {
										that.myInitData();
										that.selectData[index] = false
									}
								});
							}
						})
					});
					

				}
			},
			submitForm() {
				var that = this;
				if(that.editFlag) {
					return false;
				}
				if(that.count == 0) {
					Vue.toast('请选择产品', {
						duration: 1500
					})
					return false;
				}
				var askList = [];

				for(var i = 0; i < that.listData.length; i++) {
					var products = that.listData[i];
					if(that.selectData[i]) {

						askList.push(products.listId);

					}
				}
				that.askList = askList.join(",");
				/*
				that.$router.push({
					path: '/placeOrder',
					query: {
						listIds: that.askList
					}
				});
				*/
				window.location.href = "#/placeOrder?listIds="+that.askList
				/*
				if(that.faceFlag) {
					that.everyFaceFlag = true;
				} else {
					that.$router.push({
						path: '/placeOrder',
						query: {
							listIds: that.askList
						}
					});
				}
				*/
			},
			goPlaceOrder() {
				var that = this
				that.$router.push({
					path: '/placeOrder',
					query: {
						listIds: that.askList
					}
				});
			},
			goZhimaFace() {
				var that = this;
				that.$router.push({
					path: '/zhimaFace',
				});
			}
		},
		components: {
			calendar,
			packList
		}
	}
</script>

<style>
	.shoppingCart .self-info-title {
		width: 100%;
		padding: 1.5rem 0 1rem;
		background: #fff;
	}
	
	.shoppingCart .self-info {
		/*height: 4.8rem;*/
		margin: 0 1rem;
	}
	
	.shoppingCart .goback {
		margin-top: 0.8rem;
		margin-bottom: 0.2rem;
		display: inline-block;
		width: 0.5rem;
		height: 0.8rem;
		background-image: url(~@assets/img/arrow-left-black.png);
	}
	
	.shoppingCart .shop-cart-title {
		height: 1.9rem;
		line-height: 1.9rem;
	}
	/* mint ui */
	
	.shoppingCart .mint-cell-wrapper .mint-cell-title {
		flex: 0;
		-webkit-box-flex: 0;
	}
	
	.shoppingCart .mint-cell-swipe .mint-cell-wrapper {
		padding: 1.1rem 0 1rem 0.7rem;
	}
	
	.shoppingCart .mint-cell {
		background-color: #fff;
		/* background-color: yellow; */
		height: 7.3rem;
	}
	
	.shoppingCart .produce-info {
		width: 16.5rem;
		height: 3.7rem;
		display: flex;
		justify-content: flex-start;
		padding-bottom: 2.6rem;
		/*border-bottom: 1px solid #eee;*/
		/* align-items: center; */
		position: relative;
	}
	.shoppingCart .line-normal {
		position: absolute;
		bottom: 0.08rem;
		left: 0;
		height: 1px;
	}
	.shoppingCart .produce-img {
		width: 3.7rem;
		height: 3.7rem;
		margin-right: 0.8rem;
		/*background: red;*/
	}
	
	.shoppingCart .product-name {
		width: 10.6rem;
	}
	
	.shoppingCart .product-time {
		position: relative;
		height: 0.6rem;
	}
	
	.shoppingCart .timeEdit {
		position: absolute;
		right: 2.3rem;
		top: 0rem;
		display: inline-block;
		width: 0.6rem;
		height: 0.6rem;
		background-image: url(~@assets/img/shoppingCart-edit.png);
	}
	
	.shoppingCart .produce-info p {
		margin-bottom: 0.35rem;
	}
	
	.shoppingCart .produce-checked {
		margin-right: 0.7rem;
	}
	
	.shoppingCart .produce-checked .checked-input {
		margin-top: 1.3rem;
		width: 0.8rem;
		height: 0.8rem;
		border: 1px solid #bbb;
		border-radius: 50%;
	}
	.shoppingCart .produce-checked .checked-input-none {
		margin-top: 1.3rem;
		width: 0.8rem;
		height: 0.8rem;
		background: #fff;
		border-radius: 50%;
	}
	.shoppingCart .produce-checked .checked,
	.shoppingCart .produce-amount-all .checked {
		background-image: url(~@assets/img/self/icon-select.png);
		background-repeat: no-repeat;
		border-color: transparent;
		width: 0.9rem;
		height: 0.9rem;
		border: none;
	}
	
	.shoppingCart .produce-content {
		display: flex;
		justify-content: flex-start;
		position: relative;
	}
	
	.shoppingCart .wrap-amount {
		width: 15.5rem;
		height: 1.2rem;
		line-height: 1.2rem;
		display: flex;
		justify-content: space-between;
		position: absolute;
		right: 0rem;
		bottom: 0.15rem;
		padding-right: 1rem;
		padding-bottom: 0.6rem;
		/*border-bottom: 1px solid #eee;*/
	}
	
	.shoppingCart .wrap-list {
		/*width: 3.6rem;*/
		color: #00CCA7;
	}
	
	.shoppingCart .product-amount span {
		display: inline-block;
		/*padding: 0 0.3rem;*/
	}
	
	.shoppingCart .amount {
		margin: 0 0.5rem;
	}
	
	.shoppingCart .product-amount {
		border-radius: 0.6rem;
		width: 3.3rem;
		text-align: center;
		height: 1.2rem;
		line-height: 1.2rem;
		border: 1px solid #eee;
	}
	
	.shoppingCart .footer {
		background: #fff;
		position: fixed;
		right: 0;
		left: 0;
		bottom: 0;
		display: flex;
	}
	
	.shoppingCart .footer-all {
		flex: 1;
	}
	
	.shoppingCart .accounts {
		width: 7rem;
		text-align: center;
		line-height: 2.5rem;
		color: #fff;
		height: 2.5rem;
		background: #999;
	}
	.shoppingCart .accounts .checked {
		background: #36646E;
	}
	.shoppingCart .footer-all {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0.8rem;
	}
	
	.shoppingCart .produce-amount-all {
		/*width: 1.2rem;*/
		text-align: center;
	}
	
	.shoppingCart .amount-all {
		width: 0.8rem;
		margin: 0 auto;
		height: 0.8rem;
		border: 1px solid #bbb;
		border-radius: 50%;
	}
	
	.shoppingCart .mint-cell-swipe-buttongroup p {
		text-align: center;
		line-height: 1.2rem;
	}
	
	.shoppingCart .mint-cell-swipe-buttongroup p:first-child {
		margin-top: 2.4rem;
	}
	
	.shoppingCart .product-lose-efficacy {
		display: inline-block;
		width: 3.7rem;
		height: 3.7rem;
		background: rgba(0, 0, 0, 0.5);
		line-height: 3.7rem;
		text-align: center;
	}
	
	.shoppingCart .popup-layer {
		width: 15rem;
		height: 8rem;
		background: #fff;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
	
	.shoppingCart .popup-layer .title {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	
	.shoppingCart .popup-layer .btn-wrap {
		margin-top: 0.5rem;
	}
	
	.shoppingCart .popup-layer .btn-wrap span {
		display: inline-block;
		width: 5rem;
		height: 1.5rem;
		line-height: 1.5rem;
		/*background: yellow;*/
	}
	
	.shoppingCart .message-null {
		width: 7.8rem;
		height: 6.3rem;
		margin: 0 auto;
		text-align: center;
		margin-top: 6.3rem;
	}
	
	.shoppingCart .message-null img {
		width: 100%;
	}
	
	.shoppingCart .message-null p {
		margin-top: 1.5rem;
	}
	.shoppingCart .activeAdd,.shoppingCart .activeReduce {
		color: #ddd;
	}
	.shoppingCart  .mint-cell:last-child {
		background-image: none;
	}
</style>