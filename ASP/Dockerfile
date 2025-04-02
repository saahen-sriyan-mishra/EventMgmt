# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY ASP/ASP.csproj .
RUN dotnet restore

# Copy remaining source files
COPY ASP/ .

# Build and publish
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Create data directory for SQLite
RUN mkdir -p /app/data

# Copy published application
COPY --from=build /app/publish .

EXPOSE 5274 
ENTRYPOINT ["dotnet", "ASP.dll"]