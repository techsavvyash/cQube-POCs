curl --request POST \
  --url http://localhost:3000/admin/bulk \
  --header 'Content-Type: multipart/form-data' \
  --form folder=@/path/to/update.zip