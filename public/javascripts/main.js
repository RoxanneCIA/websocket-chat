; (function () {
    const socket = io('http://localhost:3000');
    const name = prompt('请输入您的名字');
    const uuid = guid();
    const KEY_ENTER = 13;
    socket.on('open', function () {
        console.log('服务连接成功！')
        var msg = {
            uname: name,
            uuid: uuid,
            msg: ''
        };
        socket.send(msg)
    })
    socket.on('addorleave', function (json) {
        console.log(json)
    })
    socket.on('msg', function (json) {
        var $html, _class, $msgCont = $('.msg-content');
        if (uuid === json.id) {
            _class = ['me', 'right'];
        } else {
            _class = ['', 'left'];
        }
        $html = `<div class="receive-content ${_class[0]}">
                    <div class="bubble ${_class[1]}">
                        <div class="bubble-cont">${json.time + '@' + json.author + ': ' + json.text}</div>
                    </div>
                </div>`;
        $('.receive-msg').append($html)
        $msgCont.scrollTop($msgCont[0].scrollHeight - $msgCont.height())
    })
    $('.msg-send').on('click', function () {
        var $input = $(this).parent().prev().find('input'),
            $val = $input.val();
        if ($val !== '') {
            var msg = {
                msg: $val
            };
            socket.send(msg)
            $input.val('')
        }
    })
    $('.msg-input input').on('keyup', function (e) {
        if (e.keyCode === KEY_ENTER) $('.msg-send').trigger('click')
    })
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
})()