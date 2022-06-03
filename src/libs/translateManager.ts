import Translate from '@google-cloud/translate';
import path from 'path'
import { readJSON } from '../botManager';

export const translate = async (text: string, targetLanguage: string): Promise<string> => {

    const CREDENTIALS = readJSON(path.join(__dirname, '..', '..', 'settings', 'cloud_google_auth_file.json'));

    const translate = new Translate.v2.Translate({
        credentials: CREDENTIALS,
        projectId: CREDENTIALS.project_id
    });

    try {
        let [response] = await translate.translate(text, targetLanguage);
        return response;
    } catch (error) {
        return "Erro ao traduzir!"
    }
};