import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Image, Text, Swiper, SwiperItem, Button } from "@tarojs/components";
import { AtTabBar, AtSearchBar, AtIcon, AtButton } from "taro-ui";
import { connect } from "../../utils/connect";
import classnames from "classnames";
import CLoading from "../../components/CLoading";
import CMusic from "../../components/CMusic";
import api from "../../services/api";
// import { injectPlaySong } from "../../utils/decorators";
import { songType } from "../../constants/commonType";
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
      searchValue: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
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
        console.log("banner", data);
        if (data.banners) {
          this.setState({
            bannerList: data.banners
          });
        }
      });
  }

  goSearch() {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`
    });
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    });
  }

  goPage() {
    Taro.showToast({
      title: "正在开发中，敬请期待",
      icon: "none"
    });
  }

  goDjDetail(item) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/djprogramListDetail/index?id=${item.id}&name=${item.name}`
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
  }

  render() {
    const { showLoading } = this.state;

    return (
      <View>
        <CLoading fullPage={true} hide={!showLoading} />
        这是首页
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
