const express = require("express");
const router = express.Router();
const fs = require("fs");

const productsFilePath = "./productos.json";

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ error: "No se pudieron obtener los productos" });
      return;
    }
    let productos = JSON.parse(data);
    if (limit && limit > 0) {
      productos = productos.slice(0, limit);
    }
    res.json(productos);
  });
});

router.get("/:pid", (req, res) => {
  const pid = req.params.pid;
  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ error: "No se pudo obtener el producto" });
      return;
    }
    const productos = JSON.parse(data);
    const producto = productos.find((p) => p.id == pid);
    if (!producto) {
      res.status(404).send({ error: "Producto no encontrado" });
      return;
    }
    res.json(producto);
  });
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    !Array.isArray(thumbnails)
  ) {
    res.status(400).send({ error: "Faltan datos del producto" });
    return;
  }

  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ error: "No se pudo agregar el producto" });
      return;
    }
    const productos = JSON.parse(data);

    const id =
      productos.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1;

    const nuevoProducto = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };

    productos.push(nuevoProducto);

    fs.writeFile(productsFilePath, JSON.stringify(productos), (err) => {
      if (err) {
        res.status(500).send({ error: "No se pudo agregar el producto" });
        return;
      }
      res.json({ mensaje: "Producto agregado correctamente", producto: nuevoProducto });
    });
  });
});

router.put("/:pid", (req, res) => {
  const pid = req.params.pid;

  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send({ error: "No se pudo actualizar el producto" });
      return;
    }

    const productos = JSON.parse(data);

    const producto = productos.find((p) => p.id == pid);
    if (!producto) {
      res.status(404).send({ error: "Producto no encontrado" });
      return;
    }

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    producto.title = title || producto.title;
    producto.description = description || producto.description
