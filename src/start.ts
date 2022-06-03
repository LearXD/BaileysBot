import bot from "./bot";
import { translate  } from './libs/translateManager';

import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(path);


(async () => {
    bot();
})();
