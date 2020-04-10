import request from '@/utils/request'

// 添加区块
export function appendToBlockChain(params) {
    return request({
        url: '/block/append',
        method: 'get',
        params: params
    })
}

// 检查篡改
export function confirmArticle(params) {
    return request({
        url: '/block/confirm',
        method: 'get',
        params: params
    })
}


// 获取区块信息
export function listBlockChain(params) {
    return request({
        url: '/block/list',
        method: 'get',
        params: params
    })
}


// 查询文章
export function searchBlockChain(params) {
    return request({
        url: '/block/search',
        method: 'get',
        params: params
    })
}
