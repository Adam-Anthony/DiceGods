const Discord = require('discord.js');
const client = new Discord.Client();

const request = require('request');

const seedrandom = require('seedrandom');
Math.seedrandom('hello.');

var dotenv = require('dotenv');
dotenv.load();

const key = /^\\r/;

// DICE ROLLERS ****************************************************************************
// n = number of dice rolled
// size = Size of the dice.
// Returns: [Individual rolls as a string], [Total of all rolls combined.]
function roll(n, size){
	var batch =[];
	//Roll Dice
	for (var i = n - 1; i >= 0; i--) {
		var dieRoll = Math.floor((size)*Math.random()+1);
		//console.log(dieRoll);
		batch.push(dieRoll);
		//console.log(batch);
	};
	//Start setting it up to be readable
	var foo = '['+batch[0]+']';
	var tot = batch[0];
	if (batch.length === 1){
		//add modifiers
		return [foo,tot];
	}
	for (var i = 1; i <= batch.length - 1; i++) {
		foo += ('+' + '['+batch[i]+']');
		//console.log(foo);
		tot = tot + batch[i];
		//console.log(tot);
	}
	//add in modifiers
	return [foo,tot];
};

function rollE(n, size, modifier, target){

};


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// MESSSAGE

client.on('message', msg => {
    if (msg.author.bot) return;
    if (msg.deleted) return;
    
    if (key.test(msg.content)) {
    	var total = 0;
    	var res = '';
    	var resTot = '';

    	var rollRegex = /([+-] )?\d+d\d+/g;
    	if (rollRegex.test(msg.content)){
    		var rollMatchs = msg.content.match(rollRegex);
    		console.log(rollMatchs);

    		for (var i = 0; i <= rollMatchs.length - 1; i++) {
    			let sign = 1;
    			let added = false;
    			//Check if this is an add-on to the first roll.
    			if ((/^[+-]/).test(rollMatchs[i])){
    				//console.log('found the +');
    				added = true;
    				if (rollMatchs[i].match(/^[+-]/) == '-'){
    					sign = -1;
    				}
    				rollMatchs[i] = rollMatchs[i].slice(2);
    			}

    			//Rolling the rolls
    			let numbers  = rollMatchs[i].split(/d/);
    			//console.log(numbers);
    			let retVal = roll(numbers[0], numbers[1]);

    			//putting the proper + or -
    			if (added) {
    				if (sign === -1){
    					res += '- '
    					resTot += '- '
    				}else{
	    				res += '+ ';
	    				resTot += '+ '
    				}
    			}
    			//adding in formatting
    			console.log(i);
    			res += '`' + retVal[0] + '` ';
    			total += sign*retVal[1];
    			resTot += '**'+retVal[1]+'** '
    		}
    		//finished going through rolls, now we check on modifiers
    		if (/[+-] \d+$/.test(msg.content)){
    			let abc = msg.content.match(/[+-] \d+$/);
    			let modNums = abc[0].split(' ');
    			if (modNums[0] == '-'){
    				total -= parseInt(modNums[1]);
    			}else{
    				total += parseInt(modNums[1]);
    			}
    			res += ' ' + abc[0];
    			resTot += ' ' + abc[0];
    		}
    	
        	//var res = roll(2,6);
        	res += ' = ' + '**'+total+'**';
        	var retMsg = '`' + msg.content + '`\n' + res;
        	retMsg += ('\n' + resTot + ' = **' + total +'**');
        	msg.reply(retMsg);
    	}
    }
});

//GENERATING SEED

var n = 1;
var len = 14;
var ls = 'abcdefghijklmnopqrstuvwxyz 0123456789'
var options = {
		'jsonrpc': '2.0',
		'method': 'generateStrings',
		'params': {
			'apiKey': process.env.RANDOM_API_KEY,
			'n': 1,
			'length': 14,
			'characters': `${ls}`,
			'replacement': true
		},
		'id': 7294
	}
	request.post('https://api.random.org/json-rpc/1/invoke',
	{
		method: "POST",
		json: true,
		body: options
	},
	function (error, response, body){
		console.log('error:', error);
		console.log('statusCode:', response && response.statusCode);
		console.log('body', body);
		let x = JSON.stringify(body);
		let y = JSON.parse(x);
		var z = y.result.random.data;
		timeout = y.result.advisortyDelay;
		requestsLeft = y.result.requestsLeft;
		console.log(z);
		rng = z;
		Math.seedrandom(z);
		return z;
	});

client.login(process.env.BOT_TOKEN);
