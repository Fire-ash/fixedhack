set -eu
RESP=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password123"}')
TOKEN=$(echo "$RESP" | jq -r .token)
echo "TOKEN: ${TOKEN:0:8}...${TOKEN: -8}"
CREATE=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"title":"NotifyDemo","type":"hackathon","start_date":"2025-12-01T00:00:00Z","end_date":"2025-12-02T00:00:00Z","description_short":"short"}' http://localhost:5000/api/events)
echo "CREATE: $CREATE" | jq .
OPPID=$(echo "$CREATE" | jq -r .event.id)
echo "Triggering notify for id=$OPPID"
curl -s -X POST -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/opportunities/${OPPID}/notify | jq .
