const express = require("express");
var bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get("/api/get_types_equipment", (req, res) => {
  console.log("Запрос списка типов оборудования");
  const connection = mysql
    .createConnection({
      host: "localhost",
      user: "igor",
      database: "equipment",
      password: "Pervil-9",
    })
    .promise();
  connection
    .query("SELECT * FROM type_equipment")
    .then((result) => {
      console.log(result[0]);
      res.send(result[0]);
    })

    .catch((err) => {
      console.log(err);
    });

  // закрытие подключения
  connection.end(function (err) {
    if (err) {
      return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
  });
});

app.post("/api/equipment", (req, res) => {
  console.log("Запрос добавления оборудования");

  console.log(req.body);
  const connection = mysql.createConnection({
    host: "localhost",
    user: "igor",
    database: "equipment",
    password: "Pervil-9",
  });
  // .promise();

  const neweq = [req.body.idte, req.body.sn, req.body.prim];
  console.log(neweq);
  const sql =
    "INSERT INTO equipment(id_type_equipment, sn_equipment, prim_equipment) VALUES(?, ?, ?)";
  connection.query(sql, neweq, function (err, results) {
    if (err) {
      console.log(err);
      res
        .status(201)
        .send(`Ошибка при добавлении оборудования в базу: ${err.sqlMessage}`);
    } else {
      console.log("Оборудование добавлено");
      res.status(200).send("Оборудование успешно добавлено в базу");
    }
    // закрытие подключения
    connection.end(function () {
      console.log("Подключение закрыто");
    });
  });
});
//Получение списка оборудования
app.get("/api/equipment", (req, res) => {
  console.log("Запрос списка оборудования");
  const connection = mysql
    .createConnection({
      host: "localhost",
      user: "igor",
      database: "equipment",
      password: "Pervil-9",
    })
    .promise();
  connection
    .query("SELECT * FROM equipment")
    .then((result) => {
      console.log(result[0]);
      res.send(result[0]);
    })

    .catch((err) => {
      console.log(err);
    });

  // закрытие подключения
  connection.end(function (err) {
    if (err) {
      return console.log("Ошибка: " + err.message);
    }
    console.log("Подключение закрыто");
  });
});
//Получение оборудования по его id
app.get("/api/equipment/:id", (req, res) => {
  console.log("Запрос на выбор оборудования по его id оборудования");
  console.log(req.params);
  const ideq = [req.params.id];
  const sql = "SELECT * FROM equipment WHERE id_equipment=?";
  const connection = mysql.createConnection({
    host: "localhost",
    user: "igor",
    database: "equipment",
    password: "Pervil-9",
  });
  connection.query(sql, ideq, function (err, results) {
    if (err) {
      console.log(err);
      res
        .status(201)
        .send(`Ошибка при выборе оборудования по его id: ${err.sqlMessage}`);
    } else if (results.affectedRows != 0) {
      console.log(results[0]);

      console.log("Оборудование изменено");
      res.status(200).send(results[0]);
    } else {
      console.log(` Нет оборудования с id:${ideq}`);
      res.status(201).send(`Нет оборудования с id:${ideq}`);
    }
    //console.log(results.affectedRows);
    connection.end(function () {
      console.log("Подключение закрыто");
    });
  });
});

app.delete("/api/equipment/:id", (req, res) => {
  console.log("Запрос на удаление оборудования");
  console.log(req.params);
  const ideq = [req.params.id];
  const sql = "DELETE FROM equipment WHERE  id_equipment=?";

  const connection = mysql.createConnection({
    host: "localhost",
    user: "igor",
    database: "equipment",
    password: "Pervil-9",
  });
  // .promise();
  connection.query(sql, ideq, function (err, results) {
    if (err) {
      console.log(err);
      res
        .status(201)
        .send(`Ошибка при удалении оборудования из базы: ${err.sqlMessage}`);
    } else if (results.affectedRows != 0) {
      console.log("Оборудование удалено");
      res
        .status(200)
        .send(` ${results.affectedRows} oборудование успешно удалено из базы`);
    } else {
      console.log("Ни одно оборудование не удалено из базы");
      res.status(201).send(`Ни одно оборудование не удалено из базы!`);
    }
    console.log(results.affectedRows);
    connection.end(function () {
      console.log("Подключение закрыто");
    });
  });
});

//Изменение оборудования по его id
app.put("/api/equipment/:id", (req, res) => {
  console.log("Запрос на изменение оборудования по его id ");
  console.log(req.params);
  console.log(req.body);
  const edit_eq = [
    req.body.id_type_equipment,
    req.body.sn_equipment,
    req.body.prim_equipment,
    req.params.id,
  ];
  const sql =
    "UPDATE equipment SET id_type_equipment=?, sn_equipment=?, prim_equipment=?  WHERE id_equipment=?";
  const connection = mysql.createConnection({
    host: "localhost",
    user: "igor",
    database: "equipment",
    password: "Pervil-9",
  });
  connection.query(sql, edit_eq, function (err, results) {
    console.log(results);
    if (err) {
      console.log(err);
      res
        .status(201)
        .send(`Ошибка при изменении оборудования по его id: ${err.sqlMessage}`);
    } else if (results.affectedRows != 0) {
      console.log("Оборудование изменено");
      res.status(200).send(`Оборудованиe успешно изменено`);
    } else {
      console.log(` Нет оборудования с id:${ideq}`);
      res.status(201).send(`Нет оборудования с id:${ideq}`);
    }
    //console.log(results.affectedRows);
    connection.end(function () {
      console.log("Подключение закрыто");
    });
  });
});

app.listen(3000);
