module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
            return {
                devServer: {
                    port: 8080,
                    stats: 'minimal',
                    contentBase: '/build/',
                    proxy: {
                        '/ajax': {
                            target: `http://127.0.0.1:${process.env.PORT || 80}`,
                        }
                    }
                }
            }
        }
    }
}
