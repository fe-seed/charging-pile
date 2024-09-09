import Taro from "@tarojs/taro";
import { Component } from "react";
import { View } from "@tarojs/components";
import classnames from "classnames"; 

import "./index.scss";


class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View className='page-tablelist'> 
        这是列表页
      </View>
    );
  }
}

export default TableList;
