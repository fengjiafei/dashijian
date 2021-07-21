$(function() {
    art_cate(); //调用获取列表分类函数
    //定义获取列表分类事件
    function art_cate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'get',
            success: function(res) {
                //模板引擎添加到表格body中
                var html = template('tpl-table', res);
                $('tbody').html(html);
            }
        })
    }
    var layer = layui.layer;
    var indexAdd = null;
    $('#addbtn').on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#add').html()
            });


        })
        /**************新增分类************** */
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                art_cate(); //把添加数据重新渲染到页面上
                layer.msg('新增分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    /**************编辑分类************************ */

    var indexEdit = null; //关闭弹出层时会用到
    //因为按钮在模板引擎中，需要代理分类
    $('tbody').on('click', '#editbtn', function() {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#edit').html()
        });


        var id = $(this).attr('data-id');
        console.log(id);
        var form = layui.form;
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res)
                form.val('form-edit', res.data); //   <!--  lay-filter="user_info"给表单赋值 -->

            }
        })

    })

    //通过代理的形式，给表单绑定sumbit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }

                layer.msg('更新分类成功！')
                    // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
                art_cate(); //把添加数据重新渲染到页面上
            }
        })
    })

    /*************************删除分类************************************ */
    $('tbody').on('click', '#deletebtn', function() {

        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index) //关闭确认弹框
                    art_cate(); //把添加数据重新渲染到页面上
                }
            })
        })
    })
})