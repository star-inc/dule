// node-schedule is a flexible cron-like and not-cron-like job scheduler.

// Import modules
import schedule from "node-schedule";

/**
 * Starts the schedule tasks.
 * @param {object[]} tasks the tasks to load
 */
export async function startScheduleTasks(tasks) {
    const createMethod = (name, options) => () => {
        const methodDirectory = new URL("../tasks/", import.meta.url);
        const methodFilename = new URL(`${name}.mjs`, methodDirectory);
        import(methodFilename).then((f) => f.default(options));
    };
    for (const {name, options} of tasks) {
        const method = createMethod(name, options);
        schedule.scheduleJob(options.time, method);
    }
}
