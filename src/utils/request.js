import axios from 'axios'
import {Message} from 'element-ui'

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // api的base_url
    timeout: 5000, // 请求超时时间
});


export default service
