// env.config.js - 环境配置管理
const ENV_TYPE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// 当前环境配置 - 部署时修改这里
const CURRENT_ENV = ENV_TYPE.DEVELOPMENT;

// 环境配置定义
// 现用开发环境
const ENV_CONFIG = {
  [ENV_TYPE.DEVELOPMENT]: {
    // 开发环境配置————阿里云服务器：8.138.38.144
    API_BASE_URL: 'http://localhost:8088', 
    GEOSERVER_BASE_URL: 'http://192.168.50.133:8080/geoserver',
    WEBVIEW_BASE_URL: 'http://localhost:2180', //nginx代理地址
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  
  [ENV_TYPE.TEST]: {
    // 测试环境配置
    API_BASE_URL: 'http://test-api.example.com:8088',
    GEOSERVER_BASE_URL: 'http://test-geoserver.example.com:8080/geoserver',
    WEBVIEW_BASE_URL: 'http://test-webview.example.com:2180',
    DEBUG: true,
    LOG_LEVEL: 'info'
  },
  
  //暂时未用到
  [ENV_TYPE.PRODUCTION]: {
    // 生产环境配置
    API_BASE_URL: 'https://api.hubei-atlas.com',
    GEOSERVER_BASE_URL: 'https://geoserver.hubei-atlas.com/geoserver',
    WEBVIEW_BASE_URL: 'https://webview.hubei-atlas.com',
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
};

// 获取当前环境配置
function getCurrentEnvConfig() {
  const config = ENV_CONFIG[CURRENT_ENV];
  if (!config) {
    console.error(`Environment configuration not found for: ${CURRENT_ENV}`);
    return ENV_CONFIG[ENV_TYPE.DEVELOPMENT];
  }
  return config;
}

// 导出配置
const envConfig = getCurrentEnvConfig();

export {
  ENV_TYPE,
  CURRENT_ENV,
  envConfig,
  getCurrentEnvConfig
};

console.log(`[ENV] Current environment: ${CURRENT_ENV}`);