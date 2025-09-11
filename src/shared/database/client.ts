import {Pool} from "pg";
import dotenv from "dotenv";
import { config } from "./config";

dotenv.config();

const dbConfig = config.db;
const pool = new Pool(dbConfig);

pool
    .connect()
    .then(() => console.log("Connected to database"))
    .catch((err: any) => console.error("Error connecting to database", err));

export default pool;