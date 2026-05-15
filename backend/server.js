const express = require('express');
const mysql = require('mysql');
const path = require('path');  
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { url } = require('inspector');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 5000;


// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Use environment variables in production
  password: '',           // Set a strong password and store in env
  database: 'projectdb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log('Connected to MySQL database.');
});

// Middleware

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public'))); // Recommended to use absolute path

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = decoded.id;   // 🔥 THIS FIXES userid
    next();
  });
};


// === Page Routes (Static HTML files) ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
  
});
app.get('/pagesummary', (req, res) => {
  res.sendFile(path.join(__dirname, 'pagesummary.html'));
  
});
app.get('/addpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'addpage.html'));
  
});
app.get('/categorysummary', (req, res) => {
  res.sendFile(path.join(__dirname, 'categorysummary.html'));
 
});
app.get('/addcategory', (req, res) => {
  res.sendFile(path.join(__dirname, 'addcategory.html'));

});
app.get('/productsummary', (req, res) => {
  res.sendFile(path.join(__dirname, 'productsummary.html'));
 
});
app.get('/addproduct', (req, res) => {
  res.sendFile(path.join(__dirname, 'addproduct.html'));
});
app.get('/addslider', (req, res) => {
  res.sendFile(path.join(__dirname, 'addslider.html'));
});
app.get('/slidersummary', (req, res) => {
    res.sendFile(path.join(__dirname, 'slidersummary.html'));
});
app.get('/addbrand', (req, res) => {
  res.sendFile(path.join(__dirname, 'addbrand.html'));
});
app.get('/brandsummary', (req, res) => {
    res.sendFile(path.join(__dirname, 'brandsummary.html'));
});
app.get('/addpartner', (req, res) => {
  res.sendFile(path.join(__dirname, 'addpartner.html'));
});
app.get('/partnersummary', (req, res) => {
    res.sendFile(path.join(__dirname, 'partnersummary.html'));
});

app.get('/changepassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'changepassword.html'));

});
// website pages links
app.get('/HomePage', (req, res) => {
  res.sendFile(path.join(__dirname, 'HomePage.js'));
});
app.get('/Cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'Cart.js'));
});


// === Admin Login Page ===

app.post('/adminlogin', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM adminlogin WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length > 0) {
      // No session or token returned
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  });
});


app.get('/addpage', (req, res) => {
  // if (req.session.user) {
    // res.send(`<h1>Welcome, ${req.session.user}</h1><a href="/logout">Logout</a>`);
    res.sendFile(path.join(__dirname, 'addpage.html'));
  // } else {
  //   res.redirect('/');
  // }
});

// === Add Page (POST) ===
//insert data
app.post('/add-page', (req, res) => {
  const { name, title, content, displayorder, status } = req.body;

  if (!name || !title || !content || displayorder === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const displayOrderNum = parseInt(displayorder, 10);
  if (isNaN(displayOrderNum) || displayOrderNum < 1) {
    return res.status(400).json({ message: 'Display order must be a valid positive number.' });
  }

  const pageStatus = status ? 1 : 0;

  const query = 'INSERT INTO addpage (name, title, content, displayorder, status) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, title, content, displayOrderNum, pageStatus], (err, result) => {
    if (err) {
      console.error('❌ Error inserting page:', err);
      return res.status(500).json({ message: 'Database error. Could not add page.' });
    }
    else {
      return res.status(200).json({ message: '✅ Page added successfully!' });
    }
  });
});

