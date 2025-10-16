package org.bisag.jktourism;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootApplication
public class JKTourismApp extends SpringBootServletInitializer {

	private final RedisConnectionFactory redisConnectionFactory;

	JKTourismApp(RedisConnectionFactory redisConnectionFactory) {
		this.redisConnectionFactory = redisConnectionFactory;
	}

	public static void main(String[] args) {
		SpringApplication.run(JKTourismApp.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		System.out.println("[STARTED] JKTourism Server is running");
		try {
			String ping = redisConnectionFactory.getConnection().ping();
			if ("PONG".equalsIgnoreCase(ping)) {
				System.out.println("[STARTED] Redis Server is running.");
			} else {
				System.out.println("[UNEXPECTED] Redis Server is having unexpected ping response");
			}
		} catch (Exception e) {
			System.out.println("[NOT STARTED] Redis Server is not running.");
		}
	}

}
