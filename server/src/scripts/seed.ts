import mongoose from 'mongoose';
import User from '../models/User';
import { connectDatabase } from '../config/database';

const seedUsers = async () => {
  try {
    await connectDatabase();

    // Clean up existing test users
    await User.deleteMany({
      $or: [
        { email: 'test@ehtp.ac.ma' },
        { studentId: 'EHTP-1234' },
        { email: 'admin@ehtp.ac.ma' },
        { studentId: 'EHTP-0001' },
        { email: 'employee@ehtp.ac.ma' },
        { studentId: 'EHTP-0002' },
      ],
    });

    // Create test student
    await User.create({
      fullName: 'Étudiant Test',
      email: 'test@ehtp.ac.ma',
      studentId: 'EHTP-1234',
      password: 'Test1234!',
      role: 'student',
      isVerified: true,
      preferredLanguage: 'fr',
      phoneNumber: '0612345678',
    });

    // Create test admin
    await User.create({
      fullName: 'Admin Test',
      email: 'admin@ehtp.ac.ma',
      studentId: 'EHTP-0001',
      password: 'Admin1234!',
      role: 'admin',
      isVerified: true,
      preferredLanguage: 'fr',
    });

    // Create test employee
    await User.create({
      fullName: 'Employé Test',
      email: 'employee@ehtp.ac.ma',
      studentId: 'EHTP-0002',
      password: 'Employee1234!',
      role: 'employee',
      isVerified: true,
      preferredLanguage: 'fr',
    });

    console.log('✅ Users créés avec succès:');
    console.log('\n📚 Étudiant:');
    console.log('   Email: test@ehtp.ac.ma');
    console.log('   Student ID: EHTP-1234');
    console.log('   Password: Test1234!');
    console.log('\n👑 Admin:');
    console.log('   Email: admin@ehtp.ac.ma');
    console.log('   Student ID: EHTP-0001');
    console.log('   Password: Admin1234!');
    console.log('\n👔 Employé:');
    console.log('   Email: employee@ehtp.ac.ma');
    console.log('   Student ID: EHTP-0002');
    console.log('   Password: Employee1234!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seedUsers();

