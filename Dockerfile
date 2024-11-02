
# Build stage
FROM node:16-alpine AS build

# 필수 패키지 설치 (curl, bash)
RUN apk add --no-cache curl bash

# Bun 설치
RUN curl -fsSL https://bun.sh/install | bash

# Bun 설치 후 환경 변수 설정 (기본 설치 경로가 /root/.bun)
ENV PATH="/root/.bun/bin:$PATH"

WORKDIR /code

COPY package*.json ./
RUN bun install

COPY . .
RUN bun run build

# Production stage
# base image는 node image로 시작한다. npm과 yarn이 모두 설치되어 있다.
FROM nginx:stable-alpine

# nginx의 기본 service를 제거한다.
RUN rm -rf /etc/nginx/sites-enabled/default.conf
 
# nginx에 serving할 html의 설정파일을 복사한다.
COPY nginx.conf /etc/nginx/conf.d/


COPY --from=build /code/dist /usr/share/nginx/html

# frontend Port를 설정한다.
EXPOSE 5050

#container 종료 될때 정상 종료 유도
STOPSIGNAL SIGTERM

# container가 종료될 때 정상종료를 유도한다.
STOPSIGNAL SIGTERM

# nginx를 global 설정
# Docker에서는 nginx가 daemon으로 실행되지 않도록 한다.
# daemon으로 실행하지 않으면 container가 바로 종료된다.
CMD ["nginx", "-g", "daemon off;"]