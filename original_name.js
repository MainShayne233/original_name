var https = require("https");
url = "https://webtask.it.auth0.com/api/run/wt-shaynetremblay-hotmail_com-0/github_search_webtask?webtask_no_cache=1"
if (name = process.argv[2]){
  path = url + '&name=' + name;
}
else{
  console.log("You need to supply a repo name.")
  return;
}

var options = {
host: 'webtask.it.auth0.com',
path: url + '&name=' + process.argv[2],
method: 'GET',
headers: {'user-agent': 'node.js'}
};

var request = https.request(options, function(response){
  var body = '';
  response.on("data", function(chunk){
      body += chunk.toString('utf8');
  });

  response.on("end", function(){
    console.log(JSON.parse(body))
  });
});
request.end();
