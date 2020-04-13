<template>
    <div class="app-container" style="margin-top: 0">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>区块列表</span>
            <el-button
                    class="btn-add"
                    type="primary"
                    @click="handleAppendBlockChain()"
                    size="mini">
                添加区块
            </el-button>
            <el-button
                    class="btn-add"
                    type="info"
                    style="margin-right: 15px"
                    @click="handleSearchBlockChain()"
                    size="mini">
                查询
            </el-button>
            <el-button
                    class="btn-add"
                    type="danger"
                    style="margin-right: 10px"
                    @click="handleInitBlockChain()"
                    size="mini">
                初始化
            </el-button>
            <el-button
                    class="btn-add"
                    type="primary"
                    style="margin-right: 10px"
                    @click="handleSave()"
                    size="mini">
                存储至硬盘
            </el-button>
            <el-button
                    class="btn-add"
                    type="primary"
                    style="margin-right: 10px"
                    @click="handleLoad()"
                    size="mini">
                从硬盘加载
            </el-button>
            <el-button
                    class="btn-add"
                    type="success"
                    style="margin-right: 10px"
                    @click="handleNode()"
                    size="mini">
                加入区块网络
            </el-button>
            <el-button
                    class="btn-add"
                    type="success"
                    style="margin-right: 10px"
                    @click="handleSuperNode()"
                    size="mini">
                成为超级节点
            </el-button>
            <el-button
                    class="btn-add"
                    type="success"
                    style="margin-right: 10px"
                    @click="handleUpdate()"
                    size="mini">
                更新
            </el-button>
            <el-button
                    class="btn-add"
                    type="success"
                    style="margin-right: 10px"
                    @click="handleUpdatePartly()"
                    size="mini">
                增量更新
            </el-button>
            <el-button
                    class="btn-add"
                    type="info"
                    style="margin-right: 10px"
                    @click="getList()"
                    size="mini">
                重置列表
            </el-button>
        </el-card>
        <div class="table-container">
            <el-table ref="blockChainTable"
                      stripe
                      :data="list"
                      style="width: 100%"
                      v-loading="listLoading"
                      border>
                <el-table-column label="区块哈希" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.byte}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="170px" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.time | formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                    size="small"
                                    type="primary"
                                    @click="handleConfirmBlockChain(scope.$index, scope.row)">检查篡改
                            </el-button>
                            <el-button
                                    size="small"
                                    type="info"
                                    @click="handleContent(scope.$index, scope.row)">查看内容
                            </el-button>
                        </p>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                title="添加"
                :visible.sync="appendToBlockChainInfo.dialogVisible"
                width="40%">
            <div><p style="font-size: 17px;font-weight: bold">文章：</p>
                <el-input type="textarea" :rows="15" show-word-limit=true v-model="appendToBlockChainInfo.article"
                          placeholder="请输入文章"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="appendToBlockChainInfo.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAppendBlockChainConfirm()">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
                title="查询"
                :visible.sync="searchBlockChainInfo.dialogVisible"
                width="40%">
            <el-table stripe :data="searchBlockChainInfo.keywords" border>
                <el-table-column label="关键字" align="center">
                    <template slot-scope="scope">
                        <el-input placeholder="请输入内容" v-model="scope.row.key"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleDeleteKeywordsItem(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleAddKeywordsItem()">添加行</el-button>
            <el-button type="primary" @click="searchBlockChainInfo.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleSearchBlockChainConfirm()">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
                title="检查篡改"
                :visible.sync="confirmBlockChainInfo.dialogVisible"
                width="40%">
            <span>哈希值:  <el-input style="width: 500px;margin-left: 10px" label=""
                                  v-model="confirmBlockChainInfo.hash"></el-input></span>
            <div><p style="font-size: 17px;font-weight: bold">文章：</p>
                <el-input type="textarea" :rows="15" show-word-limit=true v-model="confirmBlockChainInfo.article"
                          placeholder="请输入文章"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="confirmBlockChainInfo.dialogVisible = false">取 消</el-button>
            <el-button type="primary" size="small" @click="handleConfirmBlockChainConfirm()">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
                title="文章内容"
                :visible.sync="articleInfo.dialogVisible"
                width="40%">
            <span>哈希值: <span style="width: 500px;margin-left: 10px">{{articleInfo.hash}}</span></span>
            <div><p style="font-size: 17px;font-weight: bold">文章：</p>
                <div>{{articleInfo.article}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="handleContentConfirm()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        appendToBlockChain,
        confirmArticle,
        getContent,
        initBlockChain,
        listBlockChain,
        node,
        searchBlockChain,
        superNode,
        update,
    } from "@/api/blockchain";
    import {formatDate} from '@/utils/date';
    import {loadBlockChain, saveBlockChain, updatePartly} from "../../api/blockchain";

    export default {
        name: "blockChainView",
        data() {
            return {
                list: [{
                    byte: '',
                    time: '',
                }],
                hash: '',
                listLoading: false,
                defaultAppendToBlockChainInfo: {
                    dialogVisible: false,
                    article: '',
                },
                appendToBlockChainInfo: {
                    dialogVisible: false,
                    article: '',
                },
                defaultSearchBlockChainInfo: {
                    dialogVisible: false,
                    keywords: [],
                },
                searchBlockChainInfo: {
                    dialogVisible: false,
                    keywords: [],
                },
                defaultConfirmBlockChainInfo: {
                    dialogVisible: false,
                    article: '',
                    hash: '',
                },
                confirmBlockChainInfo: {
                    dialogVisible: false,
                    article: '',
                    hash: '',
                },
                defaultArticleInfo: {
                    dialogVisible: false,
                    hash: '',
                    article: ''
                },
                articleInfo: {
                    dialogVisible: false,
                    article: '',
                    hash: '',
                },

            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                listBlockChain().then(response => {

                    this.list = response.data.data;
                    if (Array.isArray(this.list)) {
                        let len = this.list.length;
                        for (let i = 0; i < len; i++) {
                            this.list[i].time = new Date(this.list[i].time * 1000);
                        }
                    } else {
                        console.log('getList res is not array');
                    }
                    this.listLoading = false;
                });
            },
            handleAppendBlockChain() {
                this.appendToBlockChainInfo = Object.assign({}, this.defaultAppendToBlockChainInfo);
                this.appendToBlockChainInfo.dialogVisible = true;
            },
            handleAppendBlockChainConfirm() {
                let params = new URLSearchParams();
                let paras = this.appendToBlockChainInfo.article.split("\n");
                params.append('article', JSON.stringify(paras));
                appendToBlockChain(params).then(response => {
                    this.appendToBlockChainInfo = Object.assign({}, this.defaultAppendToBlockChainInfo);
                    this.$message({
                        message: response.data.message,
                        type: "success"
                    });
                    this.getList();
                })
            },
            handleSearchBlockChain() {
                this.searchBlockChainInfo = Object.assign({}, this.defaultSearchBlockChainInfo);
                this.searchBlockChainInfo.dialogVisible = true;
            },
            handleSearchBlockChainConfirm() {
                let params = new URLSearchParams();
                let keywords = []
                let len = this.searchBlockChainInfo.keywords.length;
                for (let i = 0; i < len; ++i) {
                    keywords.push(this.searchBlockChainInfo.keywords[i].key);
                }
                params.append('keywords', JSON.stringify(keywords));
                searchBlockChain(params).then(response => {
                    this.searchBlockChainInfo = Object.assign({},  this.defaultSearchBlockChainInfo);
                    this.searchBlockChainInfo.dialogVisible = false;
                    this.$message({
                        message: response.data.message,
                        type: "success"
                    });
                    let arr = response.data.data;
                    let len = arr.length;
                    this.list = [];
                    console.log(arr);
                    for (let i = 0; i < len; i++) {
                        this.list.push(JSON.parse(arr[i]));
                        this.list[i].time = new Date(this.list[i].time * 1000);
                    }
                })
            },
            handleConfirmBlockChain(index, row) {
                this.confirmBlockChainInfo = Object.assign({}, this.defaultConfirmBlockChainInfo);
                this.confirmBlockChainInfo.dialogVisible = true;
                this.confirmBlockChainInfo.hash = row.byte;
            },
            handleConfirmBlockChainConfirm() {
                let params = new URLSearchParams();
                params.append('hash', this.confirmBlockChainInfo.hash);
                let paras = this.confirmBlockChainInfo.article.split("\n");
                params.append('article', JSON.stringify(paras));
                this.$confirm("是否确定检查篡改", "提示", {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                }).then(() => {
                    this.confirmBlockChainInfo = Object.assign({}, this.defaultConfirmBlockChainInfo);
                    confirmArticle(params).then(response => {
                        if (response.data.code === "400") {
                            this.$message({
                                message: response.data.info,
                                type: "warning"
                            })
                        } else {
                            this.$message({
                                message: response.data.message,
                                type: "success"
                            })
                            if (response.data.hasOwnProperty("data")) {
                                let msg = "篡改的段落为： ";
                                let arr = response.data.data.sort();
                                let len = arr.length;
                                for (let i = 0; i < len; i++) {
                                    msg = msg + arr[i] + "  ";
                                }
                                this.$alert(msg, '文章有篡改', {
                                    confirmButtonText: '确定',
                                });
                            }
                        }

                    })
                })
            },
            handleAddKeywordsItem() {
                this.searchBlockChainInfo.keywords.push({'key': ''})
            },
            handleDeleteKeywordsItem(index) {
                this.searchBlockChainInfo.keywords.splice(index, 1);
            },
            handleInitBlockChain() {
                initBlockChain().then(response => {
                    this.$message({
                        message: response.data.message
                    });
                    this.getList();
                })
            },
            handleContent(index, row) {
                this.$confirm("是否要查看内容", "提示", {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("hash", row.byte);
                    getContent(params).then(response => {
                        if (response.data.status === "200") {
                            let arr = response.data.data;
                            let article = "";
                            let len = arr.length;
                            for (let i = 0; i < len; i++) {
                                article = article + arr[i] + "\n";
                            }
                            this.articleInfo.article = article;
                            this.articleInfo.dialogVisible = true;
                            this.articleInfo.hash = row.byte;
                        } else {
                            this.$message({
                                message: response.data.message,
                                type: "warning"
                            })
                        }
                    })
                })
            },
            handleContentConfirm() {
                this.articleInfo = Object.assign({}, this.defaultArticleInfo);
            },
            handleNode() {
                this.$confirm("是否要注册成为普通节点", "提示", {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                }).then(() => {
                    node().then(response => {
                        if (response.data.status === "200") {
                            this.$message({
                                message: response.data.message,
                                type: "success"
                            })
                        } else {
                            this.$message({
                                message: response.data.info,
                                type: "warning"
                            })
                        }
                        this.getList();
                    });
                });
            },
            handleSuperNode() {
                this.$confirm("是否要注册成为超级节点", "提示", {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                }).then(() => {
                    superNode().then(response => {
                        if (response.data.status === "200") {
                            this.$message({
                                message: response.data.message,
                                type: "success"
                            })
                        } else {
                            this.$message({
                                message: response.data.info,
                                type: "warning"
                            })
                        }
                    });
                    this.getList();
                });
            },
            handleSave() {
                saveBlockChain().then(response => {
                    if (response.data.status === "200") {
                        this.$message({
                            message: response.data.message,
                            type: "success"
                        })
                    } else {
                        this.$message({
                            message: response.data.info,
                            type: "warning"
                        })
                    }
                })
            },
            handleLoad() {
                loadBlockChain().then(response => {
                    if (response.data.status === "200") {
                        this.$message({
                            message: response.data.message,
                            type: "success"
                        })
                    } else {
                        this.$message({
                            message: response.data.info,
                            type: "warning"
                        })
                    }
                    this.getList();
                });
            },
            handleUpdate() {
                update().then(response => {
                    if (response.data.status === "200") {
                        this.$message({
                            message: response.data.message,
                            type: "success"
                        })
                    } else {
                        this.$message({
                            message: response.data.info,
                            type: "warning"
                        })
                    }
                    this.getList();

                });
            },
            handleUpdatePartly() {
                updatePartly().then(response => {
                    if (response.data.status === "200") {
                        this.$message({
                            message: response.data.message,
                            type: "success"
                        })
                    } else {
                        this.$message({
                            message: response.data.info,
                            type: "warning"
                        })
                    }
                    this.getList();
                });
            },
        },
        filters: {
            formatTime(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
        }
    }
</script>
<style scoped>
    .app-container {
        margin-top: 40px;
        margin-left: 160px;
        margin-right: 160px;
    }
</style>
