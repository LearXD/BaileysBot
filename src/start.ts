import bot from "./bot";

import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(path);


(async () => {
    bot();
})();
