[![Deploy to Firebase Cloud Functions](https://github.com/mgl/AREA-server/actions/workflows/main.yml/badge.svg)](https://github.com/mgl/AREA-server/actions/workflows/main.yml)

# AREA-server

Application server backend of the AREA
While it's supposed to run with Docker compose, it can be manually started for development.

    $ docker build . -t area-client
    $ docker run -p 8080:3000 area-client
