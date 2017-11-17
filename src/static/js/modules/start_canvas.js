var canvas = document.getElementById("Cav");
var ctx = canvas.getContext("2d");
var canvasT0,
    canvasT,
    canvasT1,
    canvasT2,
    canvasT3;
ctx.fillStyle = 'rgba(255,255,255,1)';
ctx.strokeStyle = 'rgba(255,255,255,1)';
var draw = {
    lineAnime: function (ctx, startArray, endArray, speed, callback) {
        ctx.moveTo(startArray[0], startArray[1]);
        let x = startArray[0],
            y = startArray[1],
            deltaX = endArray[0] - startArray[0],
            deltaY = endArray[1] - startArray[1],
            boleanX = true,
            boleanY = true;
        var loop = function () {
            x += deltaX / speed;
            y += deltaY / speed;
            // console.log(x, y)
            ctx.lineTo(x, y);
            ctx.stroke();
            if (endArray[0] === Math.round(x) && endArray[1] === Math.round(y)) {
                clearTimeout(canvasT0);
                if (callback) {
                    callback()
                }
                return;
            } else {
                canvasT0 = setTimeout(loop, 40)
            }
        }
        loop()
    },
    line1: function (ctx, callback) {

        ctx.lineWidth = 2;
        draw.lineAnime(ctx, draw.line1Obj[0], draw.line1Obj[1], 8, function () {
            draw
                .lineAnime(ctx, draw.line1Obj[1], draw.line1Obj[2], 8, function () {
                    draw
                        .lineAnime(ctx, draw.line1Obj[2], draw.line1Obj[3], 4, function () {
                            callback
                                ? callback()
                                : true
                        })
                })
        })
        ctx.stroke();
    },
    line1Obj: {
        0: [
            285, 35
        ],
        1: [
            660, 35
        ],
        2: [
            660, 218
        ],
        3: [596, 218]
    },
    line2: function (ctx, callback) {

        ctx.lineWidth = 2;
        draw.lineAnime(ctx, draw.line2Obj[0], draw.line2Obj[1], 12, function () {
            draw
                .lineAnime(ctx, draw.line2Obj[1], draw.line2Obj[2], 12, function () {
                    draw
                        .lineAnime(ctx, draw.line2Obj[2], draw.line2Obj[3], 6, function () {
                            callback
                                ? callback()
                                : true
                        })
                })
        })
        ctx.stroke();
    },
    line2Obj: {
        0: [
            480, 265
        ],
        1: [
            45, 265
        ],
        2: [
            45, 80
        ],
        3: [140, 80]
    },
    font1: function (ctx) {

        ctx.font = "42px 黑体";
        ctx.fillText('上海惠和种业', 0, 42);
        ctx.font = "18px 黑体";
        ctx.fillText('SHANGHAI WELLS SEED CO.,LTD.', 0, 62);
        ctx.stroke();
    },
    font2: function (ctx, callback) {

        for (let i = 0; i < 10; i++) {

            canvasT2 = setTimeout(function () {
                // console.log(i);
                ctx.fillStyle = `rgba(255, 255, 255, ${i/10})`;
                ctx.font = "bold 52px 黑体";
                ctx.fillText('让农民得益·让自己发光', 66, 180);
                ctx.font = "22px 黑体";
                ctx.fillText('创新为魂 | 效率优先 | 优质服务 | 提高效益', 140, 215);
                ctx.stroke();
                if (i == 9) {
                    callback
                        ? callback()
                        : true
                }
            }, 80 * i)

        }

    },
    img: function (ctx, callback) {

        var logo = new Image();
        logo.src = "static/images/index_logo.jpg";
        logo.onload = function () {
            ctx.drawImage(logo, 480, 233)
        }
        canvasT3 = setTimeout(function () {
            callback
                ? callback()
                : true;
            clearTimeout(canvasT3)
        }, 200)
        ctx.stroke();
    },
    stop: function () {
        clearTimeout(canvasT0)
        clearTimeout(canvasT)
        clearTimeout(canvasT1)
        clearTimeout(canvasT2)
        clearTimeout(canvasT3)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // console.log('stop')
    },
    init: function (callback) {
        ctx.beginPath();
        draw.font1(ctx)
        draw.line1(ctx, function () {
            canvasT = setTimeout(function () {
                draw
                    .img(ctx, function () {
                        draw
                            .line2(ctx, function () {
                                canvasT1 = setTimeout(function () {
                                    draw.font2(ctx, callback);
                                    clearTimeout(canvasT1)
                                }, 200)
                            })
                    })
                clearTimeout(canvasT)
            }, 200);

        })

    }

}

