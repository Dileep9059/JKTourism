package org.bisag.jktourism;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootApplication
public class JKTourismApp extends SpringBootServletInitializer {

	@Autowired
	RedisConnectionFactory redisConnectionFactory;

	// ANSI Colors
	private static final String RESET = "\u001B[0m";
	private static final String GREEN = "\u001B[32m";
	private static final String RED = "\u001B[31m";
	private static final String YELLOW = "\u001B[33m";
	private static final String BLUE = "\u001B[34m";
	private static final String MAGENTA = "\u001B[35m";

	public static void main(String[] args) {
		SpringApplication.run(JKTourismApp.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		System.out.println(GREEN + "[STARTED] JKTourism Server is running" + RESET);
		try {
			String ping = redisConnectionFactory.getConnection().ping();
			if ("PONG".equalsIgnoreCase(ping)) {
				System.out.println(GREEN + "[STARTED] Redis Server is running." + RESET);
			} else {
				System.out.println(YELLOW + "[UNEXPECTED] Redis Server is having unexpected ping response" + RESET);
			}
		} catch (Exception e) {
			System.out.println(RED + "[NOT STARTED] Redis Server is not running." + RESET);
		}
	}

}
