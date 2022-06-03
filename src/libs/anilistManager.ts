/*
 * MANAGER FEITO PARA FACILITAR AS CONSULTAS
 * CASO QUEIRA ADICIONAR ALGO, POR FAVOR, LEIA
 * A DOCUMENTAÇÃO DA API:
 * 
 * DOC: https://anilist.gitbook.io/anilist-apiv2-docs/
 * GraphQL: https://anilist.github.io/ApiV2-GraphQL-Docs/
 * 
 * Thanks for Anilist :D
*/

import axios from 'axios';

export const query = async (
    field: string | number,
    searchType: 'Media' | 'Page' | 'Character', 
    type?: 'ANIME' | 'MANGA',
    searchMethod?: "search" | "genre" | "id"
    ) => {

    try {
        const res = (await axios.post('https://graphql.anilist.co',
        {
          "query": `
          query ($field: ${fieldTypes[searchMethod]}) { 
              ${searchType} (${searchMethod}: $field${searchType === 'Media' ? `, type: ${type}` : ''}) { 
                  ${body[searchType] ?? ''}
              } 
          }
          `, "variables": { "field": field }
        },
        { headers: { "Content-Type": "application/json", "Accept": "application/json" } })).data

        switch (searchType) {
            case 'Media':
            case 'Character':
                return res.data[searchType]
            case 'Page':
                return res;
        }
    } catch (error) {
      throw error.request.data;
    }
}


const fieldTypes = {
    'search': 'String',
    'genre': 'String',
    'id': 'Int'
}

const body = {
  'Media': 'id title { romaji native } description startDate { day month year } endDate { day month year } episodes chapters volumes coverImage { large medium } genres averageScore',
  'Character': 'id name { full native } image { large, medium } description gender dateOfBirth { day month year } age'
}