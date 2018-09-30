const users = {};


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
  if (users[body.name]) {
    responseCode = 204;
    users[body.name].name = body.name;
    users[body.name].cost = body.cost;
    users[body.name].attack = body.attack;
    users[body.name].health = body.health;
    users[body.name].text = body.text;
    users[body.name].rarity = body.rarity;
    users[body.name].class = body.class;
  } else {
    users[body.name] = { name: body.name,
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
