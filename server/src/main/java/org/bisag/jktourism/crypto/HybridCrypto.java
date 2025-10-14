package org.bisag.jktourism.crypto;

import java.nio.charset.StandardCharsets;
import java.security.*;
import javax.crypto.*;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.interfaces.RSAPrivateKey;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

@Component
public class HybridCrypto {

    private static final String CIPHER_ALGORITHM = "AES/GCM/NoPadding";
    private static final String SECRET_KEY_ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final String KEY_FOR_ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    private static final int ITERATIONS = 179;
    private final int IV_SIZE = 128;
    private static final String SECRET_KEY = "@#ZBJ$u%1M+3o[v0c*HD!>dQE}9:1A?";
    private static final String RSA_ALGORITHM = "RSA";

    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;

    public HybridCrypto() {
        try {
            generateRSAKeyPair(); // Generate RSA keys on initialization
        } catch (Exception ex) {
            System.err.println("--- Error generating RSA keys ---");
            ex.printStackTrace();
            System.err.println("--- x ---");
        }
    }

    // Generate RSA key pair (public and private)
    private void generateRSAKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyPairGenerator.initialize(2048);  // 2048-bit key size
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        publicKey = (RSAPublicKey) keyPair.getPublic();
        privateKey = (RSAPrivateKey) keyPair.getPrivate();
    }

    // Method to encrypt with RSA (hybrid encryption)
    public String encrypt(String plainText)
            throws Exception {
        byte[] saltBytes = generateRandom(16);
        byte[] ivBytes = generateRandom(16);
        SecretKey secretKey = makeAesKey(saltBytes, SECRET_KEY);
        
        // Encrypt the data with AES
        Cipher aesCipher = Cipher.getInstance(CIPHER_ALGORITHM);
        aesCipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(IV_SIZE, ivBytes));
        byte[] encryptedBytes = aesCipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
        
        // Encrypt the AES key with RSA
        byte[] encryptedAesKey = encryptWithRSA(secretKey.getEncoded());

        // Combine encrypted AES key, salt, IV, and encrypted data
        byte[] cipherBytes = new byte[encryptedAesKey.length + saltBytes.length + ivBytes.length + encryptedBytes.length];
        System.arraycopy(encryptedAesKey, 0, cipherBytes, 0, encryptedAesKey.length);
        System.arraycopy(saltBytes, 0, cipherBytes, encryptedAesKey.length, saltBytes.length);
        System.arraycopy(ivBytes, 0, cipherBytes, encryptedAesKey.length + saltBytes.length, ivBytes.length);
        System.arraycopy(encryptedBytes, 0, cipherBytes, encryptedAesKey.length + saltBytes.length + ivBytes.length, encryptedBytes.length);
        
        return toBase64(cipherBytes);
    }
    // Method to decrypt with RSA (hybrid decryption)
    public String decrypt(String cipherText)
            throws Exception {
        byte[] cipherBytes = fromBase64(cipherText);

        // Extract parts from the cipher text
        byte[] encryptedAesKey = Arrays.copyOfRange(cipherBytes, 0, 256);  // RSA size for AES key (2048 bit RSA key can encrypt 256 bytes of AES key)
        byte[] saltBytes = Arrays.copyOfRange(cipherBytes, 256, 272);
        byte[] ivBytes = Arrays.copyOfRange(cipherBytes, 272, 288);
        byte[] encryptedBytes = Arrays.copyOfRange(cipherBytes, 288, cipherBytes.length);

        // Decrypt the AES key with RSA
        byte[] aesKeyBytes = decryptWithRSA(encryptedAesKey);
        SecretKey secretKey = new SecretKeySpec(aesKeyBytes, "AES");

        // Decrypt the data with AES
        Cipher aesCipher = Cipher.getInstance(CIPHER_ALGORITHM);
        aesCipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(IV_SIZE, ivBytes));
        byte[] decryptedBytes = aesCipher.doFinal(encryptedBytes);
        
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    // Encrypt the AES key using RSA public key
    private byte[] encryptWithRSA(byte[] aesKey) throws Exception {
        Cipher rsaCipher = Cipher.getInstance(RSA_ALGORITHM);
        rsaCipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return rsaCipher.doFinal(aesKey);
    }

    // Decrypt the AES key using RSA private key
    private byte[] decryptWithRSA(byte[] encryptedAesKey) throws Exception {
        Cipher rsaCipher = Cipher.getInstance(RSA_ALGORITHM);
        rsaCipher.init(Cipher.DECRYPT_MODE, privateKey);
        return rsaCipher.doFinal(encryptedAesKey);
    }

    private static byte[] fromBase64(String str) {
        return Base64.getDecoder().decode(str);
    }

    private static String toBase64(byte[] ba) {
        return Base64.getEncoder().encodeToString(ba);
    }

    private static byte[] generateRandom(int length) {
        SecureRandom random = new SecureRandom();
        byte[] randomBytes = new byte[length];
        random.nextBytes(randomBytes);
        return randomBytes;
    }

    private SecretKey makeAesKey(byte[] salt, String password)
            throws InvalidKeySpecException, NoSuchAlgorithmException {
        SecretKeyFactory secretKeyFactory =
                SecretKeyFactory.getInstance(SECRET_KEY_ALGORITHM);
        KeySpec keySpec = new PBEKeySpec(password.toCharArray(), salt,
                ITERATIONS, KEY_SIZE);
        return new SecretKeySpec(secretKeyFactory.generateSecret(keySpec).getEncoded(),
                KEY_FOR_ALGORITHM);
    }
}
