// node-schedule is a flexible cron-like and not-cron-like job scheduler.

// Import modules
import schedule from "node-schedule";

/**
 * Starts the schedule tasks.
 * @param {object[]} tasks the tasks to load
 */
export async function startScheduleTasks(tasks) {
    for (const {name: methodName, config: methodConfig} of tasks) {
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
