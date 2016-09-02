/**
 * Created by leesx on 2016/6/20.
 */
import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'

import Mask from '../Mask'

const MockData = [{
    imgurl:'./src/images/01.jpg',
    title:'图片1',
},{
    imgurl:'./src/images/02.jpg',
    title:'图片2',
},{
  imgurl:'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2016-09-02/9577e9be05aea818907880ac66bdf4a0.jpg'
},{
  imgurl:'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2016-09-02/177e848bf4f0df538576f5422029c3e6.jpg'
}]

const MockData2 = [{
    imgurl:'http://www.people.com.cn/NMediaFile/2016/0902/MAIN201609021911314859050338728.jpg',
    title:'图片1',
},{
    imgurl:'http://www.people.com.cn/NMediaFile/2016/0902/MAIN201609021348521914980960649.jpg',
    title:'图片2',
},{
  imgurl:'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2016-09-02/9577e9be05aea818907880ac66bdf4a0.jpg'
},{
  imgurl:'https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/r/image/2016-09-02/177e848bf4f0df538576f5422029c3e6.jpg'
},{
  imgurl:'http://www.wallcoo.com/animal/v195_Lively_Dogs/wallpapers/1280x800/Lively_Dogs_wallpaper_MIX88041_wallcoo.com.jpg'
}]

export default  class MaskDemo extends Component{

    constructor(props, context) {
        super(props, context)
        this.state = {
            showPicModal:false,
            imgData:[],
        }
    }

    componentDidMount = ()=>{

        //findDOMNode().appendChild('<div></div>')
        //document.body.appendChild(findDOMNode(this.refs.mask))
    }

    showPicModal(obj){
        //console.log(obj)
        this.setState({
            showPicModal:true,
            start:obj.index,
            imgData:obj.data
        })


    }

    closeHandlePicModal =()=>{
        this.setState({
            showPicModal:false,
            start:0,
        })
    }



    renderImgList = (data)=>{
        return (
            data.map((item,index)=>{
                return (<li key={`img_${index}`} onClick={this.showPicModal.bind(this,{data,index})}><img src={item.imgurl} /></li>)
            })
        )
    }



    render() {


        return (
            <div className="self-calendar">
                <ul className="img-list clearfix">
                    { this.renderImgList(MockData) }
                </ul>
                <h2>第二组图片</h2>
                <ul className="img-list clearfix">
                    { this.renderImgList(MockData) }
                </ul>
                <h2>第三组图片</h2>
                <ul className="img-list clearfix">
                    { this.renderImgList(MockData2) }
                </ul>
                {
                  this.state.imgData.length?
                  <Mask
                      showModal = { this.state.showPicModal }
                      closePicModal = {this.closeHandlePicModal}
                      start = {this.state.start}
                      imgSource = { this.state.imgData }
                   /> : null
                }


            </div>
        );
    }
}
