var Discord = require('discord.io');

var logger = require('winston');

var auth = require('./auth.json');

var cards = Array('The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil',
'The Tower','The Star','The Moon','The Sun','Judgment','The World','Ace of Wands','Two of Wands','Three of Wands','Four of Wands','Five of Wands','Six of Wands','Seven of Wands','Eight of Wands','Nine of Wands','Ten of Wands',
'Page of Wands','Knight of Wands','Queen of Wands','King of Wands','Ace of Cups','Two of Cups','Three of Cups','Four of Cups','Five of Cups','Six of Cups','Seven of Cups','Eight of Cups','Nine of Cups','Ten of Cups',
'Page of Cups','Knight of Cups','Queen of Cups','King of Cups','Ace of Swords','Two of Swords','Three of Swords','Four of Swords','Five of Swords','Six of Swords','Seven of Swords','Eight of Swords','Nine of Swords',
'Ten of Swords','Page of Swords','Knight of Swords','Queen of Swords','King of Swords','Ace of Pentacles','Two of Pentacles','Three of Pentacles','Four of Pentacles','Five of Pentacles','Six of Pentacles','Seven of Pentacles','Eight of Pentacles','Nine of Pentacles',
'Ten of Pentacles','Page of Pentacles','Knight of Pentacles','Queen of Pentacles','King of Pentacles');


let definitions = {

  'The Fool' : ['Potential, New Begginings, Opportunity, Adventure', 'Carelessness, Negligence, Uncertainity, Apathy'],
  'The Magician' : ['Skill, Confidence, Action, Concentration, Accomplishment', 'Unease, Lack of Planning, Powerlessness, Procrastination, Arrogance']

}

var tempCards;

var invertOdds = 10;

var toDraw;

var currentDraw;

// Configure logger settings

logger.remove(logger.transports.Console);

logger.add(new logger.transports.Console, {

colorize: true

});

logger.level = 'debug';

// Initialize Discord Bot

var bot = new Discord.Client({

token: auth.token,

autorun: true

});

bot.on('ready', function (evt) {

logger.info('Connected');

logger.info('Logged in as: ');

logger.info(bot.username);

});

bot.on('message', function (user, userID, channelID, message, evt) {

// Our bot needs to know if it will execute a command

// It will listen for messages that will start with `!`

if (message.substring(0, 1) == '!') {

    var args = message.substring(1).split(' ');

    var cmd = args[0];


    //args = args.splice(1);

    switch(cmd) {

        case 'draw':

        //currentDraw = Array('Draw: ');
        currentDraw = 'Draw: ';

          tempCards = [...cards];

          if(Number.isInteger(parseInt(args[1]))){
            var toDraw = parseInt(args[1]);

            if(toDraw > 10){
              send('Max 10 cards per draw', channelID);
              toDraw = 10;
            }
          }else{

            toDraw = 1;
          }


          for(let i = 0; i < toDraw; i++){
            drawCard();
          }

          send(currentDraw, channelID);

        break;

        case 'invertedOdds':

        if(Number.isInteger(parseInt(args[1]))){
          var newOdds = parseInt(args[1]);

          if(newOdds < 0 || newOdds > 100){

            send('Value out of range, must be at least 0 and at most 100');
          }else{

          invertOdds = newOdds;
          send("New odds for an inverted card are: " + newOdds, channelID);
        }

        }else if (args[1] === 'reset' || args[1] === 'Reset') {
          send('Odds for an inverted card reset to 10%', channelID);


        }else{
          send('Unrecognized parameter, input a whole number, or type reset', channelID);

        }

        break;

        case 'define':

        var card = '';

        for(let i = 1; i < args.length; i++){
          card = card.concat(args[i]);
        }

        send(checkCard(card), channelID);



        break;

        // Just add any case commands if you want to..

     }

 }

});

function drawCard(){

  var fatedNum = Math.floor(Math.random() * tempCards.length);

  var drawnCard = tempCards[fatedNum];

  if(Math.floor(Math.random() * 100 <= invertOdds)){

  var drawnCard = 'Inverted' + ' ' + drawnCard;

}

  var drawnCard = '\n' + drawnCard;

  //currentDraw.push(drawnCard);
  var updated = currentDraw.concat(drawnCard)
  currentDraw = updated;
  //Remove the drawn card from the deck
  tempCards.splice(fatedNum, 1);


}

function checkCard(card){

//First, clean up the input and check if the card is inverted
var inverted = false;
card.replace('\n', '');

if(card.includes('Inverted ')){
  card.replace('Inverted ','');
  return definitions[card][1];
}else{

  return definitions[card][0];
}



//Then return the corresponding definition from the dictionary



}

function send(toSay, id){

  bot.sendMessage({

      to: id,

      message: toSay

  });


}
