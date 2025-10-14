package org.bisag.jktourism.services;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    @Value("${spring.profiles.active}")
    private String activeProfile;

    public InputStream downloadFile(String fileName) throws IOException {
        return FileUtils.openInputStream(new File(fileName));
    }

    public boolean uploadFile(String fileDir, String filename, MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                String name = file.getOriginalFilename();

                if (name != "") {
                    byte[] bytes = file.getBytes();
                    File dir = new File(fileDir);

                    if (!dir.exists())
                        dir.mkdirs();

                    File serverFile = new File(fileDir + File.separator + filename);

                    BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
                    stream.write(bytes);
                    stream.close();
                }
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

}
