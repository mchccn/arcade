import AeroClient from "@aeroware/aeroclient";
import "dotenv/config";

const client = new AeroClient({
    token: process.env.TOKEN,
    prefix: "/",
    logging: true,
    loggerHeader: "arcade",
    commandsPath: "commands",
    eventsPath: "events",
    connectionUri: process.env.MONGODB_URI,
    useDefaults: true,
    persistentCooldowns: true,
    disableStaffCooldowns: true,
    staff: process.env.STAFF_IDS?.split(/,\s*/g),
    dev:
        process.env.NODE_ENV === "development"
            ? {
                  eval: {
                      console: true,
                      command: true,
                  },
              }
            : undefined,
});