// Update data (PUT)
app.put('/update-page/:id', (req, res) => {
  const { id } = req.params;
  const { name, title, content, displayorder, status } = req.body;

  if (!name || !title || !content || displayorder === undefined || status === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const displayOrderNum = parseInt(displayorder, 10);
  if (isNaN(displayOrderNum) || displayOrderNum < 1) {
    return res.status(400).json({ message: 'Display order must be a valid positive number.' });
  }

  const pageStatus = status ? 1 : 0;

  const query = 'UPDATE addpage SET name = ?, title = ?, content = ?, displayorder = ?, status = ? WHERE id = ?';
  db.query(query, [name, title, content, displayOrderNum, pageStatus, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating page:', err);
      return res.status(500).json({ message: 'Database error. Could not update page.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }
    else {
      return res.status(200).json({ message: '✅ Page updated successfully.' });
    }
  });
});

// === Page summary ===
// GET /pageSummary -> fetch from MySQL
app.get('/api/pages', (req, res) => {
  db.query('SELECT * FROM addpage', (err, results) => {
    if (err) {
      console.error('❌ Error fetching pages:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


//delete data
app.delete('/deletedata/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addpage WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});

// Search page by name (case-insensitive,partial match)
app.get('/searchpage', (req,res) => {
    const { name } = req.query;
    if(!name){
        return res.status(400).send('Search term is required');
    }
    const sql = "SELECT * FROM addpage WHERE name LIKE ? ";
    db.query(sql, [`%${name}%`], (err, results) => {
        if(err){
            console.error('Error searching page', err);
            return res.status(500).send('Search Failed');
        }
        res.json(results);
    });
});

// === Add category ===
app.post('/add-category', (req, res) => {

  
  const { name, displayorder, check } = req.body;

  if (!name || !displayorder) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const status = check ? 1 : 0;                                       
  const displayOrderNum = parseInt(displayorder, 10);

  const query = 'INSERT INTO addcategory (name, displayorder, status) VALUES (?, ?, ?)';
  db.query(query, [name, displayOrderNum, status], (err, result) => {
    if (err) {
      console.error('Error Inserting Category:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Category added successfully!' });
  });
});
// update category
app.put('/update-category/:id', (req, res) => {
  const { id } = req.params;
  const { name, displayorder, status } = req.body;

  if (!name || displayorder === undefined || status === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const displayOrderNum = parseInt(displayorder, 10);
  if (isNaN(displayOrderNum) || displayOrderNum < 1) {
    return res.status(400).json({ message: 'Display order must be a valid positive number.' });
  }

  const pageStatus = status ? 1 : 0;

  const query = 'UPDATE addcategory SET name = ?, displayorder = ?, status = ? WHERE id = ?';
  db.query(query, [name, displayOrderNum, pageStatus, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating page:', err);
      return res.status(500).json({ message: 'Database error. Could not update page.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Page not found.' });
    }
    else {
      return res.status(200).json({ message: '✅ Page updated successfully.' });
    }
  });
});
//delete data
app.delete('/delete-category/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addcategory WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});

// Search page by name (case-insensitive,partial match)
app.get('/searchcategory', (req,res) => {
    const { name } = req.query;
    if(!name){
        return res.status(400).send('Search term is required');
    }
    const sql = "SELECT * FROM addcategory WHERE name LIKE ? ";
    db.query(sql, [`%${name}%`], (err, results) => {
        if(err){
            console.error('Error searching category', err);
            return res.status(500).send('Search Failed');
        }
        res.json(results);
    });
});


// === category summary ===
// GET /Category Summary -> fetch from MySQL
app.get('/api/category', (req, res) => {
  db.query('SELECT * FROM addcategory', (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// ============multer fileupload============//
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // folder for uploaded images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });
// === add product ===
app.post('/add-product', upload.single('image'), (req, res) => {
  const { category_id, brand_id, productname, description, price, displayorder, check, } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const status = check ? 1 : 0;

  if (!productname || !description || !price || !displayorder || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = `
    INSERT INTO addproduct (category_id,brand_id, productname, description, image, price, displayorder, status)
    VALUES (?, ? ,? , ?, ?, ?, ?, ?)
  `;

  db.query(query, [category_id, brand_id, productname, description, image, price, displayorder, status], (err) => {
    if (err) {
      console.error('❌ Error inserting product:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    res.json({ message: '✅ Product added successfully!' });
  });
});
// update product
app.put('/update-product/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { category_id, brand_id , productname, description, price, displayorder, check } = req.body;
  const status = check ? 1 : 0;
  const image = req.file ? `/uploads/${req.file.filename}` : null;


  if (!category_id || !brand_id || !productname || !description || !price || !displayorder) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  // If new image uploaded, include it in update
  let query, values;
  if (image) {
    query = `
      UPDATE addproduct 
      SET category_id=?, brand_id=?, productname=?, description=?, image=?, price=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [category_id, brand_id, productname, description, image, price, displayorder, status, id];
  } else {
    query = `
      UPDATE addproduct 
      SET category_id=?, brand_id=?, productname=?, description=?, price=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [category_id, brand_id, productname, description, price, displayorder, status, id];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error updating product:', err);
      return res.status(500).json({ message: 'Database error during update.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: '✅ Product updated successfully!' });
  });
});

//delete products
app.delete('/deleteProduct/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addproduct WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});

// Search products by name (case-insensitive,partial match)
app.get('/searchproduct', (req,res) => {
    const { productname } = req.query;
    if(!productname){
        return res.status(400).send('Search term is required');
    }
    const sql = "SELECT * FROM addproduct WHERE productname LIKE ? ";
    db.query(sql, [`%${productname}%`], (err, results) => {
        if(err){
            console.error('Error searching page', err);
            return res.status(500).send('Search Failed');
        }
        res.json(results);
    });
});



// === Product summary ===
// GET /pageSummary -> fetch from MySQL
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM addproduct', (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM addproduct WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = results[0];

    // Convert single image column into an array
    product.images = product.image ? [product.image] : [];

    res.json(product);
  });
});

// Cart page

/* 🔹 Get Cart Data FROM DATABASE */
app.get("/api/cart", (req, res) => {
  db.query("SELECT * FROM addproduct", (err, products) => {
    if (err) return res.status(500).json(err);

    const subTotal = products.reduce((sum, p) => sum + p.price, 0);
    const shipping = 1;
    const total = subTotal + shipping;

    res.json({ products, subTotal, shipping, total });
  });
});
/* 🔹 Place Order */


app.post("/api/order",verifyToken, (req, res) => {
  const { billing, paymentmethod, cart } = req.body;
  const userid = req.userId;

  if (!billing || !paymentmethod || !cart || cart.length === 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ message: "Transaction error" });
    }

    const orderSql = `
      INSERT INTO orders 
      (userid, firstname, lastname, email, mobile, address, country, city, state, zip, paymentmethod, subtotal, shipping, total, orderdate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, Now())
    `;

    db.query(
      orderSql,
      [
        userid,
        billing.firstname,
        billing.lastname,
        billing.email,
        billing.mobile,
        billing.address,
        billing.country,
        billing.city,
        billing.state,
        billing.zip,
        paymentmethod,
        subtotal,
        shipping,
        total
      ],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.log("ORDER INSERT ERROR:", err);
            res.status(500).json({ message: err.sqlMessage });
            

          });
        }

        const orderid = result.insertId;

        const itemsSql = `
          INSERT INTO orderitems 
          (orderid, productid, productname, price, quantity)
          VALUES ?
        `;

        const itemsValues = cart.map(item => [
          orderid,
          item.id || item.productid,
          item.productname,
          item.price,
          item.quantity
          
        ]);
        console.log(cart);
        db.query(itemsSql, [itemsValues], (err2) => {
          if (err2) {
            return db.rollback(() => {
              console.log("ORDER ITEMS ERROR:", err2);
              res.status(500).json({ message: err2.sqlMessage });
            });
          }

          db.commit(err3 => {
            if (err3) {
              return db.rollback(() => {
                res.status(500).json({ message: "Commit failed" });
              });
            }

            res.json({ message: "Order placed successfully" });
          });
        });
      }
    );
  });
});





// add slider
app.post('/add-slider', upload.single('image'), (req, res) => {
  const { description, displayorder, check } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // FIX 1: correct checkbox handling
  const status = check ? 1 : 0;

  // Validation
  if (!description || !displayorder || !image) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    });
  }

  const query = `
    INSERT INTO addslider (image, description, displayorder, status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [image, description, displayorder, status], (err) => {
    if (err) {
      console.error('❌ Error inserting slider:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error.'
      });
    }

    // FIX 2: return success flag
    res.json({
      success: true,
      message: '✅ Slider image added successfully!'
    });
  });
});

// update slider
app.put('/update-slider/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { description , displayorder, check } = req.body;
  const status = check ? 1 : 0;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  // ✅ Correct validation
  if ( !description || !displayorder ) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  // If new image uploaded, include it in update
  let query, values;
  if (image) {
    query = `
      UPDATE addslider
      SET description=?, image=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [ description, image, displayorder, status, id];
  } else {
    query = `
      UPDATE addslider 
      SET description=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [ description, displayorder, status, id];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error updating slider:', err);
      return res.status(500).json({ message: 'Database error during update.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'slider not found.' });
    }

    res.json({ message: '✅ Slider updated successfully!' });
  });
});

//delete slider
app.delete('/deleteslider/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addslider WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});


// GET /pageSummary -> fetch from MySQL
app.get('/api/slider', (req, res) => {
  db.query('SELECT * FROM addslider', (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Brand code

app.post('/add-brand', (req, res) => {
  const { name, displayorder, check } = req.body;
  if (!name || !displayorder) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const status = check ? 1 : 0;                                       
  const displayOrderNum = parseInt(displayorder, 10);

  const query = 'INSERT INTO addbrand (name, displayorder, status) VALUES (?, ?, ?)';
  db.query(query, [name, displayOrderNum, status], (err, result) => {
    if (err) {
      console.error('Error Inserting Brand:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Brand added successfully!' });
  });
});
// update brand
app.put('/update-brand/:id', (req, res) => {
  const { id } = req.params;
  const { name, displayorder, check } = req.body;

  if (!name || displayorder === undefined || status === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const displayOrderNum = parseInt(displayorder, 10);
  if (isNaN(displayOrderNum) || displayOrderNum < 1) {
    return res.status(400).json({ message: 'Display order must be a valid positive number.' });
  }

  const status = check ? 1 : 0;

  const query = 'UPDATE addbrand SET name = ?, displayorder = ?, status = ? WHERE id = ?';
  db.query(query, [name, displayOrderNum, status, id], (err, result) => {
    if (err) {
      console.error('❌ Error updating brand:', err);
      return res.status(500).json({ message: 'Database error. Could not update brand.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }
    else {
      return res.status(200).json({ message: '✅ Brand updated successfully.' });
    }
  });
});


//delete brand
app.delete('/delete-brand/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addbrand WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});


// GET brandSummary -> fetch from MySQL
app.get('/api/brand', (req, res) => {
  db.query('SELECT * FROM addbrand', (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


// Add partners
app.post('/add-partner', upload.single('image'), (req, res) => {
  const { name, link, displayorder, status } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;


  // Validation
  if ( !name || !link || !displayorder || (!image && !req.body.id)) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    });
  }

  const query = `
    INSERT INTO addpartner ( name,image, link, displayorder, status)
    VALUES (?, ?, ?, ?,?)
  `;

  db.query(query, [name, image, link, displayorder, status], (err) => {
    if (err) {
      console.error('❌ Error inserting brand:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error.'
      });
    }

    // FIX 2: return success flag
    res.json({
      success: true,
      message: '✅ partner logo added successfully!'
    });
  });
});

// update partner
app.post('/update-partner/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  // const { name, displayorder, check } = req.body;
  const { name, link, displayorder, status } = req.body;
  // const status = check ? 1 : 0;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  // ✅ Correct validation
  if ( !name || !link || !displayorder ) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }

  // If new image uploaded, include it in update
  let query, values;
  if (image) {
    query = `
      UPDATE addpartner
      SET name=?, image=?, link=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [ name, image, link, displayorder, status, id];
  } else {
    query = `
      UPDATE addpartner 
      SET name=?, link=?, displayorder=?, status=? 
      WHERE id=?
    `;
    values = [ name, link, displayorder, status, id];
  }

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Error updating partner:', err);
      return res.status(500).json({ message: 'Database error during update.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Partner not found.' });
    }

    res.json({ message: '✅ Partner updated successfully!' });
  });
});

