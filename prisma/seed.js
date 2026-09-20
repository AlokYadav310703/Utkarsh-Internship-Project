import bcrypt from "bcryptjs";
import { prisma } from "../server/src/config/prisma.js";

const main = async () => {
  const passwordHash = await bcrypt.hash("Password@123", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@aderf.co.in" },
    update: {},
    create: {
      name: "ADERF Super Admin",
      email: "superadmin@aderf.co.in",
      mobile: "6203281935",
      passwordHash,
      role: "SUPER_ADMIN",
      isEmailVerified: true,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@aderf.co.in" },
    update: {},
    create: {
      name: "Utkarsh Admin",
      email: "admin@aderf.co.in",
      mobile: "9430249924",
      passwordHash,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "student@example.com",
      mobile: "9876543210",
      passwordHash,
      role: "STUDENT",
      isEmailVerified: true,
      profile: {
        create: {
          fatherName: "Demo Father",
          motherName: "Demo Mother",
          gender: "Female",
          currentClass: "X",
          schoolName: "Patna Public School",
          educationBoard: "CBSE",
          previousPercentage: 89,
          state: "Bihar",
          district: "Patna",
          city: "Patna",
          pinCode: "800001",
        },
      },
    },
  });

  await prisma.application.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      sessionYear: "2026-27",
      status: "DRAFT",
    },
  });

  const faqs = [
    ["What is the Utkarsh Scholarship Program?", "It is ADERF's annual scholarship initiative for deserving Class X students."],
    ["Who can apply?", "Students currently studying in Class X in a recognized school can apply."],
    ["Is email verification mandatory?", "Yes. Students must verify their email with OTP before submitting an application."],
    ["Is there any application fee?", "No. The scholarship process is completely free."],
    ["Can I edit my application after submission?", "No. Submitted applications are locked for review."],
  ];

  await Promise.all(
    faqs.map(([question, answer], index) =>
      prisma.faq.upsert({
        where: { id: `seed-faq-${index + 1}` },
        update: { question, answer, sortOrder: index + 1, isActive: true },
        create: { id: `seed-faq-${index + 1}`, question, answer, sortOrder: index + 1, isActive: true },
      }),
    ),
  );

  await prisma.setting.upsert({
    where: { key: "scholarship" },
    update: {},
    create: {
      key: "scholarship",
      value: {
        programName: "Utkarsh Annual Scholarship Program",
        organization: "Asian Development Educational & Research Foundation",
        amount: 5000,
        maxSelections: 11,
        launchDate: "15 June",
        contactEmail: "support.utkarsh@aderf.co.in",
        contactMobile: "+91 6203281935",
      },
    },
  });

  console.log("Seed complete");
  console.log("Super Admin: superadmin@aderf.co.in / Password@123");
  console.log("Admin: admin@aderf.co.in / Password@123");
  console.log("Student: student@example.com / Password@123");
  console.log(`Seeded by ${superAdmin.email}`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
