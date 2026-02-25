docker-compose build

docker push yclai37/nycu_service-learning-nanao:backend
docker push yclai37/nycu_service-learning-nanao:frontend
docker push yclai37/nycu_service-learning-nanao:voice_reco

docker-compose up -d
S