const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'USER'
    }
})

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.STRING,
        references: {
            model: Category,
            key: 'id',
        },
        allowNull: false
    }
})

const Cart = sequelize.define('cart', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.STRING,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false
    }
})

const Color = sequelize.define('color', {
    id: {
        type: DataTypes.STRING,
        allowNull:false,
        primaryKey: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colorHex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.STRING,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false
    }
})

const Image = sequelize.define('image', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colorId: {
        type: DataTypes.STRING,
        references: {
            model: Color,
            key: 'id',
        },
        allowNull: false
    }
})

User.hasMany(Cart, { foreignKey: 'userId' })
Cart.belongsTo(User, { foreignKey: 'userId' })

Category.hasMany(Product, { foreignKey: 'categoryId' })
Product.belongsTo(Category, { foreignKey: 'categoryId' })

Product.hasMany(Cart, { foreignKey: 'productId' })
Cart.belongsTo(Product, { foreignKey: 'productId' })

Product.hasMany(Color, { foreignKey: 'productId' })
Color.belongsTo(Product, { foreignKey: 'productId' })

Color.hasMany(Image, { foreignKey: 'colorId' })
Image.belongsTo(Color, { foreignKey: 'colorId' })

module.exports = {
    User,
    Category,
    Product,
    Color,
    Image,
    Cart,
}