package com.pxp.SQLite.demo;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.pxp.SQLite.demo.entity")
@EnableJpaRepositories("com.pxp.SQLite.demo.repository")
public class SpringBootAndSqLiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootAndSqLiteApplication.class, args);
        System.out.println("Spring Boot application with SQLite has started successfully...");
    }

    @PostConstruct
    public void init() {
        System.out.println("Performing initial setup or checks for the database...");
        System.out.println("Ensure the Events and Booked tables exist in your SQLite database!");
    }
}