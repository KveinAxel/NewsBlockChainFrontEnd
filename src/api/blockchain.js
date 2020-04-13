import request from '@/utils/request'

// 添加区块
export function appendToBlockChain(params) {
    return request({
        url: '/local/append',
        method: 'get',
        params: params
    })
}

// 检查篡改
export function confirmArticle(params) {
    return request({
        url: '/local/confirm',
        method: 'get',
        params: params
    })
}


// 获取区块信息
export function listBlockChain(params) {
    return request({
        url: '/local/list',
        method: 'get',
        params: params
    })
}


// 查询文章
export function searchBlockChain(params) {
    return request({
        url: '/local/search',
        method: 'get',
        params: params
    })
}

// 初始化区块链
export function initBlockChain(params) {
    return request({
        url: '/local/init',
        method: 'get',
        params: params
    })
}

// 获取区块内容
export function getContent(params) {
    return request({
        url: '/local/content',
        method: 'get',
        params: params
    })
}

// 获取注册成为普通节点
export function node(params) {
    return request({
        url: '/local/node',
        method: 'get',
        params: params
    })
}

// 获取注册成为普通节点
export function superNode(params) {
    return request({
        url: '/local/superNode',
        method: 'get',
        params: params
    })
}
