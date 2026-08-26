# Stage 1: Build the frontend (Next.js static export)
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# We need to build the export. The next.config.ts has output: 'export'
RUN npm run build

# Stage 2: Build the backend (.NET)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /App
COPY backend/ ./
RUN dotnet restore
RUN dotnet publish -c Release -o out
# Now copy the frontend export to the backend's wwwroot
COPY --from=frontend-build /app/out ./out/wwwroot

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /App
COPY --from=backend-build /App/out .

# Switch to root to ensure we can write to the SQLite database
USER root

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "backend.dll"]
