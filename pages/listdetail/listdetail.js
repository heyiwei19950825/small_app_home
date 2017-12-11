var app = getApp()
Page({
  data: {
    current: 0,
    shopList: [],
    ptype:'',
    title:'水果店',
    page:2,
    catId:0,
    brand_id: 0,
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000
  },
showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
 },
hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export(),
    showModalStatus: false
   })
  }.bind(this), 200)
},
skip:function(e){
  if (this.data.brand_id != undefined){
    var url_data = '../listdetail/listdetail?brand_id=';
  }else{
    var url_data = '../listdetail/listdetail?cat_id=';
  }
  wx.redirectTo({
    url: url_data + e.currentTarget.dataset.id +'&title='+e.currentTarget.dataset.title,
  })
},

//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page + 1;
  wx.request({
      url: app.d.ceshiUrl + '/Api/Product/get_more',
      method:'post',
      data: {
        page:page,
        ptype:that.data.ptype,
        cat_id:that.data.catId,
        brand_id: that.data.brand_id
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data.pro;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          shopList:that.data.shopList.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},

onLoad: function (options) {
  var objectId = options.title;
  //更改头部标题
  wx.setNavigationBarTitle({
      title: objectId,
      success: function() {
      },
    });

    //页面初始化 options为页面跳转所带来的参数
    var that = this;
    var cat_id = options.cat_id;
    var ptype = options.ptype;
    var brand_id = options.brand_id;
    
    that.setData({
      ptype: ptype,
      catId: cat_id,
      brand_id: brand_id
    })

    //ajax请求数据
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/lists',
      method:'post',
      data: {
        cat_id:cat_id,
        ptype:ptype,
        brand_id: brand_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        var shoplist = res.data.pro;
        var navList = res.data.cateList;
        var cat = res.data.cat;
        that.setData({
          shopList: shoplist,
          navList: navList,
          cat_id: cat_id,
          cat: res.data.cat
        })
        if ( cat_id == undefined ){
          var h_id = brand_id;
        }else{
          var h_id = cat_id;
        }
        //nav位置
        let currentIndex = 0;
        let navListCount = that.data.navList.length;
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (that.data.navList[i].id == h_id) {
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          that.setData({
            scrollLeft: currentIndex * 60
          });
        }
      },
      error: function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })

  },
  //详情页跳转
  lookdetail: function (e) {
    // console.log(e)
    var lookid = e.currentTarget.dataset;
    // console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  // switchCate: function (event) {
  //   if (this.data.id == event.currentTarget.dataset.id) {
  //     return false;
  //   }
  //   var that = this;
  //   var clientX = event.detail.x;
  //   var currentTarget = event.currentTarget;
  //   if (clientX < 60) {
  //     that.setData({
  //       scrollLeft: currentTarget.offsetLeft - 60
  //     });
  //   } else if (clientX > 330) {
  //     that.setData({
  //       scrollLeft: currentTarget.offsetLeft
  //     });
  //   }
  //   this.setData({
  //     id: event.currentTarget.dataset.id
  //   });

  //   // this.getCategoryInfo();
  // }

})
