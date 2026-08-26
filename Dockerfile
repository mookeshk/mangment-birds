FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
WORKDIR /App
COPY backend/ ./
RUN dotnet restore
RUN dotnet publish -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /App
COPY --from=backend-build /App/out .

# Switch to root to ensure we can write to the SQLite database
USER root

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "backend.dll"]