//delete slider
app.delete('/delete-partner/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM addparner WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting page:', err);
      return res.status(500).send('Failed to delete');
    }
    res.send('Deleted successfully');
  });
});


// GET partnerSummary -> fetch from MySQL
app.get('/api/partners', (req, res) => {
  db.query('SELECT * FROM addpartner', (err, results) => {
    if (err) {
      console.error('❌ Query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// change Password
app.post('/change-password', (req, res) => {
const { username, currentPassword, newPassword } = req.body;

  // Validate fields
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Step 1: Check if user and current password match
  const checkQuery = 'SELECT * FROM login WHERE username = ? AND password = ?';
  db.query(checkQuery, [username, currentPassword], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Step 2: Update password
    const updateQuery = 'UPDATE login SET password = ? WHERE username = ?';
    db.query(updateQuery, [newPassword, username], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Error updating password' });
      }
     res.json({ success: true, message: 'Password changed successfully' });
    });
  });
});

// Add Page (Protected)
app.get('/addpage', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'addpage.html'));
  } else {
    res.redirect('/');
  }
});

// === logout ===
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Logout failed');
    res.redirect('/');
  });
});

//Website code
// ===============
// Register API

app.post("/userregister", async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  if (!firstname || !lastname || !email || !mobile || !password) {
    return res.status(400).send({ message: "All fields required" });
  }

  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
   
    db.query(
      "INSERT INTO userregister(firstname, lastname, email, mobile, password) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, mobile, password],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).send({ message: "Email already registered" });
          }
          console.log(err);
          return res.status(500).send({ message: "Database error" });
        }

        res.send({ message: "Registered Successfully" });
      }
    );
  }
  catch (err){
    res.status(500).send({ message: "Server Error" });
  }
});

