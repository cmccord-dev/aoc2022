import fs from 'fs';
import fsp from 'fs/promises';
import https from 'https'
let session = fs.readFileSync("session.txt");
if (!fs.existsSync('input/')) fs.mkdirSync('input/');
export const fetchInput = async (day: number) => {
    fsp.stat
    if (fs.existsSync(`input/${day}.in`)) {
        return await fsp.readFile(`input/${day}.in`, 'utf-8');
    }
    return new Promise((reject, resolve) => {
        console.log(`Fetching ${day} from server..`);
        https.get(`https://adventofcode.com/2022/day/${day}/input`, {
            headers: {
                cookie: `session=${session}`
            }
        }, (result) => {
            let all = '';
            result.on('data', (dat) => {
                all += dat;
            });
            result.on("end", () => {
                fs.writeFileSync(`input/${day}.in`, all);
                resolve(all);
            })
            result.on('error', () => {
                reject(result.statusMessage);
            })
        })
    });
}