import crypto from 'crypto';

export class Hasher {
  private static readonly encoding: BufferEncoding = 'hex';
  private static readonly algorithm: string = 'aes-256-ctr';
  private static readonly secretKey: string =
    'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
  private static readonly ivString: string = '91ef422bd02e78ec8d359b55667e86c4';
  private static readonly ivBuffer = Buffer.from(
    Hasher.ivString,
    Hasher.encoding
  );
  public static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      Hasher.algorithm,
      Hasher.secretKey,
      Hasher.ivBuffer
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString(Hasher.encoding);
  }
  public static decrypt(hash: string): string {
    const decipher = crypto.createDecipheriv(
      Hasher.algorithm,
      Hasher.secretKey,
      Hasher.ivBuffer
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash, Hasher.encoding)),
      decipher.final()
    ]);
    return decrpyted.toString();
  }
}
