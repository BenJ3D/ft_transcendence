FROM node:18

RUN apt-get update && apt-get install apt-file -y && apt-file update
RUN apt-get install vim -y

WORKDIR /usr/src/app/front-end

# COPY --chown=node:node ./front-end/*.json 							./
# COPY --chown=node:node ./front-end/*.js 								./
# COPY --chown=node:node ./front-end/*.ts 								./
COPY --chown=node:node ./front-end/ 										./ 

RUN npm install
RUN npm run build

CMD ["npm", "run", "start"]
