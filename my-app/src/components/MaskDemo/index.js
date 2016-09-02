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
}]

export default  class MaskDemo extends Component{

    constructor(props, context) {
        super(props, context)
        this.state = {
            showPicModal:false,
        }
    }

    componentDidMount = ()=>{

        //findDOMNode().appendChild('<div></div>')
        //document.body.appendChild(findDOMNode(this.refs.mask))
    }

    showPicModal(index){
        console.log(index)
        this.setState({
            showPicModal:true,
            start:index,
        })


    }

    closeHandlePicModal =()=>{
        this.setState({
            showPicModal:false,
            start:0,
        })
    }



    renderImgList = ()=>{
        return (
            MockData.map((item,index)=>{
                return (<li key={`img_${index}`} onClick={this.showPicModal.bind(this,index)}><img src={item.imgurl} /></li>)
            })
        )
    }



    render() {


        return (
            <div className="self-calendar">
                <ul className="img-list">
                    { this.renderImgList() }
                </ul>
                <Mask
                    showModal = { this.state.showPicModal }
                    closePicModal = {this.closeHandlePicModal}
                    start = {this.state.start}
                    imgSource = { MockData }
                 />

            </div>
        );
    }
}
