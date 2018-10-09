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
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};


const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'name and age are required',
  };

  console.log(body);

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
    users[cardLoc].name = body.name;
    users[cardLoc].cost = body.cost;
    users[cardLoc].attack = body.attack;
    users[cardLoc].health = body.health;
    users[cardLoc].text = body.text;
    users[cardLoc].rarity = body.rarity;
    users[cardLoc].class = body.class;
  } else {
    // add new User to end of array
    users[users.length] = { name: body.name,
      cost: body.cost,
      health: body.health,
      attack: body.attack,
      text: body.text,
      rarity: body.rarity,
      class: body.class };
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Sucessfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const getUsers = (request, response) => {
  const responseJSON = { users };
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

};
