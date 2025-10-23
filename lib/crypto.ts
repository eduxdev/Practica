import crypto from 'crypto'
import forge from 'node-forge'

// Generar par de claves RSA
export function generateRSAKeyPair() {
  try {
    const keyPair = forge.pki.rsa.generateKeyPair(2048)
    return {
      publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
      privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
    }
  } catch (error) {
    console.error('Error generando claves RSA:', error)
    throw new Error(`Error al generar claves RSA: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Cifrado AES-256-GCM
export function encryptAES(data: string, password: string) {
  const algorithm = 'aes-256-gcm'
  const key = crypto.scryptSync(password, 'salt', 32)
  const iv = crypto.randomBytes(16)
  
  const cipher = crypto.createCipher(algorithm, key)
  cipher.setAAD(Buffer.from('AgroIA-PDF-Signature', 'utf8'))
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

// Descifrado AES-256-GCM
export function decryptAES(encryptedData: any, password: string) {
  const algorithm = 'aes-256-gcm'
  const key = crypto.scryptSync(password, 'salt', 32)
  
  const decipher = crypto.createDecipher(algorithm, key)
  decipher.setAAD(Buffer.from('AgroIA-PDF-Signature', 'utf8'))
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// Calcular hash SHA-256
export function calculateSHA256(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

// Firmar con RSA
export function signWithRSA(data: string, privateKeyPem: string): string {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
    const md = forge.md.sha256.create()
    md.update(data, 'utf8')
    
    const signature = privateKey.sign(md)
    return forge.util.encode64(signature)
  } catch (error) {
    console.error('Error firmando con RSA:', error)
    throw new Error(`Error al firmar con RSA: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

// Verificar firma RSA
export function verifyRSASignature(data: string, signature: string, publicKeyPem: string): boolean {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem)
    const md = forge.md.sha256.create()
    md.update(data, 'utf8')
    
    const decodedSignature = forge.util.decode64(signature)
    return publicKey.verify(md.digest().bytes(), decodedSignature)
  } catch (error) {
    console.error('Error verificando firma:', error)
    return false
  }
}

// Generar certificado digital simple
export function generateCertificate(commonName: string, keyPair: any) {
  const cert = forge.pki.createCertificate()
  
  cert.publicKey = keyPair.publicKey
  cert.serialNumber = '01'
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
  
  const attrs = [{
    name: 'commonName',
    value: commonName
  }, {
    name: 'countryName',
    value: 'ES'
  }, {
    shortName: 'ST',
    value: 'España'
  }, {
    name: 'localityName',
    value: 'Madrid'
  }, {
    name: 'organizationName',
    value: 'AgroIA'
  }, {
    shortName: 'OU',
    value: 'Firma Digital'
  }]
  
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  
  // Auto-firmar el certificado
  cert.sign(keyPair.privateKey)
  
  return {
    cert: forge.pki.certificateToPem(cert),
    publicKey: forge.pki.publicKeyToPem(keyPair.publicKey),
    privateKey: forge.pki.privateKeyToPem(keyPair.privateKey)
  }
}
