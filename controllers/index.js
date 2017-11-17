// index:

// module.exports = {
//     'GET /': async (ctx, next) => {
//         ctx.render("index.html", {

//         });
//     }
// };

var fn_view = async(ctx, next) => {
    var name = ctx.params.name;
    ctx.render(name, {

    });
};

module.exports = {
    'GET /:name': fn_view,
    'GET /': async(ctx, next) => {
        ctx.render("index.html", {});
    },
    'GET /xx': async(ctx, next) => {
        ctx.render("index.html", {});
    },

};