// =====================
// User Login
// =====================
app.post("/userlogin", (req, res) => {
  const { email, password } = req.body;

  console.log("Login Request:", email, password);

  if (!email || !password)
    return res.status(400).send({ message: "Email and Password required" });

  db.query("SELECT * FROM userregister WHERE email = ?", [email], async (err, result) => {
    if (err) {
    console.log("DB Error:", err);  
    return res.status(500).send({ message: "Database Error" });
    }

    if (result.length === 0){

      return res.status(400).send({ message: "User Not Found" });
    }
    const user = result[0];

    if (password !== user.password) 
    {
      return res.status(401).send({ message: "Wrong Password" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, "secret123", { expiresIn: "7d" });

    res.send({ message: "Login Successful", token, user });
  });
});

/* ================= ADD TO WISHLIST ================= */

// 🧠 In-memory wishlist (NO DB)
let wishlist = [];

app.post("/api/wishlist", (req, res) => {
  const product = req.body;

  const exists = wishlist.find(item => item.id === product.id);
  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  wishlist.push(product);
  res.json({ message: "Added to wishlist" });
});

/* ================= GET WISHLIST ================= */
app.get("/api/wishlist", (req, res) => {
  res.json(wishlist);
});

/* ================= REMOVE FROM WISHLIST ================= */
app.delete("/api/wishlist/:id", (req, res) => {
  const id = req.params.id;
  wishlist = wishlist.filter(item => item.id != id);
  res.json({ message: "Removed from wishlist" });
});

// === Add newsletter (POST) ===
//insert data
app.post('/add-newsletter', (req, res) => {
  const { email } = req.body;

  // Validation
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  const query = 'INSERT INTO newsletter (email) VALUES (?)';

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('❌ Error inserting email:', err);
      return res.status(500).json({ message: 'Database error. Could not add email.' });
    } else {
      return res.status(200).json({ message: '✅ Email added successfully!' });
    }
  });
});
// === My account page === //

