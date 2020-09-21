rw_doc.get("/doc/api/method/:id",c_method.one);
rw_doc.get("/doc/api/method",c_method.all);
rw_doc.post("/doc/api/method",c_method.push);
rw_doc.delete("/doc/api/method/:id",c_method.delet);