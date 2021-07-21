$(function() {
    var laypage = layui.laypage;
    //定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条数据
        cate_id: "", //文章分类的id
        state: "" //文章的发布状态
    }
    art_list();
    /********************************定义美化时间过滤器********************************************** */
    // 定义美化时间的过滤器,使用了模板引擎，可以直接调用dataFormat函数
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数，在月份或者日前加0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    /****************** ***********获取文章列表数据********************************************** */
    var form = layui.form;

    function art_list() {
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: function(res) {
                console.log(res)
                    //模板引擎添加到表格body中
                var html = template('tpl-table', res);
                $('tbody').html(html);
                //调用分页方法
                renderPage(res.total);

            }
        })


    }
    /*******************************下拉框渲染*************************** */
    initCate()

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                //渲染下拉框
                var htmlStr = template('tpl-list', res)
                $('[name=cate_id]').html(htmlStr)
                    // 一定要记得调用 form.render() 方法
                form.render();
            }
        })
    }
    /******************************下拉框筛选************************************** */
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        art_list();
    })

    /******************************实现分页功能************************************** */
    //定义渲染分页方法,在表格渲染完成后需调用分页方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构,使用了layui框架
        // 调用 laypage.render() 方法来渲染分页的结构
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                if (!first) {
                    art_list();
                }
            }
        })

    }
})