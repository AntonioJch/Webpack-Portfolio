//vamos a llamar a nuestra API directamente desde nuestra 
//Variable de Entorno Clase 14
// de esta forma protegemos nuestro codigo de datos que podrian
//ser sensibles.
const API = process.env.API;

const getData = async (id) => {
  const apiURl = id ? `${API}${id}` : API;
  try {
    const response = await fetch(apiURl);
    const data = await response.json();
    return data.results[0];
  } catch (error) {
    console.log('Fetch Error', error);
  };
};

export default getData;