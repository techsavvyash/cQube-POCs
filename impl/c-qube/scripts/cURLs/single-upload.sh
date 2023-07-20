curl --request POST \
  --url https://cqube-admin.onrender.com/admin/validate \
  --header 'Content-Type: multipart/form-data' \
  --form grammar=@/path/to/cQube-POCs/impl/c-qube/ingest/programs/diksha/avgplaytime-event.grammar.csv \
  --form data=@/path/to/cQube-POCs/impl/c-qube/ingest/programs/diksha/avgplaytime-event.data.csv \
  --form type=event-data