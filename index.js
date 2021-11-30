const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')



const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true })
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch(err => {
        console.log("Error connecting to database!");
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })) //for parsing the req body which is sent when the form is submitted
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async(req, res) => {
    const { category } = req.query;
    console.log(category);
    if (category) {
        const products = await Product.find({ category: category });
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
            // console.log(products);
        res.render('products/index.ejs', { products, category: 'All' })

    }

})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async(req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save();
    console.log(newProduct);
    console.log(req.body);
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id); //Product.findById(req.params.id)...alternative option
    console.log(product);
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async(req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(req.body)
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async(req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})
app.listen(3000, () => {
    console.log("App is listening on port 3000");
})