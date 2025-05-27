{
  "info": {
    "name": "Goof API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login Test",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{ \"username\": \"testuser\", \"password\": \"123456\" }"
        },
        "url": {
          "raw": "{{base_url}}/login",
          "host": ["{{base_url}}"],
          "path": ["login"]
        }
      },
      "response": []
    }
  ]
}