app.get("/api/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    const userId = decoded.id;

    db.query(
      `SELECT 
        COUNT(*) AS totalOrders,
        IFNULL(SUM(total),0) AS totalSpent
       FROM orders 
       WHERE userid = ?`,
      [userId],
      (err2, result) => {
        if (err2) return res.status(500).json({ message: "DB Error" });

        res.json(result[0]);
      }
    );
  });
});

// OPTIONAL: CREATE NEW ORDER
// =============================

app.get("/api/myorders", verifyToken, (req, res) => {
  const userId = req.userId;

  const sql = `
  SELECT 
    o.id AS orderId,
    o.total AS price,
    o.orderdate,
    COALESCE(o.status,'Pending') AS status,
    GROUP_CONCAT(oi.productname SEPARATOR ', ') AS products
  FROM orders o
  LEFT JOIN orderitems oi ON o.id = oi.orderid
  WHERE o.userid = ?
  GROUP BY o.id
  ORDER BY o.id DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("Orders found:", results);

    res.json(results);
  });
});

/* post or save Address API */
app.post("/api/address", verifyToken, (req, res) => {

  const userId = req.userId;

  const { firstname, lastname, email, mobile, address, city, state, country, zip } = req.body;

  const sql = `
    INSERT INTO address (userid,firstname,lastname,email, mobile,address,city,state,country,zip)
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(
    sql,
    [userId, firstname,lastname,email, mobile, address, city, state, country, zip],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Address save failed" });
      }

      res.json({ message: "Address saved successfully" });

    }
  );
});
// update address
app.put("/api/address", verifyToken, (req, res) => {
  const userId = req.userId;

  const { firstname, lastname,email,mobile, address, city, state, country, zip } = req.body;

  const sql = `
    UPDATE address 
    SET firstname=?, lastname=?, email=?, mobile=?, address=?, city=?, state=?, country=?, zip=?
    WHERE userid=?
  `;

  db.query(
    sql,
    [firstname,lastname,email, mobile, address, city, state, country, zip, userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Update failed" });
      }

      res.json({ message: "Address updated successfully" });
    }
  );
});

