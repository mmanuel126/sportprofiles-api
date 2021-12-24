# Get base SDK Image from Microsoft
FROM mcr.microsoft.com/dotnet/core/sdk:22.2 AS build-env
WORKDIR /app

#Copy the CSPROJ file restore any dependencies (via NUGET)
COPY *.csproj ./
RUN dotnet restore

# Copy the project files and buld our relaease
COPY . ./
RUN dotnet publish -c Release -o out

#Generate runtime image
FROM mcr.microsoft.com/dotnet/comre/aspnet:2:2
WORKDIR /app
EXPOSE 80
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "ESapi.dll"]