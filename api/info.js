const axios = require('axios').default;

async function handler(_req, resp) {
  const weatherApiKey = process.env.OPENSKY_API_KEY || '';

  let response = {};

  await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=39.7707286&lon=-86.0703977&appid=${weatherApiKey}&units=imperial`
  )
  .then((json) => {
    const utc_offset = json.data.timezone / 3600;

    const client_date = new Date();
    const utc = client_date.getTime() + client_date.getTimezoneOffset() * 60000;
    const server_date = new Date(utc + 3600000 * utc_offset);

    calculateResponse(server_date, response);
    calculateCountdown(server_date, response);
    addQuote(response);
  });

  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  resp.json(response);
}

function calculateResponse(today, response) {
  const day = today.getDay();

  if (day === 4) {
    response.days_until = 0;
    response.message = 'IT IS ARMA NIGHT DAY';
  } else if (day === 3) {
    response.days_until = 1;
    response.message = 'IT IS ARMA NIGHT DAY EVE';
  } else if (day !== 4) {
    const days = (4 + (7 - day)) % 7;

    response.days_until = days;
    response.message = `${days} DAYS UNTIL ARMA NIGHT DAY`;
  }

  return response;
}

function nextDay(date, dayOfTheWeek) {
  date.setDate(date.getDate() + (dayOfTheWeek + (7 - date.getDay())) % 7);

  return date;
}

async function calculateCountdown(today, response) {
  let countdown = {};

  const copyOfToday = new Date(today.getTime());

  let nextThursday = nextDay(today, 4);
  nextThursday.setHours(20, 0, 0);

  const distance = nextThursday - (copyOfToday.getTime());

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  let hoursZeroPad = (hours < 10) ? '0' : '';
  let minutesZeroPad = (minutes < 10) ? '0' : '';
  let secondsZeroPad = (seconds < 10) ? '0' : '';

  countdown.days = days;
  countdown.hours = hours;
  countdown.hours_display = `${hoursZeroPad}${hours}h`;
  countdown.minutes = minutes;
  countdown.minutes_display = `${minutesZeroPad}${minutes}m`;
  countdown.seconds = seconds;
  countdown.seconds_display = `${secondsZeroPad}${seconds}s`;

  countdown.countdown_text = (distance < 0)
    ? 'SQUAD, ASSEMBLE!'
    : `Squad assembles in ${days}d ${hoursZeroPad}${hours}h ${minutesZeroPad}${minutes}m ${secondsZeroPad}${seconds}s`;

  response.countdown = countdown;

  response.eight_pm_in = null;

  if (today.getDay() === 4) {
    let city = '';

    if (distance < 0) {
      // GMT -4
      city = 'Indianapolis, Indiana, USA';
    } else if (hours === 0) {
      // GMT -3
      city = 'Buenos Aires, Argentina';
    } else if (hours === 1) {
      // GMT -2
      city = 'Grytviken, South Georgia';
    } else if (hours === 2) {
      // GMT -1
      city = 'Ponta Delgada, Portugal';
    } else if (hours === 3) {
      // GMT 0
      city = 'Casablanca, Morocco';
    } else if (hours === 4) {
      // GMT 1
      city = 'Oslo, Norway';
    } else if (hours === 5) {
      // GMT 2
      city = 'Athens, Greece';
    } else if (hours === 6) {
      // GMT 3
      city = 'Doha, Qatar';
    } else if (hours === 7) {
      // GMT 4
      city = 'Saratov, Russia';
    } else if (hours === 8) {
      // GMT 5
      city = 'Karachi, Pakistan';
    } else if (hours === 9) {
      // GMT 6
      city = 'Dhaka, Bangladesh';
    } else if (hours === 10) {
      // GMT 7
      city = 'Jakarta, Indonesia';
    } else if (hours === 11) {
      // GMT 8
      city = 'Shanghai, China';
    } else if (hours === 12) {
      // GMT 9
      city = 'Tokyo, Japan';
    } else if (hours === 13) {
      // GMT 10
      city = 'Melbourne, Australia';
    } else if (hours === 14) {
      // GMT 11
      city = 'Luganville, Vanuatu';
    } else if (hours === 15) {
      // GMT 12
      city = 'Toga Village, Tuvalu';
    } else if (hours === 16) {
      // GMT 13
      city = 'Lapaha, Tonga';
    } else if (hours === 17) {
      // GMT 14
      city = 'Tarawa, Kiribati';
    }

    response.eight_pm_in = city;
  }

  return response;
}

function addQuote(response) {
  const index = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[index];

  response.quote = `"${randomQuote}" - Clay Taylor`;

  return response;
}

const quotes = [
  'Tiger Woods is the greatest athlete of all time.',
  'Printers are for artists and the elderly.',
  'Dark Age is the best book ever written.',
  'You have to be crazy when racing bikes...otherwise you finish in the back.',
  'Jimmy John\'s...No. If I wanted lunch meat and bread I\'d just go home.',
  'Shooting a basketball is like riding a bike, Ben.',
  'I\'ve got heavy feet.',
  'Half of success in this world is being seen.',
  'Some may say I don\'t take the straightest path there.',
  'I inherently disagree with spreadsheets.',
  'I love ammo factories.',
  'That\'s a big nope fish, Ben.',
  'You\'ve got to have one crappy cup of coffee a week to keep you grounded.',
  'If you don\'t understand software get out.',
  'With enough NOS you can do anything.',
  'I hope this fails, \'cause then I\'ll be right!',
  'This is a midwestern thing. People just read things and think they are right. People say Reese Pieces all the time, and it\'s so wrong.',
  'I do not use hand screw drivers.',
  'Also for the record. I don\'t like the term DIY...',
  'Centergrove is the Carmel of the southside, but if it was on the Northside it would be Sheridan.',
  'Manual labor is not that hard, it just takes time.',
  'I use words like always and never a lot.',
  'If you told me to go out there and get second to last place, I couldn\'t do it.',
  'I actually like to lose, because it means you\'ve accomplished something.',
  'I\'d lick a toilet seat for $175,000 a year.',
  'I\'m done with caring about strength.',
  'Traversing space is a waste of time and harmful.',
  'With regards to 24hrs a day I\'m pretty snowflakey.',
  'Hmm... Just typing sports didn\'t make it work...',
  'It\'s sugar. It doesn\'t matter. All sugar is created equal.',
  'I tend to do better in person at connecting with and wooing individuals.',
  'When in doubt, press the plus button on anything.',
  'If I can sit up here and make decisions all day that make you hate me, I\'ll do that.',
  'I don\'t have time for incompetence.',
  'I\'m a humble man...but I also know that I am an attractive man.',
  'My only issue with these public pools is they don\'t allow alcohol.',
  'This is all I want, to be voted into some secret club!',
  'Walking is for high schoolers.',
  'I think everything is a man.',
  'Tuesdays are great days... because it\'s not Monday... but it\'s not Wednesday',
  'I\'m an excuse...',
  'I\'m a very oily person...',
  'Welp...taste and smell already back. Maybe I never lost it.',
  'Driving things are all guidelines... (while cutting through a gas station)',
  'If there\'s one thing I don\'t want, it\'s my guac to be squeezed.',
  'I will hustle so much for commission.',
  'I need a circular plate, so I can attack it from all angles.',
  'Yeah... I don\'t know. Maybe I\'m asking too much... But I feel like if you are billing at $150 an hour, you should know how to set an environment variable.',
  'Nolan, I\'ve been giving you favors my whole life.',
  'I can put a 1k sound system in a 2001 Honda Civic and would call it a budget car. That\'s my logic.',
  'People tend to be unhappy with me but I\'m still around...',
  'Ed, there\'s a new princess in town, and it\'s me!'
];

const cities = [
  { tz_offset: 0, location: '' }
];

export default handler;
