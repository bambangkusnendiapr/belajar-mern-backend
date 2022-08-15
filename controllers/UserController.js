import User from "../models/UserModel.js"
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response)
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const createUser = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({msg: "User Created"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const updateUser = async (req, res) => {
    try {
        await User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Updated"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "User Deleted"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

//mengerjakan input data banyak
export const userSeeders = async (req, res) => {
    // res.status(201).json({msg: "User Created"})
    try {
        for (let i = 1000; i < 10000; i++) {
            const name = 'User ' + i;
            const email = 'user' + i + '@gmail.com';
            const gender = i % 2 === 1 ? 'Male' : 'Female';
            // console.log(name, email, gender);
            await User.create({
                name: name,
                email: email,
                gender: gender
            });
          }
        const response = await User.findAll();
        res.status(201).json({msg: "User Created"})
    } catch (error) {
        console.log('ini ' + error.message);
    }
}

export const getAllUser = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page;
    const totalRows = await User.count({
        where: {
            [Op.or]: [{name:{
                [Op.like]: '%'+search+'%'
            }}, {email: {
                [Op.like]: '%'+search+'%'
            }}]
        }
    });

    const totalPage = Math.ceil(totalRows / limit);
    const result = await User.findAll({
        where: {
            [Op.or]: [{name:{
                [Op.like]: '%'+search+'%'
            }}, {email: {
                [Op.like]: '%'+search+'%'
            }}]
        },
        offset: offset,
        limit: limit,
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({
        result: result,
        page : page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage
    });
}