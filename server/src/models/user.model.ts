import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';

interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'student';
    active: boolean;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> { }

class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public email!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public role!: 'admin' | 'student';
    public active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Método para comparar contraseñas
    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'student'),
            defaultValue: 'student'
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeSave: async (user: User) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    }
);

export default User; 