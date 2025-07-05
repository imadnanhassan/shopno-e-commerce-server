import UserModel from '../modules/users/user.model';
import bcrypt from 'bcryptjs';

export const seedAdmin = async () => {
  try {
    const adminExists = await UserModel.findOne({
      email: 'abulhassan.dev@gmail.com',
    });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('constPassword38', 10);
    const admin = new UserModel({
      email: 'abulhassan.dev@gmail.com',
      phone: '01404503622',
      password: hashedPassword,
      role: 'admin',
      name: 'Adnan Hassan',
      isVerified: true,
    });

    await admin.save();
    console.log('Admin seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
