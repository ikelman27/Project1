
// an array of all cards on the server
const users = [];


const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.end();
};

// forbiden for Author errors
const forbidden = (request, response) => {
  const responseJSON = {
    message: 'Only a cards author can modify a card.',
    id: 'Forbidden',
  };


  return respondJSON(request, response, 403, responseJSON);
};

// 400 returned for empty get requests
const cardNotFound = (request, response, message) => {
  // create error message for response
  const responseJSON = {
    message,
    id: 'notFound',
  };


  return respondJSON(request, response, 400, responseJSON);
};


// adds a card to the server
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Card name is requiored',
  };

  // if there is no name return 400 with missing params
  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // set default checks for cardloc response code and assume the card is new
  let responseCode = 201;
  let newCard = true;
  let cardLoc = 0;
  // Loop through all cards and check if any have the same name as the new card
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === body.name) {
      // if there is set newcard to false and get the cards index
      newCard = false;
      cardLoc = i;
    }
  }

  // If the card isn't new update the exesting card
  if (!newCard) {
    responseCode = 204;

    // if the card is a vote increase the card's score by 1.
    if (body.vote) {
      users[cardLoc].score++;
      // otherwise if the IP address for the client and the author are the same update the card,
      // otherwise return a forbidden error
    } else if (request.connection.remoteAddress === users[cardLoc].author) {
      // update the card
      users[cardLoc].name = body.name;
      users[cardLoc].cost = body.cost;
      users[cardLoc].attack = body.attack;
      users[cardLoc].health = body.health;
      users[cardLoc].text = body.text;
      users[cardLoc].rarity = body.rarity;
      users[cardLoc].class = body.class;
      users[cardLoc].cardArt = body.cardArt;
      users[cardLoc].score = 1;
    } else {
      // 403 error
      return forbidden(request, response);
    }
    // IF there is no card with this name add it to the array of cards
  } else {
    // add new User to end of array
    users.push({
      name: body.name,
      cost: body.cost,
      health: body.health,
      attack: body.attack,
      text: body.text,
      rarity: body.rarity,
      class: body.class,
      cardArt: body.cardArt,
      // default score is one
      score: 1,
      author: request.connection.remoteAddress,
    });
  }

  // if the card is an new return a 201, otherwise return a 204 for udpated
  if (responseCode === 201) {
    responseJSON.message = 'Created Sucessfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// gets users based off querys
const getUsers = (request, response, params) => {
  // exportVal is the array of cards returned from the server
  let exportVal = [];
  // if there are no paramiters return every card
  if (!params) {
    exportVal = users;
  }

  // get the keys of every paramiter
  const keys = Object.keys(params);
  // console.log("Key length " + keys.length);

  // loop through every card and check if it meets params to return
  for (let i = 0; i < users.length; i++) {
    let addCard = true;
    // for each card check every key in the query string to make sure it matches every key-value
    for (let j = 0; j < keys.length; j++) {
      // Lines like this are why people dont like javascript,
      // checks if the cards value for a key is equal to the querys value for the key
      // also checks if the query value dosent equal All, aka all values for the key.
      if (params[keys[j]] !== users[i][keys[j]] && params[keys[j]] !== 'All') {
        // if they dont match dont add the card
        addCard = false;
      }
    }
    // if the card matches the query, add it to the end of the export array
    if (addCard) {
      exportVal.push(users[i]);
    }
  }
  // if there are no cards return a 400 error with no cards found
  if (exportVal.length === 0) {
    return cardNotFound(request, response, 'no cards match that description');
  }

  // otherwise return all the cards found in the query
  const responseJSON = {
    exportVal,
  };
  return respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);


const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);


// function for 404 not found requests with message
const notFound = (request, response) => {
  // create error message for response
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };


  return respondJSON(request, response, 404, responseJSON);
};


// set public modules
module.exports = {
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  addUser,
  cardNotFound,
  forbidden,

};
