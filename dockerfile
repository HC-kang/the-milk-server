FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bunx prisma generate

CMD ["bun", "run", "dev"]
