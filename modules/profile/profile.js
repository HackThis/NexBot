var Profile = function() {
	//Constructor
};

Profile.prototype = {
	https: require('https'),
	api_key: global.config.get('hackthis_api'),
	handle: function(from, chan, message) {
		var irc = global.irc;

		var matches;
		if (matches = message.match(/^!([\S]*)( (.*))?$/i)) {
			if (matches[1] === "profile") {
				var user = matches[2] || from;
				user = user.trim();
				var self = this;

				var req = this.https.request('https://www.hackthis.co.uk/wechall/userscore.php?authkey='+this.api_key+'&username='+user, function(res) {
					res.setEncoding('utf8');
					var body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});

					res.on('end', function(){
						if (body != 0) {
							data = body.split(":");
							// Return the string.
							var result = data[0] + " | Rank: " + data[1] + " | Score: " + self.addCommas(data[2]) + " | Levels: " + data[4] + '/' + data[5];
							irc.client.say(chan, result);
						} else {
							irc.client.say(chan, "User not found");
						}
					});
				});
				req.end();

				req.on('error', function(e) {
					irc.client.say(chan, "Errm there's be an error");
				});
			}
		}
	},
	addCommas: function(nStr) {
	    nStr += '';
	    x = nStr.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	            x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    return x1 + x2;
	}
};

module.exports = new Profile();
