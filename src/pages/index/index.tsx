import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Button } from "@tarojs/components";
import { AtTabBar } from "taro-ui";
import { connect } from "../../utils/connect";
import CLoading from "../../components/CLoading";
import api from "../../services/api";
import {
  getRecommendPlayList,
  getRecommendDj,
  getRecommendNewSong,
  getRecommend,
  getSongInfo,
  updatePlayStatus
} from "../../actions/song";

import "./index.scss";

type PageStateProps = {
  song: songType;
  counter: {
    num: number;
  };
  recommendPlayList: Array<{
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
  }>;
  recommendDj: Array<{
    name: string;
    picUrl: string;
  }>;
  recommendNewSong: any;
  recommend: any;
};

type PageDispatchProps = {
  getRecommendPlayList: () => any;
  getRecommendDj: () => any;
  getRecommendNewSong: () => any;
  getRecommend: () => any;
  getSongInfo: (object) => any;
  updatePlayStatus: (object) => any;
};

type PageOwnProps = {};

type PageState = {
  current: number;
  showLoading: boolean;
  bannerList: Array<{
    typeTitle: string;
    pic: string;
    targetId: number;
  }>;
  searchValue: string;
  phoneNumber: string | null;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

@connect(({ song }) => ({
  song: song,
  recommendPlayList: song.recommendPlayList,
  recommendDj: song.recommendDj,
  recommendNewSong: song.recommendNewSong,
  recommend: song.recommend
}),
(dispatch) => ({
  getRecommendPlayList() {
    dispatch(getRecommendPlayList());
  },
  getRecommendDj() {
    dispatch(getRecommendDj());
  },
  getRecommendNewSong() {
    dispatch(getRecommendNewSong());
  },
  getRecommend() {
    dispatch(getRecommend());
  },
  getSongInfo(object) {
    dispatch(getSongInfo(object));
  },
  updatePlayStatus(object) {
    dispatch(updatePlayStatus(object));
  }
}))
class Index extends Component<IProps, PageState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showLoading: true,
      bannerList: [],
      searchValue: "",
      phoneNumber: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showLoading: false
    });
  }

  componentWillMount() {
    this.getPersonalized();
    this.getNewsong();
    this.getDjprogram();
    this.getRecommend();
    this.getBanner();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidMount() {
    this.removeLoading();
  }

  switchTab(value) {
    switch (value) {
      case 0:
        Taro.reLaunch({
          url: "/pages/index/index"
        });
        break;
      case 1:
        Taro.reLaunch({
          url: "/pages/tablelist/index"
        });
        break;
      case 2:
        Taro.reLaunch({
          url: "/pages/my/index"
        });
        break;
      default:
        break;
    }
  }

  getPersonalized() {
    this.props.getRecommendPlayList();
  }

  getNewsong() {
    this.props.getRecommendNewSong();
  }

  getDjprogram() {
    this.props.getRecommendDj();
  }

  getRecommend() {
    this.props.getRecommend();
  }

  getBanner() {
    api
      .get("/banner", {
        type: 1
      })
      .then(({ data }) => {
        if (data.banners) {
          this.setState({
            bannerList: data.banners
          });
        }
      });
  }

  removeLoading() {
    this.setState({
      showLoading: false
    });
  }

  navigateToPage = (url) => {
    Taro.navigateTo({
      url: url
    });
  };

  onGetPhoneNumber = (e) => {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const { encryptedData, iv } = e.detail;
      Taro.showModal({
        title: '手机号',
        content: `获取到的手机号加密数据：${encryptedData}\n解密向服务端获取`,
        showCancel: false,
      });
      this.setState({ phoneNumber: '12345678901' }); // 示例解密结果
    } else {
      Taro.showToast({ title: '获取手机号失败', icon: 'none' });
    }
  };

  render() {
    const { showLoading, phoneNumber } = this.state;

    return (
      <View>
        <CLoading fullPage={true} hide={!showLoading} />
        这是首页23

        {phoneNumber ? (
          <Text>手机号: {phoneNumber}</Text>
        ) : (
          <Button openType="getPhoneNumber" onGetPhoneNumber={this.onGetPhoneNumber}>
            微信账号一键登录
          </Button>
        )}

        {[
          { url: '/pages/packageA/pages/videoDetail/index', label: 'VideoDetail' },
          { url: '/pages/packageA/pages/djprogramListDetail/index', label: 'DjprogramListDetail' },
          { url: '/pages/packageA/pages/search/index', label: 'Search' },
          { url: '/pages/packageA/pages/searchResult/index', label: 'SearchResult' },
          { url: '/pages/packageA/pages/songDetail/index', label: 'SongDetail' },
          { url: '/pages/packageA/pages/playListDetail/index', label: 'PlayListDetail' },
          { url: '/pages/packageA/pages/login/index', label: 'Login' },
          { url: '/pages/packageA/pages/myFans/index', label: 'MyFans' },
          { url: '/pages/packageA/pages/myFocus/index', label: 'MyFocus' },
          { url: '/pages/packageA/pages/myEvents/index', label: 'MyEvents' },
          { url: '/pages/packageA/pages/recentPlay/index', label: 'RecentPlay' }
        ].map((page, index) => (
          <Button key={index} onClick={() => this.navigateToPage(page.url)}>{page.label}</Button>
        ))}
        
        <AtTabBar
          fixed
          selectedColor="#d43c33"
          tabList={[
            { title: "首页2", iconPrefixClass: "fa", iconType: "feed" },
            { title: "列表页", iconPrefixClass: "fa", iconType: "feed" },
            { title: "我的", iconPrefixClass: "fa", iconType: "music" }
          ]}
          onClick={this.switchTab.bind(this)}
          current={this.state.current}
        />
      </View>
    );
  }
}

export default Index;
