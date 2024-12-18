docker-compose build

docker push userwei/nycu_service-learning-nanao:backend
docker push userwei/nycu_service-learning-nanao:frontend
docker push userwei/nycu_service-learning-nanao:backend_avatar

docker-compose up -d
