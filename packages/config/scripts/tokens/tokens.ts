import { getTokenData } from '../../src/tokens/getTokenData'

const SOURCE_FILE_PATH = './src/tokens/tokens.jsonc'
const OUTPUT_FILE_PATH = './src/tokens/generated.json'
const DB_PATH = './build/db.sqlite'

main().catch((e: unknown) => {
  console.error(e)
})

async function main() {
  await getTokenData(SOURCE_FILE_PATH, OUTPUT_FILE_PATH, DB_PATH)
}