// get address
app.get("/api/address", verifyToken, (req, res) => {

  const userId = req.userId;

  const sql = "SELECT * FROM address WHERE userid=? ORDER BY id DESC ";

  db.query(sql, [userId], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error fetching address" });
    }

    if (result.length === 0) {
      return res.json(null);
    }

    res.json(result[0]);

  });
});

// product detail review

app.post("/api/reviews", (req, res) => {
  const { productid, username, rating, comment } = req.body;

  const sql =
    "INSERT INTO reviews (productid, username, rating, comment) VALUES (?, ?, ?, ?)";

  db.query(sql, [productid, username, rating, comment], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error saving review" });
    }

    res.json({ message: "Review added successfully" });
  });
});
// GET reviews for a product
app.get("/api/reviews/:productid", (req, res) => {
  const { productid } = req.params;

  const sql = "SELECT * FROM reviews WHERE productid = ? ORDER BY id DESC";

  db.query(sql, [productid], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching reviews" });
    }

    res.json(result);
  });
});
// contact page 

app.post("/api/contact", (req, res) => {

  const { name, email, subject, message } = req.body;

  const sql = `
  INSERT INTO contact (name,email,subject,message)
  VALUES (?,?,?,?)
  `;

  db.query(
    sql,
    [name, email, subject, message],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          message: "Database error"
        });
      }
      res.json({
        message: "Message sent successfully!"
      });

    }
  );

});

// forgot password and reset password

