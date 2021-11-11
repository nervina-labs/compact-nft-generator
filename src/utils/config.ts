import dotenv from 'dotenv'
dotenv.config()
const CLASS_PRIVATE_KEY =
  process.env.CLASS_PRIVATE_KEY || '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const SENDER_ADDRESS =
  process.env.RECEIVER_ADDRESS || 'ckteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const RECEIVER_ADDRESS =
  process.env.RECEIVER_ADDRESS || 'ckteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const CKB_NODE_RPC = process.env.CKB_NODE_RPC || 'http://localhost:8114'
const CKB_NODE_INDEXER = process.env.CKB_NODE_INDEXER || 'http://localhost:8116'

export { CLASS_PRIVATE_KEY, CKB_NODE_RPC, CKB_NODE_INDEXER, SENDER_ADDRESS, RECEIVER_ADDRESS }
