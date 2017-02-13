var request = require('request'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    entries = [];

request('http://support.screeps.com/hc/en-us/articles/203079201-RoomPosition', function(err, resp, body) {
    if (!err && resp.statusCode == 200) {
        var $ = cheerio.load(body);

        var json = { method : []};

        $('.api-title').each(function(){

            var jsonMethod =
                {
                    title : "",
                    description : "",
                    arguments: []
                };

            var title = $(this).text();
            title = title.replace('CPU cost: CONST', '');
            title = title.replace('CPU cost: HIGH', '');
            title = title.replace('CPU cost: LOW', '');
            title = title.replace('CPU cost: AVERAGE', '');
            console.log('loading title');
            jsonMethod.title = title;

            if ($(this).next().hasClass('api-desc')){
                console.log('loading description');
                var description = $(this).next('.api-desc').text();
                jsonMethod.description = description;
            }

            if ($(this).next().next().hasClass('api-body')){
                console.log('loading argument');
                var arguments = $(this).next().next('.api-body');
                arguments = arguments.children('.api-args');
                console.log(arguments.text());

                jsonArgument =
                    {
                        argTitle : "",
                        argType : "",
                        argDesc : ""
                    }

                blockArgumentList = [];
                arguments.each(function() {
                    blockArgumentList.push($(this).contents());
                })
                //console.log(blockArgumentList);
                for (var i = 0; i < blockArgumentList.length; i++){
                    if (i == 0 || i % 3 == 0){
                        //console.log(i);
                    }
                }
            }

            json.method.push(jsonMethod);
        });






        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            console.log('File successfully written! - Check your project directory for the output.json file');
        })
    }
});