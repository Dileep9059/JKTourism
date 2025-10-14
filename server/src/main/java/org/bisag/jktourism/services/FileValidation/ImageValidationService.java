package org.bisag.jktourism.services.FileValidation;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.Socket;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ImageValidationService {

    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_MIME_TYPES = List.of("image/jpeg", "image/png");
    private static final List<String> ALLOWED_EXTENSIONS = List.of("jpg", "jpeg", "png");

    public void validateImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided.");
        }

        // File size check
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 2MB.");
        }

        // MIME type check
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }

        // Extension check
        String originalFilename = Paths.get(file.getOriginalFilename()).getFileName().toString();
        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("Invalid file extension.");
        }

        // Magic number check
        if (!isValidImageMagicNumber(file)) {
            throw new IllegalArgumentException("Invalid image header — file may be corrupted or spoofed.");
        }

        // Optional: virus scanning via ClamAV
        // if (!scanForViruses(file)) {
        //     throw new IllegalArgumentException("File failed virus scan.");
        // }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex >= 0) ? filename.substring(dotIndex + 1).toLowerCase() : "";
    }

    private boolean isValidImageMagicNumber(MultipartFile file) throws IOException {
        try (InputStream input = file.getInputStream()) {
            byte[] header = new byte[12];
            if (input.read(header) < 12)
                return false;

            // JPEG: FF D8 FF
            if (header[0] == (byte) 0xFF && header[1] == (byte) 0xD8 && header[2] == (byte) 0xFF)
                return true;

            // PNG: 89 50 4E 47 0D 0A 1A 0A
            if (header[0] == (byte) 0x89 && header[1] == 0x50 && header[2] == 0x4E)
                return true;

            // WebP: "RIFF....WEBP"
            if (header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[8] == 'W' && header[9] == 'E')
                return true;

            return false;
        }
    }

    // Optional virus scan using ClamAV via TCP socket
    private boolean scanForViruses(MultipartFile file) {
        try (Socket socket = new Socket("localhost", 3310);
                InputStream fileStream = file.getInputStream();
                BufferedOutputStream out = new BufferedOutputStream(socket.getOutputStream());
                BufferedInputStream in = new BufferedInputStream(socket.getInputStream())) {

            out.write("nINSTREAM\n".getBytes());
            out.flush();

            byte[] buffer = new byte[2048];
            int bytesRead;
            while ((bytesRead = fileStream.read(buffer)) >= 0) {
                out.write((byte) ((bytesRead >> 24) & 0xFF));
                out.write((byte) ((bytesRead >> 16) & 0xFF));
                out.write((byte) ((bytesRead >> 8) & 0xFF));
                out.write((byte) (bytesRead & 0xFF));
                out.write(buffer, 0, bytesRead);
            }

            out.write(new byte[] { 0, 0, 0, 0 }); // End of stream
            out.flush();

            ByteArrayOutputStream response = new ByteArrayOutputStream();
            int c;
            while ((c = in.read()) != -1) {
                response.write(c);
                if (c == '\n')
                    break;
            }

            String result = response.toString();
            return result.contains("OK");
        } catch (IOException e) {
            throw new RuntimeException("Virus scan failed: " + e.getMessage(), e);
        }
    }
}