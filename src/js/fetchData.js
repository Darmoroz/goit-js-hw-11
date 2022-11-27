import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

export async function fetchData(name, page) {
  try {
    const res = await axios.get(
      `${BASE_URL}?key=31648636-359962a21bdb0d93d510a7c9e&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
    );
    return res;
  } catch (error) {
    console.log(error.message);
  }
}
export { PER_PAGE };
