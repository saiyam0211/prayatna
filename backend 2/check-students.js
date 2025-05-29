require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function checkStudents() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://saiyamkumar2007:Saiyam12@cluster0.x9jcmnx.mongodb.net/prayatna';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Find all students
    const students = await Student.find({}).select('enrollmentId phoneNumber profile.name').populate('school', 'profile.name');

    console.log(`Found ${students.length} students:`);
    students.forEach(student => {
      console.log(`- ID: ${student.enrollmentId}, Phone: ${student.phoneNumber}, Name: ${student.profile?.name || 'Not set'}, School: ${student.school?.profile?.name || 'Not set'}`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStudents(); 