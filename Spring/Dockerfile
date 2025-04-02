# Use official Maven image with JDK
FROM maven:3.8.6-openjdk-11

WORKDIR /app

# Copy only the POM file first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy all source files
COPY src ./src

# Create directory for database
RUN mkdir -p /app/backend

# Environment variables to override application.properties
ENV SPRING_DATASOURCE_URL=jdbc:sqlite:/app/backend/EventManagement.db
ENV SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.sqlite.JDBC
ENV SPRING_JPA_DATABASE_PLATFORM=com.pxp.SQLite.demo.dialect.SQLiteDialect
ENV SPRING_JPA_HIBERNATE_DDL_AUTO=update

# Expose Spring Boot port
EXPOSE 8080

# Run with Maven (keeps container alive)
CMD ["mvn", "spring-boot:run"]