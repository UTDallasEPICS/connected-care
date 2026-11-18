# Build container
FROM node:lts-alpine AS builder

# Use Workdir because things like tailwind will scan the entire current dir and can cause issues if it scans root
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

ENV PNPM_HOME="~/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm

RUN pnpm i --frozen-lockfile

COPY . ./
RUN pnpm prisma generate
RUN pnpm run build
# libsql picks its native binary with a runtime require(`@libsql/${target}`) that
# Nitro's tracer misses on musl, so copy the platform package into the output.
RUN cp -rL node_modules/.pnpm/node_modules/@libsql/linux-*-musl .output/server/node_modules/@libsql/


# Deployment container
FROM node:lts-alpine AS deployment
WORKDIR /app
COPY --from=builder /app/.output ./
EXPOSE 3000
CMD ["node", "./server/index.mjs"]
