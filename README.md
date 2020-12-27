# JSON_CRD
Use node app.js to execute
1.create
  POST TO http://localhost:7500/create
  i/p payload example
  {
       "ana":
          {
            "timeToLive":100,
            "name":"ajj"
          }
  }
 
2.Read
 POST TO http://localhost:7500/read
  i/p payload example
  {
      keys:"key1,key2,key3"
  }
  
3.delete
 POST TO http://localhost:7500/delete
  i/p payload example
  {
      keys:"key1,key2,key3"
  }  
  
Response would be success or error(if any),for create API the response would be keys Added and keys already present
