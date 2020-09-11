package org.zuppy.secure;

import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/* Zuppy Secure Algorithm
 * Version 1.0
 * Platform: Java Implementation
 * For data Hashing, encryption, decryption and signature verification
 * No! more stress coding easy to use and time saving.
 * Developed by Abel Akponine
 * Github: https://github.com/abelakponine
 * Instagram: Kingabel.a
 */
public class ZuppySecure {
	// For security purpose, remember to change this default final 'key' value before deployment, it was initially generated using SHA256 but any algorithm is acceptable
	// The key should be stored privately and remebered at all time, Otherwise all enrypted data will be lost.
	private final String key = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
	private static IvParameterSpec iv;
	private static SecretKeySpec secretKey;
	private static String salt = "signed";
	private StringBuilder digest;
	private KeyPair keyPair;
	private String publicKey;
	private Signature sign = Signature.getInstance("SHA256withRSA");
	/*Constructor: It generates a new key pair and resets the system when called*/
	public ZuppySecure() throws NoSuchAlgorithmException {
		iv = null;
		secretKey = null;
		digest = new StringBuilder();
		this.generateKeyPair();
	}
	/*Key Pair Generator*/
	public KeyPair generateKeyPair() throws NoSuchAlgorithmException {
		KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
		keyGen.initialize(2048);
		keyPair = keyGen.generateKeyPair();
		publicKey = new String(Base64.getEncoder().encode(this.getKeyPair().getPublic().getEncoded()));
		return keyPair;
	}
	/*Hashing Algorithm*/
	public String hash(String algo, String data) throws NoSuchAlgorithmException {
		byte[] bytes = this.digest(algo,data);
		int i;
		for (i=0;i<bytes.length;i++){
			digest.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
		}
		return digest.toString();
	}
	/*String Data Encryption using SHA-256 and AES-CBC*/
	public String encrypt(String data, String salt) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		byte[] bytes = ((String) data).getBytes();
		secretKey = new SecretKeySpec(this.digest("SHA-256",this.key+salt),"AES");
		iv = new IvParameterSpec(Arrays.copyOf(salt.getBytes(), 16));
		// Cipher
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
		String enc = Base64.getEncoder().encodeToString(cipher.doFinal(bytes));
		return enc;
	}
	/*Byte Data Encryption using SHA-256 and AES-CBC*/
	public String encrypt(byte[] data, String salt) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		byte[] bytes = data;
		secretKey = new SecretKeySpec(this.digest("SHA-256",this.key+salt),"AES");
		iv = new IvParameterSpec(Arrays.copyOf(salt.getBytes(), 16));
		// Cipher
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
		String enc = Base64.getEncoder().encodeToString(cipher.doFinal(bytes));
		return enc;
	}
	/*String Data decryption*/
	public String decrypt(String data, String salt) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		secretKey = new SecretKeySpec(this.digest("SHA-256",this.key+salt),"AES");
		iv = new IvParameterSpec(Arrays.copyOf(salt.getBytes(), 16));
		// Decipher
		Cipher decipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		decipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
		String dec = new String(decipher.doFinal(Base64.getDecoder().decode(data)));
		return dec;
	}
	/* Decrypt data to String (@param boolean true) or Byte (@param boolean false)*/
	public Object decrypt(String data, String salt, boolean convertToString) throws NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
		secretKey = new SecretKeySpec(this.digest("SHA-256",this.key+salt),"AES");
		iv = new IvParameterSpec(Arrays.copyOf(salt.getBytes(), 16));
		// Decipher
		Cipher decipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		decipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
		Object dec;
		if (convertToString) {
			dec = new String(decipher.doFinal(Base64.getDecoder().decode(data)));
		}
		else {
			dec = decipher.doFinal(Base64.getDecoder().decode(data));
		}
		return dec;
	}
	/*Message Digest*/
	public byte[] digest(String algo, String data) throws NoSuchAlgorithmException {
		MessageDigest mdigest = MessageDigest.getInstance(algo);
		byte[] bytes = mdigest.digest(data.getBytes());
		bytes = Arrays.copyOf(bytes, bytes.length);
		return bytes;
	}
	/*Key Signing: please note that by using ZuppySecure signing, the signature return type is converted from byte[] into String by encrypting it.*/
	public String sign(String data, PrivateKey privateKey) throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException, SignatureException {
		byte[] bytes = data.getBytes();
		sign.initSign(privateKey);
		sign.update(bytes);
		byte[] signed = sign.sign();
		// encrypt signature
		String encrypted = this.encrypt(signed, salt);
		return encrypted;
	}
	/*Verify Key*/
	public boolean verify(String data, String signature, PublicKey publicKey) throws SignatureException, InvalidKeyException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidAlgorithmParameterException {
		byte[] dataBytes = data.getBytes();
		// decrypt signature
		byte[] bytes = (byte[]) this.decrypt(signature, salt, false);
		// start verification
		sign.initVerify(publicKey);
		sign.update(dataBytes);
		boolean verification = sign.verify(bytes);
		return verification;
	}
	/*Get Public Key*/
	public String getPublicKey() {
		return this.publicKey;
	}
	/*Get KeyPair*/
	public KeyPair getKeyPair() {
		return this.keyPair;
	}
}