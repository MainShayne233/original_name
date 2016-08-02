module.exports = function(ctx, done) {
  var https = require("https");
  var app_name = ctx.data.name;
  var options = {
  host: 'api.github.com',
  path: 'https://api.github.com/search/repositories?q=' + app_name,
  method: 'GET',
  headers: {'user-agent': 'node.js'}
  };

  function super_stripped(str){
    return str.toLowerCase()
              .split('_').join('')
              .split('-').join('')
  }

  function contains(str1, str2){
    return [
            str1.indexOf(super_stripped(str2)),
            str2.indexOf(super_stripped(str1))
           ].reduce(function(a,b){return a+b}, 0) > -2;

  }

  function is_exact(str1, str2){
    return super_stripped(str1) === super_stripped(str2);
  }

  var request = https.request(options, function(response){
    var body = '';
    response.on("data", function(chunk){
        body += chunk.toString('utf8');
    });

    response.on("end", function(){
      var data = JSON.parse(body)
      var exact_matches = [];
      var close_matches = [];
      var similar_matches = [];
      if (data.total_count > 0){
        data.items.forEach(function(item){
          var repo_and_author = item.name +
                                " by " +
                                item.owner.login +
                                " - " +
                                item.html_url
          if (is_exact(item.name, app_name)){
            exact_matches.push(repo_and_author);
          }
          else if (contains(item.name, app_name)){
            close_matches.push(repo_and_author);
          }
          else{
            similar_matches.push(repo_and_author);
          }
        });
        msg = "\nFound some Github repos with similar names to " + app_name
        if (exact_matches.length > 0 ){
          msg += "\n\nExact matches:\n" +
                 exact_matches.join("\n")
        }
        if (close_matches.length > 0 ){
          msg += "\n\nClose matches:\n" +
                 close_matches.join("\n")
        }
        if (similar_matches.length > 0 ){
          msg += "\n\nSimilar matches:\n" +
                 similar_matches.join("\n")
        }
        msg += "\n"
      }
      else{
        msg = "\nNo matches found! Looks like " + app_name + " is an original!\n"
      }
      done(null, msg);
    });
  });
  request.end();
}
