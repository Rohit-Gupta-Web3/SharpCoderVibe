import crypto from 'crypto'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(buffer: Buffer): string {
  let bits = 0
  let value = 0
  let output = ''
  for (const byte of buffer) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31]
  }
  return output
}

function base32Decode(str: string): Buffer {
  let bits = 0
  let value = 0
  const output: number[] = []
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, '')
  for (const char of clean) {
    const idx = ALPHABET.indexOf(char)
    if (idx === -1) continue
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff)
      bits -= 8
    }
  }
  return Buffer.from(output)
}

export function generateSecret(length = 20): string {
  return base32Encode(crypto.randomBytes(length))
}

export function generateToken(secret: string, timestamp = Date.now()): string {
  const step = 30
  const counter = Math.floor(timestamp / 1000 / step)
  const key = base32Decode(secret)
  const buffer = Buffer.alloc(8)
  buffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  buffer.writeUInt32BE(counter & 0xffffffff, 4)
  const hmac = crypto.createHmac('sha1', key).update(buffer).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1e6
  return code.toString().padStart(6, '0')
}

export function keyuri(email: string, issuer: string, secret: string): string {
  const label = encodeURIComponent(`${issuer}:${email}`)
  const issuerEnc = encodeURIComponent(issuer)
  return `otpauth://totp/${label}?secret=${secret}&issuer=${issuerEnc}&algorithm=SHA1&digits=6&period=30`
}

export function verify(token: string, secret: string, window = 1): boolean {
  for (let w = -window; w <= window; w++) {
    const timestamp = Date.now() + w * 30_000
    if (generateToken(secret, timestamp) === token) return true
  }
  return false
}

