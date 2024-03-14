// PhishingTank is a free online service
// provided to researchers and the public
// to submit and analyze phishing reports.

import got from "got";

import {decompressSync, strFromU8} from "fflate";

import {getMust} from "../config.mjs";

const phishingtankApiKey = getMust("PHISHINGTANK_API_KEY");
const phishingtankUsername = getMust("PHISHINGTANK_USERNAME");

const downloadUrl = `https://data.phishtank.com/data/${phishingtankApiKey}/online-valid.json.gz`;
const userAgent = `phishtank/${phishingtankUsername}`;

export let phishingArchived;
export const phishingDatabase = {};

/**
 *  Downloads the phishing database from the phishingtank.com website.
 * @return  {Promise<Object>} A promise that resolves to  the phishing database.
 */
export async function downloadDatabase() {
    phishingArchived = await got.get(downloadUrl, {
        headers: {
            userAgent,
        },
    }).buffer();

    const jsonBinary = decompressSync(phishingArchived);
    const jsonText = strFromU8(jsonBinary);
    const jsonData = JSON.parse(jsonText);

    return Object.fromEntries(jsonData.map(
        (i) => [i.phish_id, i],
    ));
}

/**
  * Loads the phishing  database into memory.
 */
export async function loadDatabase() {
    const database = await downloadDatabase();
    Object.assign(phishingDatabase, database);
}
