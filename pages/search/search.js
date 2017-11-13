var app = getApp();
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:1,
    productData:[],
    historyKeyList:[],
    hotKeyList:[],
    dataEmpty:false,//是否有查询数据用于判断是否要下拉加载
    isOnReach:false,//是否是下拉加载
  },
  onLoad:function(options){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/index',
      method:'post',
      data: {uid:app.d.userId},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var remen = res.data.remen;
        var history = res.data.history;

        that.setData({
          historyKeyList:history,
          hotKeyList:remen,
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        isOnReach:true,
        page:(this.data.page+1)
      })
      if(!this.data.dataEmpty){
        this.searchProductData();
      }
  },
  doKeySearch:function(e){
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
       hotKeyShow:false,
       historyKeyShow:false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  doSearch:function(){
    var searchKey = this.data.searchValue;
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    this.data.productData.length = 0;
    this.searchProductData();

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {

          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
    this.searchProductData();
  },
  searchProductData:function(){
    var that = this;
    console.log(that.data.isOnReach);
    if (!that.data.isOnReach){//判断是否是下拉加载
      that.setData({
        page : 0,
      });
    }else{
      that.setData({
        isOnReach: false,
      });
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/searches',
      method:'post',
      data: {
        keyword:that.data.searchValue,
        uid: app.d.userId,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.pro;
        if (!that.data.searchValue){
          that.setData({
            productData: [],
            dataEmpty: true,
          });
          return false;
        }
        if (data.length != 0 ) {
          var dataEmpty = false;
          if (data.length<6){
            dataEmpty = true;
          }
          that.setData({
            productData: that.data.productData.concat(data),
            dataEmpty: dataEmpty,
          });

        }else{
          wx.showToast({
            title: '没有查找到数据~',
            duration: 2000
          });
          that.setData({
            productData: [],
            dataEmpty: true,
          });
        }
       
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

});