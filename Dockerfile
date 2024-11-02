
# Bun의 공식 이미지를 사용하여 베이스를 설정합니다.
# 최신 버전의 Bun을 사용하려면 해당 버전 정보를 확인합니다.

#nginx
FROM nginx:stable-alpine
RUN rm -rf /etc/nginx/sites-enabled/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=build /code/dist /usr/share/nginx/html

FROM oven/bun:1 AS base

# 작업 디렉토리를 설정
WORKDIR /usr/src/app

# ------------------------------------------
# Install 단계 (개발 환경 의존성 포함 설치)
# ------------------------------------------
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install 


# ------------------------------------------
# Install 단계 (프로덕션 의존성만 설치)
# ------------------------------------------
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install 


# ------------------------------------------
# Prerelease 단계 (테스트와 빌드 실행)
# ------------------------------------------
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .


# 환경 변수 설정
ENV NODE_ENV=production

# [선택 사항] 테스트 실행
RUN bun test

# 빌드 실행
RUN bun run build

# ------------------------------------------
# Release 단계 (최종 이미지 빌드)
# ------------------------------------------
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json .





# 포트 설정
EXPOSE 5050

STOPSIGNAL SIGTERM


# 애플리케이션 실행
CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["bun", "run", "dist/index.js"]