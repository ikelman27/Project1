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


const forbidden = (request, response) => {
  const responseJSON = {
    message: 'Only a cards author can modify a card.',
    id: 'Forbidden',
  };


  return respondJSON(request, response, 403, responseJSON);
};

const cardNotFound = (request, response, message) => {
  // create error message for response
  const responseJSON = {
    message,
    id: 'notFound',
  };


  return respondJSON(request, response, 400, responseJSON);
};


const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'name and age are required',
  };


  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }


  let responseCode = 201;
  let newCard = true;
  let cardLoc = 0;
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === body.name) {
      newCard = false;
      cardLoc = i;
    }
  }

  if (!newCard) {
    responseCode = 204;
    if (body.vote) {
      console.log(users[cardLoc].score);
      users[cardLoc].score++;
    } else if (request.connection.remoteAddress === users[cardLoc].author) {
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
      return forbidden(request, response);
    }
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
      score: 1,
      author: request.connection.remoteAddress,
    });
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Sucessfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const getUsers = (request, response, params) => {
  let exportVal = [];
  // if there are no paramiters return every card
  if (!params) {
    exportVal = users;
  }
  const keys = Object.keys(params);
  // console.log("Key length " + keys.length);

  // loop through every card and check if it meets params to return
  for (let i = 0; i < users.length; i++) {
    let addCard = true;
    for (let j = 0; j < keys.length; j++) {
      if (params[keys[j]] !== users[i][keys[j]] && params[keys[j]] !== 'All') {
        addCard = false;
      }
    }

    if (addCard) {
      exportVal.push(users[i]);
    }
  }
  if (exportVal.length === 0) {
    return cardNotFound(request, response, 'no cards match that description');
  }

  // exportVal.push();
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
