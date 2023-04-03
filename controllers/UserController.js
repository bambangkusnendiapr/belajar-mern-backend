import User from "../models/UserModel.js"
import { Op } from "sequelize";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const getUsers = async (req, res) => {
    console.log(req.email);
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

export const register = async(req, res) => {
    const { name, email, password, confirmPassword } = req.body
    if(password !== confirmPassword) {
        return res.status(400).json({msg: "Password tidak cocok"})
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    try {
        await User.create({
            name,
            email,
            password: hashPassword
        })

        return res.status(200).json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error);
    }
}

export const login = async(req, res) => {
    try {
        const user = await User.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if(!match) return res.status(400).json({msg: "Password salah"})

        const userId = user[0].id
        const name = user[0].name
        const email = user[0].email

        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        await User.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({accessToken})
    } catch (error) {
        res.status(400).json({msg: "Email Salah"})
    }
}