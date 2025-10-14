package org.bisag.jktourism;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class JKTourismApp extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(JKTourismApp.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		System.out.println("[STARTED] JKTourism Server is running");
	}

}
