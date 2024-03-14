// node-schedule is a flexible cron-like and not-cron-like job scheduler.

// Import modules
import {
    existsSync,
    readFileSync,
} from "node:fs";

import {
    parse as parseTOML,
} from "toml";

import schedule from "node-schedule";

export const scheduleMap = {};

/**
 * Reads the schedule.toml file and returns a parsed map of the contents.
 */
export async function readScheduleMap() {
    const mapFilename = new URL("../../schedule.toml", import.meta.url);
    if (!existsSync(mapFilename)) {
        throw Error("schedule.toml not exists");
    }

    const mapFileContent = readFileSync(mapFilename, "utf-8");
    if (!mapFileContent) {
        throw Error("schedule.toml is invalid");
    }

    const srcMap = parseTOML(mapFileContent);
    Object.assign(scheduleMap, srcMap);
}

/**
 * Starts the schedule tasks.
 */
export async function startScheduleTasks() {
    for (const [methodName, methodConfig] of Object.entries(scheduleMap)) {
        const methodDirectory = new URL("../tasks/", import.meta.url);
        const methodFilename = new URL(`${methodName}.mjs`, methodDirectory);

        const createMethod = (options) => () => {
            import(methodFilename).then((f) => f.default(options));
        };
        for (const config of methodConfig) {
            const method = createMethod(config);
            schedule.scheduleJob(config.time, method);
        }
    }
}
