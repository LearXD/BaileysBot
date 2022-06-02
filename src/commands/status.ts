import { IBotProperties } from '../interfaces';
import si from 'systeminformation';
import axios from "axios";

import FastSpeedtest from 'fast-speedtest-api';
import { getPermissionLevel } from "../botManager";

export const desciption = {
    usage: `status`,
    desciption: `Veja as informações sobre o BOT e seu Loader...`
}

export default async ({ reply, userJid }: IBotProperties) => {

    if(getPermissionLevel(userJid) < 2) return reply("Apenas owners podem utilizar este comando!")

    await reply("🕵️‍♂️ Obtendo informações..."); 

    const systemInfo = await si.system();
    const osInfo = await si.osInfo();
    const cpuData = await si.cpu();
    const memory = await si.mem();

    const networkRes = (await axios.get('http://ip-api.com/json/')).data

    let networkMessage = "";
    if (networkRes.status === "success") {
        const { country, regionName, city, org } = networkRes;
        networkMessage = 
`*País*: ${country}
*Estado*: ${regionName}
*Cidade*: ${city}
*Provedora*: ${org}
`;
    }

    let speedtest = new FastSpeedtest({
        token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
        verbose: false, 
        timeout: 10000, 
        https: true,
        urlCount: 5, 
        bufferSize: 8, 
        unit: FastSpeedtest.UNITS.Mbps 
    });
     
    const networkSpeed = await speedtest.getSpeed();

    await reply(
`🛠 *INFORMAÇÕES TÉCNICAS 🛠*

*Identificador:* ${systemInfo.manufacturer} ${systemInfo.model}

*Sistema Operacional:* ${osInfo.platform}
*Nome do Sistema:* ${osInfo.distro}
*Versão:* ${osInfo.release}
*Arquitetura:* ${osInfo.arch}

*CPU:* ${cpuData.manufacturer} ${cpuData.brand} 
*Memória:* ${Math.round(((memory.total/1024)/1024)/1024)} GB
*Memória Disponível:* ${Math.round(((memory.free/1024)/1024)/1024)} GB

🌐 *INFORMAÇÕES DE REDE* 🌐 

${networkMessage}*Internet Speed*: ${Math.round(networkSpeed)} Mbps

`)

}