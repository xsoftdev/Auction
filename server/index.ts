import { Nitro } from 'nitropack'
import dbConnect from './utils/db'
import cors from 'cors'

const config = useRuntimeConfig();

export default async (_nitroApp: Nitro) => {
  dbConnect(config.public.dbConnection);
}
