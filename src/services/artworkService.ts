import axios from 'axios';

export const fetchArtworks = async (page: number) => {
    const baseUrl = 'https://api.artic.edu/api/v1/artworks';
    const response = await axios.get(`${baseUrl}?page=${page}`);
    return response;
};
