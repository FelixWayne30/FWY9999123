<template>
  <view class="container">
    <!-- 保持原有背景设计不变 -->
    <view class="background-solid"></view>
    
    <view class="background-image-container">
      <image class="background-image-top" src="/static/background/center-bg.png" mode="aspectFill"></image>
      <view class="gradient-overlay"></view>
    </view>
    
    <!-- 优化后的地图列表区域 -->
    <scroll-view class="maps-scroll" scroll-y enhanced :show-scrollbar="false">
      <view class="maps-container">
        <view 
          class="map-item" 
          v-for="(item, index) in maps" 
          :key="index"
          :data-map-id="item.id"
          :data-index="index"
        >
          <view class="map-header">
            <view class="map-name">{{item.title}}</view>
          </view>
          
          <view class="map-content">
            <view class="map-thumbnail-wrapper">
              <image 
                class="map-thumbnail" 
                :src="item.thumbnail" 
                mode="aspectFill"
                @click="navigateToMap(item.id, index)"
                @error="handleImageError"
              ></image>
            </view>
            
            <view class="map-info">
              <view class="map-description">
                <text>{{item.description}}</text>
              </view>
              <view class="action-buttons">
                <button class="detail-btn primary-bg" @click="navigateToDetail(item.id)">查看详情</button>
                <button class="browse-btn" @click="navigateToMap(item.id, index)">浏览地图</button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { API } from '@/common/config.js';
import { generateThumbnailUrl } from '@/common/utils.js';
import { thumbnailCache } from '@/common/preload.js';

export default {
  data() {
    return {
      topicId: '',
      topicInfo: {
        id: '',
        title: '加载中...'
      },
      maps: []
    };
  },
  onLoad(options) {
    console.log('专题介绍页面加载，接收参数:', options);
    this.topicId = options.topic_id || '';
    console.log('设置的topicId:', this.topicId);
    
    // 设置当前专题ID，用于缩略图缓存
    thumbnailCache.setCurrentTopic(this.topicId);
    
    // 获取专题信息和地图列表
    this.getTopicInfo();
    this.getTopicMaps();
  },
  
  methods: {
    // 图片加载错误处理
    handleImageError(e) {
      console.log('缩略图加载失败，使用默认图片');
      e.target.src = '/static/placeholder.png';
    },
    
    // 获取专题基本信息
    getTopicInfo() {
      uni.request({
        url: API.TOPICS,
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            const topic = res.data.data.find(item => item.topic_id === this.topicId);
            if (topic) {
              this.topicInfo = {
                id: topic.topic_id,
                title: topic.title,
                description: topic.description
              };
              uni.setNavigationBarTitle({
                title: topic.title
              });
            }
          }
        },
        fail: (err) => {
          console.error('获取专题信息失败:', err);
        }
      });
    },
    
    // 获取该专题下的所有地图
    getTopicMaps() {
      console.log('=== 开始获取专题地图数据 ===');
      
      uni.showLoading({
        title: '加载地图数据...'
      });
      
      uni.request({
        url: API.MAPS_BY_GROUP + this.topicId,
        method: 'GET',
        success: (res) => {
          console.log('获取地图数据成功');
          if (res.statusCode === 200 && res.data.code === 200) {
            // 处理地图数据
            this.maps = res.data.data.map((item, index) => {
              console.log(`处理地图项 ${index}: ${item.title}`);
              
              // 生成缩略图URL
              const thumbnailUrl = generateThumbnailUrl(item.map_id, item.width, item.height);
              
              // 缓存缩略图URL，供其他页面使用
              thumbnailCache.setThumbnail(item.map_id, thumbnailUrl, item);
              
              return {
                id: item.map_id,
                title: item.title,
                description: item.description || '暂无描述',
                thumbnail: thumbnailUrl,
                width: item.width,
                height: item.height
              };
            });
            
            console.log(`地图数据处理完成，共${this.maps.length}个地图`);
          } else {
            console.error('获取地图数据失败:', res.data);
            uni.showToast({
              title: '获取地图数据失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('获取地图数据失败:', err);
          uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
          });
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    
    // 导航到地图浏览页
    navigateToMap(mapId, index = 0) {
      console.log(`跳转到地图浏览页: ${mapId}, 索引: ${index}`);
      
      uni.navigateTo({
        url: `/pages/map/browse?id=${mapId}&topic_id=${this.topicId}&index=${index}`
      });
    },
    
    // 导航到地图详情页
    navigateToDetail(mapId) {
      console.log(`跳转到地图详情页: ${mapId}`);
      
      if (!mapId) {
        console.error('mapId为空，无法跳转');
        uni.showToast({
          title: 'mapId参数错误',
          icon: 'none'
        });
        return;
      }
      
      uni.navigateTo({
        url: `/pages/map/detail?id=${mapId}&topic_id=${this.topicId}`
      });
    }
  }
};
</script>

<style>
.container {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* ========== 保持原有背景设计不变 ========== */
.background-solid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #E8F4F0;
  z-index: -2;
}

.background-image-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45%;
  z-index: -1;
  overflow: hidden;
}

.background-image-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to top, transparent 0%, #E8F4F0 100%);
  z-index: 1;
}

/* ========== 优化后的滚动区域 ========== */
.maps-scroll {
  position: relative;
  z-index: 2;
  height: 100vh;
  width: 100%;
}

.maps-container {
  padding: 40rpx 30rpx 60rpx;
  min-height: calc(100vh + 100rpx);
}

/* ========== 优化后的地图卡片 ========== */
.map-item {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  margin-bottom: 32rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(46, 139, 87, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.map-item:active {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 16rpx rgba(46, 139, 87, 0.12);
}

.map-header {
  padding: 32rpx 32rpx 24rpx;
  border-bottom: 2rpx solid #F5F7FA;
}

.map-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #2E8B57;
  line-height: 1.3;
}

.map-content {
  padding: 24rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.map-thumbnail-wrapper {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.map-thumbnail {
  width: 100%;
  height: 360rpx;
  object-fit: cover;
  display: block;
}

.map-info {
  flex: 1;
}

.map-description {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
  margin-bottom: 24rpx;
  text-align: justify;
}

/* ========== 按钮样式优化 ========== */
.action-buttons {
  display: flex;
  gap: 20rpx;
}

.detail-btn, .browse-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 500;
  transition: all 0.2s;
}

.detail-btn {
  color: #FFFFFF;
  border: none;
}

.detail-btn:active {
  background-color: #267A4A !important;
}

.browse-btn {
  background-color: #FFFFFF;
  color: #2E8B57;
  border: 2rpx solid #2E8B57;
}

.browse-btn:active {
  background-color: #F0F8F4;
  transform: scale(0.98);
}

/* ========== 适配不同屏幕 ========== */
@media screen and (min-width: 768px) {
  .map-content {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .map-thumbnail-wrapper {
    width: 300rpx;
    flex-shrink: 0;
  }
  
  .map-thumbnail {
    height: 240rpx;
  }
  
  .map-info {
    margin-left: 24rpx;
  }
  
  .action-buttons {
    justify-content: flex-start;
  }
  
  .detail-btn, .browse-btn {
    flex: none;
    width: 180rpx;
  }
}
</style>