// pages/join/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focusArray : [true,false,false,false],
    textArray:["","","",""],
    valueIndex :0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  inputFn(e){
    let index = this.data.valueIndex
    let currentIndex = index
    let textArray = this.data.textArray
    let focusArray = [false,false,false,false]
    console.log(currentIndex)
    console.log(index)
    if(e.detail.value){
        textArray[index] = e.detail.value
        if(index < focusArray.length-1){
          focusArray[++index] = true
        }
        
    }
    console.log(currentIndex)
    console.log(index)
    //如果按下了删除键
    if(e.detail.keyCode == 8){

        if(!textArray[currentIndex]){
          textArray[currentIndex-1] = "";
          index--;
        }else{
          textArray[currentIndex] = "";
        }
        focusArray[--index] = true
    }
    console.log(textArray)
    this.setData({
      focusArray:focusArray,
      valueIndex:index,
      textArray:textArray
  })
  }
})