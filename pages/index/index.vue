<template>
  <view class="container">
    <!-- Base solid color background -->
    <view class="background-solid"></view>
    
    <!-- Top decorative background with gradient fade -->
    <view class="background-image-container">
      <image class="background-image-top" src="/static/background/hubei-landscape.png" mode="aspectFill"></image>
      <view class="gradient-overlay"></view>
    </view>
    
    <!-- Search Bar -->
    <view class="search-container">
      <view class="search-box">
        <input 
          class="search-input" 
          placeholder="搜索" 
          confirm-type="search"
          @confirm="performSearch"
          v-model="searchQuery"
        />
        <text v-if="searchQuery" class="clear-icon" @click="clearSearch">×</text>
      </view>
    </view>
    
    <!-- 四大图组区域 -->
    <view class="topic-grid">
      <view 
        class="topic-item" 
        v-for="(item, index) in topicList" 
        :key="index" 
        @click="navigateToTopic(item.id)"
      >
        <image class="topic-image" :src="item.image"></image>
        <view class="topic-title">{{item.title}}</view>
      </view>
    </view>
    
    <!-- 轮播图区域 -->
    <view class="swiper-container">
      <swiper 
        class="swiper" 
        circular 
        autoplay 
        interval="5000" 
        duration="500" 
        indicator-dots 
        indicator-active-color="#2E8B57"
      >
        <swiper-item v-for="(item, index) in carouselItems" :key="index" @click="navigateToMap(item.id)">
          <view class="swiper-item">
            <image class="swiper-image" :src="item.image" mode="aspectFill"></image>
            <view class="swiper-title">{{item.title}}</view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      topicList: [
        {
          id: "1",
          title: "极目楚天",
          image: "/static/icons/topic-landscape.png"
        },
        {
          id: "2",
          title: "富饶资源",
          image: "/static/icons/topic-resources.png"
        },
        {
          id: "3",
          title: "绿色发展",
          image: "/static/icons/topic-green.png"
        },
        {
          id: "4",
          title: "四水同治",
          image: "/static/icons/topic-water.png"
        }
      ],
      carouselItems: [
        {
          id: "map1",
          title: "江河湖库",
          image: "/static/maps/map-demo1.png"
        },
        {
          id: "map2",
          title: "水资源概况",
          image: "/static/maps/map-demo2.png"
        },
        {
          id: "map3",
          title: "地表水",
          image: "/static/maps/map-demo3.png"
        }
      ]
    }
  },
  methods: {
    navigateToTopic(topicId) {
      uni.navigateTo({
        url: '/pages/map/topic-intro?topic_id=' + topicId
      });
    },
    navigateToMap(mapId) {
      uni.navigateTo({
        url: '/pages/map/detail?id=' + mapId
      });
    },
    // Search related methods
    performSearch() {
      if (!this.searchQuery.trim()) {
        uni.showToast({
          title: '请输入搜索内容',
          icon: 'none'
        });
        return;
      }
      
      // Navigate to search results page with query
      uni.navigateTo({
        url: `/pages/map/search?query=${encodeURIComponent(this.searchQuery)}`
      });
    },
    clearSearch() {
      this.searchQuery = '';
    }
  }
}
</script>

<style>
.container {
  position: relative;
  height: 100vh;
  padding: 0;
  overflow: hidden;
}

/* Base solid background color - light cream color */
.background-solid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F9F7F2; /* Light cream background color */
  z-index: -2;
}

/* Top background image container */
.background-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45%; /* Controls how much of the screen the image covers */
  z-index: -1;
  overflow: hidden;
}

/* The actual background image */
.background-image-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Gradient overlay for smooth transition */
.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%; /* Height of the gradient fade */
  background: linear-gradient(to bottom, rgba(249, 247, 242, 0) 0%, rgba(249, 247, 242, 1) 100%);
  z-index: 1;
}

/* Search Bar Styling */
.search-container {
  position: relative;
  padding: 30rpx 20rpx;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
}

.search-box {
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.search-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
  color: #666;
}

.search-input {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  color: #333;
}

.clear-icon {
  font-size: 36rpx;
  color: #999;
  padding: 0 10rpx;
}

/* Topic grid styling */
.topic-grid {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 40rpx 20rpx;
  margin-top: 20rpx; /* Reduced from 150rpx to account for search bar */
  z-index: 1;
}

.topic-item {
  width: 42%;
  margin: 15rpx;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.topic-item:nth-child(1) {
  background-color: rgba(173, 216, 230, 0.85); /* 天青蓝 */
}

.topic-item:nth-child(2) {
  background-color: rgba(218, 165, 32, 0.85); /* 琥珀金 */
}

.topic-item:nth-child(3) {
  background-color: rgba(144, 238, 144, 0.85); /* 鲜绿色 */
}

.topic-item:nth-child(4) {
  background-color: rgba(70, 130, 180, 0.85); /* 靛蓝色 */
}

.topic-image {
  width: 100rpx;
  height: 100rpx;
  margin: 20rpx auto 10rpx;
  display: block;
}

.topic-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  padding: 15rpx 0 20rpx;
}

/* Carousel/Swiper styling */
.swiper-container {
  width: 90%;
  height: 350rpx; /* Slightly reduced from 400rpx to fit better with search bar */
  margin: 20rpx auto;
  border-radius: 15rpx;
  overflow: hidden;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.swiper-title {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20rpx;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #FFFFFF;
  font-size: 28rpx;
}
</style>