// ================= FORGOT PASSWORD =================
app.post("/forgot-password", (req, res) => {

const { email } = req.body;

db.query("SELECT * FROM userregister WHERE email=?", [email], (err, result) => {

if (err) {
console.log(err);
return res.json({ message: "Database error" });
}

if (result.length === 0) {
return res.json({ message: "User not found" });
}

// create token
const token = jwt.sign({ email }, "resetSecret", { expiresIn: "15m" });

const expire = Date.now() + 15 * 60 * 1000;

// save token in DB
db.query(
"UPDATE userregister SET reset_token=?, reset_token_expire=? WHERE email=?",
[token, expire, email],
(err2) => {

if (err2) {
console.log(err2);
return res.json({ message: "Database update error" });
}

// email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "nisharani2312@gmail.com",
    // pass: "your_app_password"
    pass: "cupfpjkqqgzejkbh"
    
  },
  tls: {
    rejectUnauthorized: false
  }
});

const resetLink = `http://localhost:3000/Resetpassword/${token}`;

const mailOptions = {
from: process.env.EMAIL_USER,
to: email,
subject: "Password Reset",
text: `Click here to reset password: ${resetLink}`
};

// send email
transporter.sendMail(mailOptions, (error, info) => {

if (error) {
console.log("EMAIL ERROR:", error);
return res.json({ message: "Error sending email" });
}

console.log("Email sent:", info.response);

res.json({ message: "Reset link sent to email" });

});

});

});

});


// ================= RESET PASSWORD =================
app.post("/reset-password/:token", async (req, res) => {

const { token } = req.params;
const { password } = req.body;

try {

// verify JWT token
jwt.verify(token, "resetSecret");

} catch (err) {
return res.json({ message: "Invalid or expired token" });
}

// check DB token
const sql = "SELECT * FROM userregister WHERE reset_token=? AND reset_token_expire > ?";

db.query(sql, [token, Date.now()], async (err, result) => {

if (err) {
console.log(err);
return res.json({ message: "Database error" });
}

if (result.length === 0) {
return res.json({ message: "Invalid or expired token" });
}

// update password directly (no hashing)
const updateSql = `
UPDATE userregister 
SET password=?, reset_token=NULL, reset_token_expire=NULL 
WHERE reset_token=?
`;

db.query(updateSql, [password, token], (err2) => {

if (err2) {
console.log(err2);
return res.json({ message: "Password update failed" });
}

res.json({ message: "Password reset successful" });

});

});

});

// change password from my account //
app.post("/user-change-password", (req, res) => {

  const { currentPassword, newPassword } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, "secret123");

    const userId = decoded.id;

    // get user
    db.query("SELECT * FROM userregister WHERE id = ?", [userId], (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }

      const user = result[0];

      // check current password
      if (user.password !== currentPassword) {
        return res.status(400).send({ message: "Current password incorrect" });
      }

      // update password
      db.query(
        "UPDATE userregister SET password = ? WHERE id = ?",
        [newPassword, userId],
        (err, updateResult) => {

          if (err) {
            console.log(err);
            return res.status(500).send({ message: "Password update failed" });
          }

          res.send({ message: "Password changed successfully" });

        }
      );

    });

  } catch (error) {

    console.log(error);
    res.status(401).send({ message: "Invalid token" });

  }

});
// getuser
  app.get("/getuser", verifyToken, (req,res)=>{

const userid = req.userId;

const sql = "SELECT firstname,lastname,email,mobile FROM userregister WHERE id=?";

db.query(sql,[userid],(err,result)=>{

if(err){
  res.send(err);
}else{
  res.send(result[0]);
}

});

});

// update user account
app.post("/updateuseraccount", verifyToken, (req, res) => {

const { firstname, lastname, email, mobile } = req.body;
const userid = req.userId;

const sql = "UPDATE userregister SET firstname=?, lastname=?, email=?, mobile=? WHERE id=?";

db.query(sql, [firstname, lastname, email, mobile, userid], (err, result) => {

if(err){
  res.send({message:"Update failed"});
}
else{
  res.send({message:"Account updated successfully"});
}

});

});


// FETCH PAGES FROM DATABASE
// app.get("/api/pages", (req, res) => {
//   const sql = "SELECT * FROM pages ORDER BY id ASC";

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({
//         error: "Database error",
//       });
//     }

//     res.json(result);
//   });
// });


// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});