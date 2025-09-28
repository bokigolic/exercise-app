export async function handler(event, context) {
  try {
    const res = await fetch("https://exercisedb.p.rapidapi.com/exercises", {
      headers: {
        "X-RapidAPI-Key": process.env.EXERCISEDB_KEY,  // API ključ iz Netlify okruženja
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
      }
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
