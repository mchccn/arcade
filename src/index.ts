import AeroClient from "@aeroware/aeroclient";

// create a client with default settings and commands
const client = new AeroClient({
    token: "token",
    prefix: "!",
    useDefaults: true,
    logging: true,
});