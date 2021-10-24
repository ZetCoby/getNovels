const Crawler = require("crawler");
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const c = new Crawler({
    jQuery: jsdom,
    rateLimit: 300,
    maxConnections: 1,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = new JSDOM(res.body);
            console.log($.window.document.querySelector(".truyen-title").textContent)
            let novelTitle = `./novels/${$.window.document.querySelector(".truyen-title").textContent.replace(/ /g, "_")}.html`;
            const domain = "http://novelfull.com";


            let content = $.window.document.querySelector('#chapter-content');
            // content.querySelectorAll('script').each(function() {
            //     this.remove();
            // })
            // content.querySelectorAll('ins').each(function() {
            //     this.remove();
            // })
            let chapterTitle = $.window.document.querySelector('.breadcrumb .active a').textContent;
            if (!fs.existsSync(novelTitle)) {
                fs.writeFileSync(novelTitle, '');
            }
            
            fs.appendFileSync(novelTitle, `<h1>${chapterTitle}</h1>` + content.outerHTML, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(chapterTitle + "saved !");
            }); 
            console.log(novelTitle,"--->",chapterTitle)

            if ($.window.document.querySelector("#next_chap")) {
                c.queue(domain + $.window.document.querySelector("#next_chap").href)
            }

            console.log();
        }
        done();
    }
})



// Renegade Immorrtal
// c.queue('http://novelfull.com/renegade-immortal/chapter-1-leaving-home.html');
// c.queue('http://novelfull.com/treasure-hunt-tycoon/chapter-1-the-purple-bug.html');
// c.queue('https://novelfull.com/the-desolate-era/chapter-1-the-land-of-the-dead.html');
c.queue('https://novelfull.com/another-worlds-versatile-crafting-master/chapter-1-prologue.html');

