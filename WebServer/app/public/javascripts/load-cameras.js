//$.ajax({
//    url: "http://192.168.43.131:3000/device/lights",
//    dataType: 'json',
//    async: true,
//    data: "",
//}).done(function (datas) {
//    changelight(datas);
//    sendCheckBoxLight(datas);
//    reLedChange(datas);
//});
//
//function changelight(datas) {
//    if (datas.length == 0) {
//        $('.light-container').html('<h3>No Device</h3>');
//    } else {
//        $('.light-container').html('');
//        datas.forEach(function (data) {
//            var checked = data.state ? "checked" : "";
//            var light = '<div class="khung col-md-3">' +
//                '<div class = "child-khung">' +
//                '<button class = "btn-child" onclick = "document.getElementById('id03').style.display='block'"
//                style = "width:auto;" >
//                <
//                img src = "/img/open_window.png" >
//                <
//                br >
//                <
//                h5 class = " col-md-12" > Window 1 < /h5> <
//            span id = "btn-child" > Opened < /span> < /
//                button > <
//                /div> < /
//                div > ;
//            $('.light-container').append(light);
//        });
//    }
//
//};
//
//function sendCheckBoxLight(datas) {
//    $('.light-control').click(function () {
//        var value = $(this).val();
//        datas.forEach(function (e) {
//            if (e._id == value) {
//                delete e.createdAt;
//                delete e.updatedAt;
//                delete e.__v;
//                e.state = state;
//                console.log(e);
//                socket.emit("c2s-ledchange", e);
//            }
//        })
//    });
//}
//
//function reLedChange(datas) {
//    console.log("ok");
//    socket.on("s2c-ledchange", function (rs) {
//        console.log(rs);
//        $("#" + rs._id).checked = rs.state;
//    });
//}