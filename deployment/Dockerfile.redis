FROM redis:7.2-alpine

WORKDIR /redis

COPY redis.conf /usr/local/etc/redis/redis.conf

COPY ./redis-init.sh ./

RUN chmod +x redis-init.sh