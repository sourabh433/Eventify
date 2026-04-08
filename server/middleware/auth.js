const jwt = require('jsonwebtoken');
const User = require('../models/User');

//user authentication middleware || user login or not
// const protect = async (req, res, next) => {
//     let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;

//     if(!token) {
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
            

//             if(!req.user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }
//             next();

//         } catch (error) {
//             return res.status(401).json({ message: 'Not authorized, token failed' });

//         }
//     } else {
//         return res.status(400).json({ message: 'Not authorized, no token' });
//     }
// };

// const protect = async (req, res, next) => {
//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         try {
//             token = req.headers.authorization.split(' ')[1];

//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             req.user = await User.findById(decoded.id).select('-password');

//             if (!req.user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             next();
//         } catch (error) {
//             console.error(error);
//             return res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }
// };

const protect = async (req, res, next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }

            next();

        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if(req.user && req.user.role === 'admin'){
        next();
    }
    else {
        return res.status(403).json({ message: 'forbidden, admin access required' });

    }
}

module.exports = { protect, admin };