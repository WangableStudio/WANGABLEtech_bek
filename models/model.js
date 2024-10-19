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
    secondName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    image: {
        type: DataTypes.STRING,
        allowNull: true
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
        type: DataTypes.STRING,
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
    },
    productColor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.SMALLINT,
        defaultValue: 1
    }
})

const Color = sequelize.define('color', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color_ru: {
        type: DataTypes.STRING,
        allowNull: false
    },
    colorHex: {
        type: DataTypes.STRING,
        allowNull: false
    },
    preview: {
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

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.BIGINT,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.STRING,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
                allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    geo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Обрабатывается'
    },
    productColor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productImage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
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

User.hasMany(Order, { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

Product.hasMany(Order, { foreignKey: 'productId' })
Order.belongsTo(Product, { foreignKey: 'productId' })

module.exports = {
    User,
    Category,
    Product,
    Color,
    Image,
    Cart,
    Order,
}