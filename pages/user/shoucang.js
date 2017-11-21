var app = getApp();
// pages/user/shoucang.js
Page({
  data:{
    page:1,
    productData:[],
  },
  onLoad:function(options){
    this.loadProductData();
  },
  removeFavorites:function(e){
    var that = this;
    var ccId = e.currentTarget.dataset.favId;

    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {

        res.confirm && wx.request({
          url: app.d.hostUrl + '/Api/user/collection_qu',
          method:'post',
          data: {
            ccId: ccId,
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var data = res.data;
            if (data.status == 1){
              that.data.productData.length =0;
              that.loadProductData();
            }
          },
        });

      }
    });
  },
  loadProductData:function(){
    var that = this;

    wx.request({
      url: app.d.hostUrl + '/Api/User/collection',
      method:'post',
      data: {
        userId: app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);

        that.setData({
          productData: res.data.sc_list,
        });
      },
    });
  },
  // initProductData: function (data){
  //   for(var i=0; i<data.length; i++){
  //     //console.log(data[i]);
  //     var item = data[i];

  //     item.Price = item.Price/100;
  //     item.ImgUrl = app.d.hostImg + item.ImgUrl;

  //   }
  // },
});