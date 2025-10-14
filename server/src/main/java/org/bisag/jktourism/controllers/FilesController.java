package org.bisag.jktourism.controllers;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

import org.apache.commons.imaging.Imaging;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.bisag.jktourism.crypto.Crypto;
import org.bisag.jktourism.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.coobird.thumbnailator.Thumbnails;

@RestController
@RequestMapping("/files")
public class FilesController {

	@Value("${mediaPath}")
	String fileServerPath;

	@Autowired
	FileService fileService;

	@Autowired
	Crypto crypto;

	@GetMapping("/load-file-by-path")
	public void getPhotoByPath(@RequestParam String path, HttpServletResponse response)
			throws Exception {
		if (StringUtils.isBlank(path)) {
			throw new Exception("Invalid path.");
		}
		String newPath = path.replaceAll("-", "/").replaceAll(" ", "+");
		String decryptedPath;

		try {
			decryptedPath = crypto.decrypt(newPath);
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid encrypted path");
			return;
		}
		if (StringUtils.isBlank(decryptedPath)
				|| !decryptedPath.startsWith(fileServerPath)) {
			throw new Exception("Invalid path.");
		}

		Path filePath = Paths.get(decryptedPath);
		File file = new File(decryptedPath);
		if (!file.exists() || !file.isFile()) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "File not found");
			return;
		}

		// String extension = decryptedPath.substring(decryptedPath.lastIndexOf(".") +
		// 1);
		String contentType = Files.probeContentType(filePath);

		if (contentType == null || !contentType.startsWith("image/")) {
			// Serve non-images normally
			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType(contentType == null ? "application/octet-stream" : contentType);
			// response.setContentLengthLong(file.length());
			try (
					InputStream inputStream = FileUtils.openInputStream(file);
					OutputStream outputStream = response.getOutputStream()) {
				IOUtils.copy(inputStream, outputStream);
				outputStream.flush();
			}
			return;
		}

		try (InputStream inputStream = new FileInputStream(file)) {
			BufferedImage sanitizedImage = Imaging.getBufferedImage(inputStream);

			response.setStatus(HttpServletResponse.SC_OK);
			response.setContentType(contentType); // "image/jpeg", etc.

			// No need to set Content-Length because it's being streamed dynamically

			try (OutputStream outputStream = response.getOutputStream()) {
				String format = contentType.endsWith("png") ? "png" : "jpg";
				ImageIO.write(sanitizedImage, format, outputStream);
				outputStream.flush();
			} catch (Exception e) {
				try (
						// InputStream inputStream = FileUtils.openInputStream(file);
						OutputStream outputStream = response.getOutputStream()) {
					IOUtils.copy(inputStream, outputStream);
					outputStream.flush(); // Ensure complete flush to client
				}
			}
		} catch (Exception e) {
			InputStream inputStream = FileUtils.openInputStream(file);
			OutputStream outputStream = response.getOutputStream();
			IOUtils.copy(inputStream, outputStream);
			outputStream.flush();
			// response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to
			// sanitize image");
		}
	}

	@GetMapping("/load-compress-file-by-path")
	public void getCompressPhotoByPath(@RequestParam String path, HttpServletResponse response)
			throws Exception {
		if (StringUtils.isBlank(path)) {
			throw new Exception("Invalid path.");
		}
		String newPath = path.replaceAll("-", "/").replaceAll(" ", "+");
		String decryptedPath;

		try {
			decryptedPath = crypto.decrypt(newPath);
		} catch (Exception e) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid encrypted path");
			return;
		}
		if (StringUtils.isBlank(decryptedPath)
				|| !decryptedPath.startsWith(fileServerPath)) {
			throw new Exception("Invalid path.");
		}

		File file = new File(decryptedPath);
		if (!file.exists() || !file.isFile()) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND, "File not found");
			return;
		}

		String contentType = Files.probeContentType(file.toPath());
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType(contentType);

		// 🧠 Only compress image types, else serve as-is
		String fileName = file.getName().toLowerCase();
		boolean isImage = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");

		try (
				InputStream inputStream = FileUtils.openInputStream(file);
				OutputStream outputStream = response.getOutputStream()) {
			if (isImage) {
				// 🔥 Compress using Thumbnailator (resize optional, compression via quality)
				Thumbnails.of(inputStream)
						.scale(1.0) // keeps original size
						.outputQuality(0.2f) // adjust for desired compression
						.outputFormat(getExtension(fileName)) // keep original format
						.toOutputStream(outputStream);
			} else {
				// Non-image files: stream normally
				IOUtils.copy(inputStream, outputStream);
			}

			outputStream.flush();
		}
	}

	private String getExtension(String fileName) {
		int dotIndex = fileName.lastIndexOf('.');
		if (dotIndex >= 0 && dotIndex < fileName.length() - 1) {
			return fileName.substring(dotIndex + 1).toLowerCase();
		}
		return "jpg"; // default fallback
	}

	@GetMapping("/get-video")
	public void getVideo(@RequestParam String path, HttpServletResponse response, HttpServletRequest req)
			throws Exception {
		String filename;
		try {
			String newPath = path.replaceAll("-", "/").replaceAll(" ", "+");
			filename = crypto.decrypt(newPath);
			File file = new File(filename);

			if (!file.exists()) {
				response.setHeader("status", "File Not Exist");
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				try (InputStream inputStream = new ByteArrayInputStream(
						"File Not Exist".getBytes(StandardCharsets.UTF_8))) {
					FileCopyUtils.copy(inputStream, response.getOutputStream());
				}
				return;
			}

			String mimeType = Files.probeContentType(file.toPath());
			if (mimeType == null) {
				mimeType = "application/octet-stream";
			}

			long fileLength = file.length();
			String rangeHeader = req.getHeader("Range");
			long start = 0, end = fileLength - 1;

			if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
				// Parse Range header: e.g. "bytes=500-999"
				String[] ranges = rangeHeader.substring(6).split("-");
				try {
					start = Long.parseLong(ranges[0]);
					if (ranges.length > 1) {
						end = Long.parseLong(ranges[1]);
					}
				} catch (NumberFormatException ignored) {
				}
			}

			if (end >= fileLength) {
				end = fileLength - 1;
			}

			long contentLength = end - start + 1;

			// Set response headers
			response.reset();
			response.setBufferSize(1024);
			response.setContentType(mimeType);
			response.setHeader("Content-Disposition", "inline; filename=\"" + file.getName() + "\"");
			response.setHeader("Accept-Ranges", "bytes");
			response.setHeader("Content-Length", String.valueOf(contentLength));
			response.setHeader("Content-Range", "bytes " + start + "-" + end + "/" + fileLength);

			if (rangeHeader != null) {
				response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT); // 206
			} else {
				response.setStatus(HttpServletResponse.SC_OK); // 200
			}

			// Stream the file
			try (RandomAccessFile raf = new RandomAccessFile(file, "r");
					OutputStream out = response.getOutputStream()) {

				raf.seek(start);
				byte[] buffer = new byte[8192];
				long bytesRemaining = contentLength;

				while (bytesRemaining > 0) {
					int bytesRead = raf.read(buffer, 0, (int) Math.min(buffer.length, bytesRemaining));
					if (bytesRead == -1)
						break;
					out.write(buffer, 0, bytesRead);
					bytesRemaining -= bytesRead;
				}
			}
		} catch (Exception e) {
			response.setHeader("status", e.getMessage());
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			try (InputStream inputStream = new ByteArrayInputStream(
					"ERROR AT FILE FETCHING.".getBytes(StandardCharsets.UTF_8))) {
				FileCopyUtils.copy(inputStream, response.getOutputStream());
			}
		}
	}

}
