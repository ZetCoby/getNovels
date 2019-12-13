const Crawler = require("crawler");
const fs = require('fs');
const c = new Crawler({
    rateLimit: 500,
    maxConnections: 5,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            let novelTitle = `./novels/${$(".truyen-title").text()}`;
            const domain = "http://novelfull.com";
            if ($("#prev_chap").is(":disabled")) {                
                if (!fs.existsSync(novelTitle)){
                    fs.mkdirSync(novelTitle);
                }
            }

            let content = $('#chapter-content');
            content.find('script').each(function() {
                $(this).remove();
            })
            content.find('ins').each(function() {
                $(this).remove();
            })
        
            let chapterTitle = $('.chapter-text').text();
            fs.writeFile(novelTitle+"/"+chapterTitle+".html", content.html(), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log(chapterTitle + "saved !");
            }); 

            if ($("#next_chap")) {
                c.queue(domain + $("#next_chap").attr('href'))
            }

            console.log();
        }
        done();
    }
})



// Renegade Immorrtal
c.queue('http://novelfull.com/renegade-immortal/chapter-1-leaving-home.html');
// c.queue('http://novelfull.com/treasure-hunt-tycoon/chapter-1-the-purple-bug.html');
