import AeroClient from "@aeroware/aeroclient";
import { config } from "dotenv";
config({ path: "src/.env" })

const client = new AeroClient({
    token: process.env.TOKEN,
    prefix: "!",
    useDefaults: true,
    logging: true,
});