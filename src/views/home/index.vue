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
                    type="primary"
                    style="margin-right: 15px"
                    @click="handleSearchBlockChain()"
                    size="mini">
                查询
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
                        <span v-show="scope.row.show">{{scope.row.time | formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px" align="center">
                    <template slot-scope="scope">
                        <p>
                            <el-button
                                    v-show="scope.row.show"
                                    size="mini"
                                    type="primary"
                                    @click="handleConfirmBlockChain(scope.$index, scope.row)">检查篡改
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
            <el-input type="textarea" v-model="appendToBlockChainInfo.article" placeholder="请输入文章"></el-input>
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
                        <el-input placeholder="请输入内容" v-model="scope.row"></el-input>
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
            <el-input style="width: 180px" v-model="confirmBlockChainInfo.article" placeholder="请输入文章"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmBlockChainInfo.dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirmBlockChainConfirm()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import {confirmArticle, listBlockChain, appendToBlockChain, searchBlockChain} from "@/api/blockchain";
    import {formatDate} from '@/utils/date';

    export default {
        name: "blockChainView",
        data() {
            return {
                list: [{
                    byte: '',
                    time: '',
                }],
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
                    keywords : [],
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
                }
            }
        },
        created() {
            // this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                listBlockChain().then(response => {
                    this.listLoading = false;
                    this.list = JSON.parse(response.data);
                    if (Array.isArray(this.list)) {
                        let len = this.list.length;
                        for (let i = 0; i < len; i++) {
                            this.list[i].time = new Date(this.list[i].time);
                        }
                    } else {
                        console.log('getList res is not array');
                    }
                });
            },
            handleAppendBlockChain() {
                this.appendToBlockChainInfo = this.defaultAppendToBlockChainInfo;
                this.appendToBlockChainInfo.dialogVisible = true;
            },
            handleAppendBlockChainConfirm() {
                let params = new URLSearchParams();
                params.append('article', this.appendToBlockChainInfo.article);
                appendToBlockChain(params).then(response => {
                    this.appendToBlockChainInfo = this.defaultAppendToBlockChainInfo;
                    this.$message({
                        message: response.message,
                        type: "success"
                    })
                })
            },
            handleSearchBlockChain() {
                this.searchBlockChainInfo = this.defaultSearchBlockChainInfo;
                this.searchBlockChainInfo.dialogVisible = true;
            },
            handleSearchBlockChainConfirm() {
                let params = new URLSearchParams();
                params.append('keywords', JSON.stringify(this.searchBlockChainInfo.keywords));
                searchBlockChain(params).then(response => {
                    this.searchBlockChainInfo = this.defaultSearchBlockChainInfo;
                    this.$message({
                        message: response.message,
                        type: "success"
                    })
                })
            },
            handleConfirmBlockChain(index, row) {
                this.confirmBlockChainInfo = this.defaultConfirmBlockChainInfo;
                this.confirmBlockChainInfo.dialogVisible = true;
                this.confirmBlockChainInfo.hash = row.byte;
            },
            handleConfirmBlockChainConfirm() {
                let params = new URLSearchParams();
                params.append('hash', this.confirmBlockChainInfo.hash);
                params.append('article', this.confirmBlockChainInfo.article);
                confirmArticle(params).then(response => {
                    this.confirmBlockChainInfo = this.defaultConfirmBlockChainInfo;
                    this.$message({
                        message: response.message,
                        type: "success"
                    })
                })
            },
            handleAddKeywordsItem() {
                this.searchBlockChainInfo.keywords.push('')
            },
            handleDeleteKeywordsItem(index) {
                this.searchBlockChainInfo.keywords.splice(index, 1);
            }
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
        margin-left: 200px;
        margin-right: 200px;
    }
</style>
