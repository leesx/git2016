//index.js
//获取应用实例
var app = getApp();


Page({
    data:{
        id:0,
        details:[{
        "name":"宋江",
        "title":"总兵都头领",
        "des":"及时雨、呼保义",
        "photo":"http://images.missyuan.com/attachments/day_090414/20090414_8612c24803208db15527Gb0OBG0lW7iv.jpg"
        },{
            "name":"卢俊义",
            "title":"总兵都头领",
            "des":"玉麒麟",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_f98849f1416957148772M39vp0Vmz3sm.jpg"
        },{
            "name":"吴用",
            "title":"掌管机密军师",
            "des":"智多星",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_4a21edfd9a9e4d5b943424FcQU6354Q6.jpg"
        },{
            "name":"公孙胜",
            "title":"掌管机密军师",
            "des":"入云龙",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_3ffb5c48182ce8f7117egkz57jj7355G.jpg"
        },{
            "name":"关胜",
            "title":"马军五虎将、左军大将",
            "des":"大刀",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_71eb7b4e9c85904fe8c07oR7d8RXM2OR.jpg"
        },{
            "name":"林冲",
            "title":"马军五虎将、右军大将",
            "des":"豹子头",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_0de8f1da5efc111b7856I157FKFiplFP.jpg"
        },{
            "name":"秦明",
            "title":"马军五虎将、先锋大将",
            "des":"霹雳火",
            "photo":"http://images.missyuan.com/attachments/day_090414/20090414_313668b82216b0f8b9760b4BB6vX5wsb.jpg"
        }]
    },
    onLoad:function(options){
        console.log(this);
        var _this = this;
        
        console.log('options',options)
       wx.getStorage({
            key:'detailID',
            success:function(res){
                _this.setData({
                    id:res.data
                })
                console.log(res.data);
            } 
      });
        
        console.log('详情',this.data.details)
        
    }
})