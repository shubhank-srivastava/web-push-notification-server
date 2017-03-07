var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var webpush = require('web-push');
var webdriver = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var By = webdriver.By;

app.use(express.static('public'));
app.use(bodyParser.json());

var options = new chrome.Options();
options.addArguments(['--enable-push-api-background-mode']);
//options.setChromeBinaryPath('./');
options.setUserPreferences({'profile.default_content_setting_values.notifications': 1});
options.setLocalState({'background_mode.enabled': true});

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

setTimeout(function(){
	driver.get('http://localhost:8888');	
}, 1000);

app.post('/api/subscribe', function(req, res){
	console.log(req.body);
	fs.writeFile('./data/endpoint.json', JSON.stringify(req.body), function(err){
		if(err)
			res.status(500).send();
		else{
			res.status(200).send();
			pushNotification(req, {}, function(){
				console.log('Notification server started.');
			});	
		}
	});
});

app.post('/api/push', pushNotification, function(req, res){
	res.send();
});

app.listen(8888);

/***************************************************************/

var icons = {
	'Google Sheets': 'images/google-spreadsheet-icon.png'
};

function pushNotification(req, res, next){
	var privateKey = "SjPEIwQZXUiCemG7WisWQXfP_XWz03Z8ILlht4HeusU";
	var publicKey = 'BPrmSGzT9l-2A0jKNVgE7fJkRt-4SzcguLhvtNqZTRfKPhxhkWjdkRP-atlq_XzguexFwxDMkWEMAXmaHEQVkfM';
	var pushSubscription = JSON.parse(fs.readFileSync('./data/endpoint.json'));
	
	webpush.setVapidDetails(
	  'mailto:example@yourdomain.org',
	  publicKey,
	  privateKey
	);

	if('title' in req.body){
		var payload =  JSON.stringify({
			title: req.body.title, 
			body: req.body.message,
			icon: icons[req.body.title],
	    	badge: 'images/badge.png'
		});
	}else{
		var payload =  JSON.stringify({
			title: 'HELLO!', 
			body:'Notification server started.',
			icon: 'images/icon.png',
	    	badge: 'images/badge.png'
		});
	}
	
	webpush.sendNotification(pushSubscription, payload);
	
	next();
}