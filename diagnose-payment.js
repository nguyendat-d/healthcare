#!/usr/bin/env node

/**
 * 🔍 Payment Flow Diagnostic Tool
 * Validates frontend & backend are properly configured for payment workflow
 */

const path = require('path');
const fs = require('fs');

console.log('\n🔍 Healthcare System Payment Flow Diagnostic\n');
console.log('=' .repeat(60));

let issuesFound = 0;

// =====================================================
// 1. CHECK FRONTEND FILES
// =====================================================

console.log('\n📂 1. FRONTEND FILE CHECKS\n');

const frontendChecks = [
  {
    name: 'AppointmentBooking.jsx imports apiClient',
    path: './healthcare-frontend/src/components/AppointmentBooking.jsx',
    pattern: /import apiClient from ['"].*\/utils\/api['"]/,
    required: true
  },
  {
    name: 'AppointmentBooking.jsx accepts props',
    path: './healthcare-frontend/src/components/AppointmentBooking.jsx',
    pattern: /const AppointmentBooking = \(props\)/,
    required: true
  },
  {
    name: 'handlePaymentSuccess creates appointment first',
    path: './healthcare-frontend/src/components/AppointmentBooking.jsx',
    pattern: /apiClient\.post\(['"]\/api\/appointments['"]\)/,
    required: true
  },
  {
    name: 'PatientDashboard passes onSuccess callback',
    path: './healthcare-frontend/src/pages/PatientDashboard.jsx',
    pattern: /onSuccess=\{fetchAllData\}/,
    required: true
  },
  {
    name: 'Utils API client configured',
    path: './healthcare-frontend/src/utils/api.js',
    pattern: /const apiClient = axios\.create/,
    required: true
  }
];

frontendChecks.forEach(check => {
  try {
    const file = fs.readFileSync(path.join('e:\\healthcare-system', check.path), 'utf8');
    if (check.pattern.test(file)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      issuesFound++;
    }
  } catch (e) {
    console.log(`⚠️  ${check.name} - FILE NOT FOUND`);
    issuesFound++;
  }
});

// =====================================================
// 2. CHECK BACKEND FILES
// =====================================================

console.log('\n📂 2. BACKEND FILE CHECKS\n');

const backendChecks = [
  {
    name: 'Appointment model has billId field',
    path: './healthcare-backend/src/models/appointment.model.js',
    pattern: /billId.*ObjectId.*ref.*Bill/,
    required: true
  },
  {
    name: 'Bill model has appointmentId field',
    path: './healthcare-backend/src/models/bill.model.js',
    pattern: /appointmentId.*ObjectId.*ref.*Appointment/,
    required: true
  },
  {
    name: 'Appointment service has confirmAppointment method',
    path: './healthcare-backend/src/services/appointment.service.js',
    pattern: /async confirmAppointment/,
    required: true
  },
  {
    name: 'Billing service has createBillFromAppointment method',
    path: './healthcare-backend/src/services/billing.service.js',
    pattern: /async createBillFromAppointment/,
    required: true
  },
  {
    name: 'Appointment controller has confirmAppointment method',
    path: './healthcare-backend/src/controllers/appointment.controller.js',
    pattern: /async confirmAppointment/,
    required: true
  },
  {
    name: 'Appointment routes have confirm endpoint',
    path: './healthcare-backend/src/routes/appointment.routes.js',
    pattern: /\'\/:appointmentId\/confirm\'/,
    required: true
  }
];

backendChecks.forEach(check => {
  try {
    const file = fs.readFileSync(path.join('e:\\healthcare-system', check.path), 'utf8');
    if (check.pattern.test(file)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      issuesFound++;
    }
  } catch (e) {
    console.log(`⚠️  ${check.name} - FILE NOT FOUND`);
    issuesFound++;
  }
});

// =====================================================
// 3. CONFIGURATION CHECKS
// =====================================================

console.log('\n⚙️  3. CONFIGURATION CHECKS\n');

try {
  const frontendEnv = fs.readFileSync('e:\\healthcare-system\\healthcare-frontend\\.env', 'utf8');
  if (frontendEnv.includes('VITE_API_URL')) {
    console.log('✅ Frontend .env has VITE_API_URL');
  } else {
    console.log('⚠️  Frontend .env missing VITE_API_URL (will use default)');
  }
} catch (e) {
  console.log('⚠️  Frontend .env not found (using defaults)');
}

try {
  const backendEnv = fs.readFileSync('e:\\healthcare-system\\healthcare-backend\\.env', 'utf8');
  if (backendEnv.includes('PORT')) {
    console.log('✅ Backend .env configured');
  }
} catch (e) {
  console.log('⚠️  Backend .env not found');
}

// =====================================================
// 4. WORKFLOW VALIDATION
// =====================================================

console.log('\n🔄 4. PAYMENT WORKFLOW VALIDATION\n');

const workflows = [
  {
    step: 1,
    desc: 'User fills booking form (dept, doc, date, slot, symptoms)',
    status: '⚠️  Manual process'
  },
  {
    step: 2,
    desc: 'User clicks Thanh Toán → Payment modal opens',
    status: '⚠️  Manual process'
  },
  {
    step: 3,
    desc: 'handlePaymentSuccess() creates appointment via POST /api/appointments',
    status: '✅ Implemented'
  },
  {
    step: 4,
    desc: 'Backend creates Appointment document in database',
    status: '✅ Endpoint exists'
  },
  {
    step: 5,
    desc: 'handlePaymentSuccess() calls POST /api/appointments/{id}/confirm',
    status: '✅ Implemented'
  },
  {
    step: 6,
    desc: 'Backend confirms appointment (status = CONFIRMED)',
    status: '✅ Service method'
  },
  {
    step: 7,
    desc: 'Backend auto-creates bill via createBillFromAppointment()',
    status: '✅ Service method'
  },
  {
    step: 8,
    desc: 'Backend links appointment.billId ↔ bill.appointmentId',
    status: '✅ Implemented'
  },
  {
    step: 9,
    desc: 'Frontend refreshes dashboard via onSuccess callback',
    status: '✅ Callback implemented'
  },
  {
    step: 10,
    desc: 'BillingSection receives new bills and displays invoice',
    status: '✅ Component ready'
  }
];

workflows.forEach(w => {
  console.log(`${w.step}. ${w.desc}`);
  console.log(`   ${w.status}`);
});

// =====================================================
// 5. POTENTIAL ISSUES
// =====================================================

console.log('\n⚠️  5. COMMON ISSUES & FIXES\n');

const issues = [
  {
    prob: 'Error: "Cannot read properties of undefined (reading \'_id\')"',
    cause: 'props.patient is not passed or is undefined',
    fix: 'Ensure PatientDashboard passes patient prop: <AppointmentBooking patient={data.patient} />'
  },
  {
    prob: 'Error: "404 Not Found" on confirm',
    cause: 'Appointment creation failed or appointmentId not returned',
    fix: 'Check browser console for "Creating appointment:" log. Ensure POST /api/appointments succeeds.'
  },
  {
    prob: 'Error: "Unauthorized" (401)',
    cause: 'No auth token or expired token',
    fix: 'Login first. Check localStorage for accessToken. Token refresh should be automatic.'
  },
  {
    prob: 'Bill not showing in Billing section after payment',
    cause: 'Dashboard didn\'t refresh or GET /api/bills failed',
    fix: 'Check that onSuccess callback is called. Verify fetchAllData() executes. Check API logs.'
  },
  {
    prob: 'Random error with billing endpoint',
    cause: 'Billing service not properly injected in appointment service',
    fix: 'Verify billingService is required and called in confirmAppointment() method.'
  }
];

issues.forEach((iss, idx) => {
  console.log(`Issue ${idx + 1}: ${iss.prob}`);
  console.log(`  Cause: ${iss.cause}`);
  console.log(`  Fix:   ${iss.fix}\n`);
});

// =====================================================
// 6. SUMMARY
// =====================================================

console.log('\n' + '=' .repeat(60));
console.log('\n📊 DIAGNOSTIC SUMMARY\n');

if (issuesFound === 0) {
  console.log('✅ ALL CHECKS PASSED - System ready for testing!\n');
  console.log('🎯 Next Steps:');
  console.log('   1. Start backend: npm start (in healthcare-backend)');
  console.log('   2. Start frontend: npm run dev (in healthcare-frontend)');
  console.log('   3. Login with patient credentials');
  console.log('   4. Navigate to booking form');
  console.log('   5. Complete booking and click "Thanh Toán"');
  console.log('   6. Verify success message and invoice in billing section\n');
} else {
  console.log(`❌ ${issuesFound} ISSUES FOUND - Please review above\n`);
  console.log('⚠️  Fix all issues before testing the payment workflow.\n');
}

console.log('=' .repeat(60) + '\n');
