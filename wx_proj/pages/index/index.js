//index.js
//获取应用实例
var app = getApp()

Page({
  data:{
    ninebox:['宋江','卢俊义','吴用','公孙胜','关胜','林冲','秦明'],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    modalHidden: true,
    modalHidden2: true,
    toast1Hidden: true,

    poster: 'http://pic.pimg.tw/pam86591/1408719752-3322564110_n.jpg',
    name: 'Sugar',
    author: 'Maroon 5'
  },
  //第一步
  onLoad:function(e){
    console.log('加载成功',e)
  },
  //第二步
  onShow:function(){
    console.log('监听页面显示')
  },
  //第三步
  onReady:function(){
    console.log('渲染完成')
  },
  tapMe:function(e){
    console.log(this)
    console.log(e.currentTarget.dataset)
    console.log(e)

    var id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../detail/detail?='+id,
      success:function(){
        console.log('跳转成功')
        
        wx.setStorage({
          key:"detailID",
          data:id
        });
      }
    })
  },
  setDisabled: function(e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },
  setPlain: function(e) {
    this.setData({
      plain: !this.data.plain
    })
  },
  setLoading: function(e) {
    this.setData({
      loading: !this.data.loading
    })
  },
  modalTap: function(e) {
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function(e) {
    this.setData({
      modalHidden: true
    })
  },
  modalTap2: function(e) {
    this.setData({
      modalHidden2: false
    })
  },
  modalChange2: function(e) {
    this.setData({
      modalHidden2: true
    })
  },
  toast1Tap:function(){
    this.setData({
      toast1Hidden:false,
    })
  },
  toast1Change:function(){
    this.setData({
      toast1Hidden:true,
    })
    console.log('toasttoast 回调')
  },
  audioPlay: function () {
    this.setData({
      action: {
        method: 'play'
      }
    });
  },
  videoErrorCallback: function (e) {
      console.log('视频错误信息:');
      console.log(e.detail.errMsg);
  },
  
})
