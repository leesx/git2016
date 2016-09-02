/**
 * Created by leesx on 2016/6/20.
 */
import React, { Component, PropTypes } from 'react'

export default  class NoMatch extends Component{

    constructor(props, context) {
        super(props, context)

    }


    render() {


        return (
            <div className="no-match">
                <h1>404找不到</h1>
                <img src="http://img.taopic.com/uploads/allimg/140401/234775-14040121030734.jpg"/>
            </div>
        );
    }
}
