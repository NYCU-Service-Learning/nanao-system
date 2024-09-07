docker-compose build

docker push userwei/nycu_service-learning-nanao:backend
docker push userwei/nycu_service-learning-nanao:frontend

docker-compose up -d
