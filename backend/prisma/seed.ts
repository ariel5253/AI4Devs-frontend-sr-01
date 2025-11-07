import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create or find Companies
  const company1 = await prisma.company.upsert({
    where: { name: 'LTI' },
    update: {},
    create: {
      name: 'LTI',
    },
  });

  // Create or find Interview Flows
  const interviewFlow1 = await prisma.interviewFlow.upsert({
    where: { id: 1 },
    update: {
      description: 'Standard development interview process',
    },
    create: {
      id: 1,
      description: 'Standard development interview process',
    },
  });

  const interviewFlow2 = await prisma.interviewFlow.upsert({
    where: { id: 2 },
    update: {
      description: 'Data science interview process',
    },
    create: {
      id: 2,
      description: 'Data science interview process',
    },
  });

  // Create or find Positions
  const position1 = await prisma.position.upsert({
    where: { id: 1 },
    update: {
      title: 'Senior Full-Stack Engineer',
      description: 'Develop and maintain software applications.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Full-stack development',
      companyId: company1.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 50000,
      salaryMax: 80000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off',
      contactInfo: 'hr@lti.com',
      requirements: '3+ years of experience in software development, knowledge in React and Node.js',
      responsibilities: 'Develop, test, and maintain software solutions.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-12-31')
    },
    create: {
      id: 1,
      title: 'Senior Full-Stack Engineer',
      description: 'Develop and maintain software applications.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Full-stack development',
      companyId: company1.id,
      interviewFlowId: interviewFlow1.id,
      salaryMin: 50000,
      salaryMax: 80000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off',
      contactInfo: 'hr@lti.com',
      requirements: '3+ years of experience in software development, knowledge in React and Node.js',
      responsibilities: 'Develop, test, and maintain software solutions.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-12-31')
    },
  });

  const position2 = await prisma.position.upsert({
    where: { id: 2 },
    update: {
      title: 'Data Scientist',
      description: 'Analyze and interpret complex data.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Data analysis and machine learning',
      companyId: company1.id,
      interviewFlowId: interviewFlow2.id,
      salaryMin: 60000,
      salaryMax: 90000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off, Stock options',
      contactInfo: 'hr@lti.com',
      requirements: 'Master degree in Data Science or related field, proficiency in Python and R',
      responsibilities: 'Analyze data sets to derive business insights and develop predictive models.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-12-31')
    },
    create: {
      id: 2,
      title: 'Data Scientist',
      description: 'Analyze and interpret complex data.',
      status: 'Open',
      isVisible: true,
      location: 'Remote',
      jobDescription: 'Data analysis and machine learning',
      companyId: company1.id,
      interviewFlowId: interviewFlow2.id,
      salaryMin: 60000,
      salaryMax: 90000,
      employmentType: 'Full-time',
      benefits: 'Health insurance, 401k, Paid time off, Stock options',
      contactInfo: 'hr@lti.com',
      requirements: 'Master degree in Data Science or related field, proficiency in Python and R',
      responsibilities: 'Analyze data sets to derive business insights and develop predictive models.',
      companyDescription: 'LTI is a leading HR solutions provider.',
      applicationDeadline: new Date('2024-12-31')
    },
  });

  // Create or find Candidates
  const candidate1 = await prisma.candidate.upsert({
    where: { email: 'john.doe@gmail.com' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      phone: '1234567890',
      address: '123 Main St',
      educations: {
        create: [
          {
            institution: 'University A',
            title: 'BSc Computer Science',
            startDate: new Date('2015-09-01'),
            endDate: new Date('2019-06-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Eventbrite',
            position: 'Software Developer',
            description: 'Developed web applications',
            startDate: new Date('2019-07-01'),
            endDate: new Date('2021-08-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/john_doe.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  const candidate2 = await prisma.candidate.upsert({
    where: { email: 'jane.smith@gmail.com' },
    update: {},
    create: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@gmail.com',
      phone: '0987654321',
      address: '456 Elm St',
      educations: {
        create: [
          {
            institution: 'Maryland',
            title: 'MSc Data Science',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-06-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Gitlab',
            position: 'Data Scientist',
            description: 'Analyzed data sets',
            startDate: new Date('2020-07-01'),
            endDate: new Date('2022-08-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/jane_smith.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  const candidate3 = await prisma.candidate.upsert({
    where: { email: 'carlos.garcia@example.com' },
    update: {},
    create: {
      firstName: 'Carlos',
      lastName: 'García',
      email: 'carlos.garcia@example.com',
      phone: '1122334455',
      address: '789 Pine St',
      educations: {
        create: [
          {
            institution: 'Instituto Tecnológico',
            title: 'Ingeniería en Sistemas Computacionales',
            startDate: new Date('2017-01-01'),
            endDate: new Date('2021-12-01'),
          },
        ],
      },
      workExperiences: {
        create: [
          {
            company: 'Innovaciones Tech',
            position: 'Ingeniero de Software',
            description: 'Desarrollo y mantenimiento de aplicaciones de software',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01'),
          },
        ],
      },
      resumes: {
        create: [
          {
            filePath: '/resumes/carlos_garcia.pdf',
            fileType: 'application/pdf',
            uploadDate: new Date(),
          },
        ],
      },
    },
  });

  // Create or find Interview Types
  const interviewType1 = await prisma.interviewType.upsert({
    where: { id: 1 },
    update: {
      name: 'HR Interview',
      description: 'Assess overall fit, tech stack, salary range and availability',
    },
    create: {
      id: 1,
      name: 'HR Interview',
      description: 'Assess overall fit, tech stack, salary range and availability',
    },
  });

  const interviewType2 = await prisma.interviewType.upsert({
    where: { id: 2 },
    update: {
      name: 'Technical Interview',
      description: 'Assess technical skills',
    },
    create: {
      id: 2,
      name: 'Technical Interview',
      description: 'Assess technical skills',
    },
  });

  const interviewType3 = await prisma.interviewType.upsert({
    where: { id: 3 },
    update: {
      name: 'Hiring manager interview',
      description: 'Assess cultural fit and professional goals',
    },
    create: {
      id: 3,
      name: 'Hiring manager interview',
      description: 'Assess cultural fit and professional goals',
    },
  });

  

  // Create or find Interview Steps
  const interviewStep1 = await prisma.interviewStep.upsert({
    where: { id: 1 },
    update: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType1.id,
      name: 'Initial Screening',
      orderIndex: 1,
    },
    create: {
      id: 1,
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType1.id,
      name: 'Initial Screening',
      orderIndex: 1,
    },
  });

  const interviewStep2 = await prisma.interviewStep.upsert({
    where: { id: 2 },
    update: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType2.id,
      name: 'Technical Interview',
      orderIndex: 2,
    },
    create: {
      id: 2,
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType2.id,
      name: 'Technical Interview',
      orderIndex: 2,
    },
  });

  const interviewStep3 = await prisma.interviewStep.upsert({
    where: { id: 3 },
    update: {
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType3.id,
      name: 'Manager Interview',
      orderIndex: 3,
    },
    create: {
      id: 3,
      interviewFlowId: interviewFlow1.id,
      interviewTypeId: interviewType3.id,
      name: 'Manager Interview',
      orderIndex: 3,
    },
  });

  // Create or find Interview Steps for interviewFlow2 (Data Science)
  const interviewStep4 = await prisma.interviewStep.upsert({
    where: { id: 4 },
    update: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType1.id,
      name: 'Initial Screening',
      orderIndex: 1,
    },
    create: {
      id: 4,
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType1.id,
      name: 'Initial Screening',
      orderIndex: 1,
    },
  });

  const interviewStep5 = await prisma.interviewStep.upsert({
    where: { id: 5 },
    update: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType2.id,
      name: 'Technical Interview',
      orderIndex: 2,
    },
    create: {
      id: 5,
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType2.id,
      name: 'Technical Interview',
      orderIndex: 2,
    },
  });

  const interviewStep6 = await prisma.interviewStep.upsert({
    where: { id: 6 },
    update: {
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType3.id,
      name: 'Manager Interview',
      orderIndex: 3,
    },
    create: {
      id: 6,
      interviewFlowId: interviewFlow2.id,
      interviewTypeId: interviewType3.id,
      name: 'Manager Interview',
      orderIndex: 3,
    },
  });

  // Create or find Employees
  const employee1 = await prisma.employee.upsert({
    where: { email: 'alice.johnson@lti.com' },
    update: {
      companyId: company1.id,
      name: 'Alice Johnson',
      role: 'Interviewer',
    },
    create: {
      companyId: company1.id,
      name: 'Alice Johnson',
      email: 'alice.johnson@lti.com',
      role: 'Interviewer',
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { email: 'bob.miller@lti.com' },
    update: {
      companyId: company1.id,
      name: 'Bob Miller',
      role: 'Hiring Manager',
    },
    create: {
      companyId: company1.id,
      name: 'Bob Miller',
      email: 'bob.miller@lti.com',
      role: 'Hiring Manager',
    },
  });

  // Create or find Applications
  let application1 = await prisma.application.findFirst({
    where: {
      positionId: position1.id,
      candidateId: candidate1.id,
    },
  });
  if (!application1) {
    application1 = await prisma.application.create({
      data: {
        positionId: position1.id,
        candidateId: candidate1.id,
        applicationDate: new Date(),
        currentInterviewStep: interviewStep2.id,
      },
    });
  }

  let application2 = await prisma.application.findFirst({
    where: {
      positionId: position2.id,
      candidateId: candidate1.id,
    },
  });
  if (!application2) {
    application2 = await prisma.application.create({
      data: {
        positionId: position2.id,
        candidateId: candidate1.id,
        applicationDate: new Date(),
        currentInterviewStep: interviewStep2.id,
      },
    });
  }

  let application3 = await prisma.application.findFirst({
    where: {
      positionId: position1.id,
      candidateId: candidate2.id,
    },
  });
  if (!application3) {
    application3 = await prisma.application.create({
      data: {
        positionId: position1.id,
        candidateId: candidate2.id,
        applicationDate: new Date(),
        currentInterviewStep: interviewStep2.id,
      },
    });
  }

  let application4 = await prisma.application.findFirst({
    where: {
      positionId: position1.id,
      candidateId: candidate3.id,
    },
  });
  if (!application4) {
    application4 = await prisma.application.create({
      data: {
        positionId: position1.id,
        candidateId: candidate3.id,
        applicationDate: new Date(),
        currentInterviewStep: interviewStep1.id,
      },
    });
  }


  // Create Interviews (skip duplicates)
  await prisma.interview.createMany({
    skipDuplicates: true,
    data: [
      {
        applicationId: application1.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee1.id,
        interviewDate: new Date(),
        result: 'Passed',
        score: 5,
        notes: 'Good technical skills',
      },
      {
        applicationId: application2.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee1.id,
        interviewDate: new Date(),
        result: 'Passed',
        score: 5,
        notes: 'Excellent data analysis skills',
      },
      {
        applicationId: application3.id,
        interviewStepId: interviewStep1.id,
        employeeId: employee1.id,
        interviewDate: new Date(),
        result: 'Passed',
        score: 4,
        notes: 'Good technical skills',
      }
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
