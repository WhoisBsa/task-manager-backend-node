#-------------------------------------------
# Name the first stage "base" to reference later
FROM node:19.6-bullseye-slim AS base
#-------------------------------------------
WORKDIR /usr/src/app
COPY package*.json ./
#-------------------------------------------
# Use the base stage to create dev image
FROM base AS dev
#-------------------------------------------
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install
COPY . .
CMD ["npm", "start"]
#-------------------------------------------
# Use the base stage to create separate production image
FROM base AS production
#-------------------------------------------
ENV NODE_ENV production
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install --only=production
USER node
COPY --chown=node:node ./src/ .
EXPOSE 3000
CMD [ "node", "server.js" ]