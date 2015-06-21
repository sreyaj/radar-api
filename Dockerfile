# DOCKER-VERSION 1.1.2
FROM shipimg/appbase:latest

# Bundle app source
ADD . /src
# Install app dependencies
RUN cd /src; npm install

CMD ["nodejs", "/src/bin/www"]
EXPOSE 3001