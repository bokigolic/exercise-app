// netlify/functions/getExercises.js

export async function handler(event) {
  const { name, bodyPart } = event.queryStringParameters || {};

  let url = "https://exercisedb.p.rapidapi.com/exercises";

  if (name) {
    url = `https://exercisedb.p.rapidapi.com/exercises/name/${name}`;
  } else if (bodyPart) {
    url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.EXERCISEDB_KEY,
        "x-rapidapi-host": "exercisedb.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: `API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
