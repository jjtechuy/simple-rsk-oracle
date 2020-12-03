cd ./docker
docker rm -f regtest-node-01
docker run -d --name regtest-node-01  -p 4444:4444 -p 30305:30305 regtest