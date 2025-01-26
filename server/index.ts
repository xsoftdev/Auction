import {Nitro} from 'nitropack'
import dbConnect from './utils/db'

const config = useRuntimeConfig();

export default async (_nitroApp: Nitro) => {
    dbConnect(config.public.dbConnection);
}