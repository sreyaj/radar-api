# DOCKER-VERSION 1.1.2
FROM shipimg/appbase:latest

# Bundle app source
ADD . /src
# Install app dependencies
RUN cd /src; npm install

CMD ["nodejs", "/src/api.app.js"]
EXPOSE 3001