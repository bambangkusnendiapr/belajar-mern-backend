import Product from "../models/ProductModel.js"
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response)
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const createProduct = async (req, res) => {
    // return res.status(200).json({msg: 'ok'})
    if(req.files === null) return res.status(400).json({msg: "No File Uploded"})

    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name); //extension
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 'Invalid Image'});
    if(fileSize > 5000000) return res.status(422).json({msg: 'Maximal 5MB'});
    
    file.mv(`./public/images/${fileName}`, async(error) => {
        if(error) return res.status(500).json({msg: error.message})

        try {
            await Product.create({
                name: name,
                price: req.body.price,
                stock: req.body.stock,
                image: fileName,
                url: url
            })
            res.status(201).json({msg: "Product Created"})
        } catch (error) {
            console.log(error.message);
        }
    })

    // try {
    //     await Product.create(req.body);
    //     res.status(201).json({msg: "Product Created"})
    // } catch (error) {
    //     console.log('ini ' + error.message);
    // }
}

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    })

    if(!product) return res.status(404).json({msg: 'Data Not Found'})
    let fileName = "";
    if(req.files === null) {
        fileName = product.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name); //extension
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: 'Invalid Image'});
        if(fileSize > 5000000) return res.status(422).json({msg: 'Maximal 5MB'});

        const filepath = `./public/images/${product.image}`;

        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (error) => {
            if(error) return res.status(500).json({msg: error.message})
        })
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Product.update({
            name,
            price: req.body.price,
            stock: req.body.stock,
            image: fileName,
            url
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product Updated"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            id: req.params.id
        }
    })

    if(!product) return res.status(404).json({msg: 'Data Not Found'})

    try {
        const filepath = `./public/images/${product.image}`;

        fs.unlinkSync(filepath);

        await Product.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg: "Product Deleted"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}