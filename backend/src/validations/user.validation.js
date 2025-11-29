const Joi = require('joi');
const { ROLES } = require('../constants/roles');
const { commonSchemas } = require('../middlewares/validation.middleware');

// 🎯 TẠO SCHEMAS RIÊNG BIỆT CHO TỪNG LOẠI VALIDATION
const createUserBody = Joi.object({
  email: commonSchemas.email.required(),
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên không được vượt quá 100 ký tự',
      'string.empty': 'Vui lòng nhập họ tên',
      'any.required': 'Họ tên là bắt buộc'
    }),
  password: commonSchemas.password.required(),
  confirmPassword: Joi.string().required().messages({
    'any.required': 'Xác nhận mật khẩu là bắt buộc'
  }),
  phone: commonSchemas.phone.optional(),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Ngày sinh không được ở tương lai'
  }),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional().messages({
    'any.only': 'Giới tính không hợp lệ'
  }),
  address: Joi.string().max(200).optional(),
  identification: Joi.string().max(20).optional(),
  role: Joi.string().valid(...Object.values(ROLES)).required().messages({
    'any.only': 'Vai trò không hợp lệ',
    'any.required': 'Vai trò là bắt buộc'
  }),
  
  professionalInfo: Joi.object({
    licenseNumber: Joi.string().max(50).optional(),
    specialization: Joi.string().max(100).optional(),
    department: Joi.string().max(100).optional(),
    qualifications: Joi.array().items(Joi.string().max(200)).optional(),
    yearsOfExperience: Joi.number().min(0).max(50).optional(),
    hireDate: Joi.date().max('now').optional()
  }).when('role', {
    is: Joi.valid(ROLES.DOCTOR, ROLES.NURSE, ROLES.PHARMACIST, ROLES.LAB_TECHNICIAN),
    then: Joi.object({
      licenseNumber: Joi.string().required().messages({
        'any.required': 'Số giấy phép hành nghề là bắt buộc'
      }),
      specialization: Joi.string().required().messages({
        'any.required': 'Chuyên khoa là bắt buộc'
      }),
      department: Joi.string().required().messages({
        'any.required': 'Khoa/phòng là bắt buộc'
      })
    }).required(),
    otherwise: Joi.object().optional()
  })
});

const updateUserBody = Joi.object({
  email: commonSchemas.email.optional(),
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên không được vượt quá 100 ký tự'
    }),
  phone: commonSchemas.phone.optional(),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Ngày sinh không được ở tương lai'
  }),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional().messages({
    'any.only': 'Giới tính không hợp lệ'
  }),
  address: Joi.string().max(200).optional(),
  identification: Joi.string().max(20).optional(),
  department: Joi.string().max(100).optional(),
  professionalInfo: Joi.object({
    licenseNumber: Joi.string().max(50).optional(),
    specialization: Joi.string().max(100).optional(),
    department: Joi.string().max(100).optional(),
    qualifications: Joi.array().items(Joi.string().max(200)).optional(),
    yearsOfExperience: Joi.number().min(0).max(50).optional(),
    hireDate: Joi.date().max('now').optional()
  }).optional(),
  settings: Joi.object({
    language: Joi.string().valid('vi', 'en').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
      push: Joi.boolean().optional()
    }).optional(),
    theme: Joi.string().valid('light', 'dark').optional()
  }).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED').optional()
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

const updateUserProfileBody = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên không được vượt quá 100 ký tự'
    }),
  phone: commonSchemas.phone.optional(),
  dateOfBirth: Joi.date().max('now').optional().messages({
    'date.max': 'Ngày sinh không được ở tương lai'
  }),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional().messages({
    'any.only': 'Giới tính không hợp lệ'
  }),
  address: Joi.string().max(200).optional(),
  settings: Joi.object({
    language: Joi.string().valid('vi', 'en').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      sms: Joi.boolean().optional(),
      push: Joi.boolean().optional()
    }).optional(),
    theme: Joi.string().valid('light', 'dark').optional()
  }).optional()
}).min(1).messages({
  'object.min': 'Phải cung cấp ít nhất một trường để cập nhật'
});

const disableUserBody = Joi.object({
  reason: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Lý do phải có ít nhất 5 ký tự',
    'string.max': 'Lý do không được vượt quá 500 ký tự',
    'string.empty': 'Vui lòng nhập lý do vô hiệu hóa',
    'any.required': 'Lý do vô hiệu hóa là bắt buộc'
  })
});

const assignRoleBody = Joi.object({
  role: Joi.string().valid(...Object.values(ROLES)).required().messages({
    'any.only': 'Vai trò không hợp lệ',
    'any.required': 'Vai trò là bắt buộc'
  })
});

const userIdParams = Joi.object({
  userId: commonSchemas.objectId.required()
});

const listUsersQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  role: Joi.string().valid(...Object.values(ROLES)).optional(),
  search: Joi.string().max(100).optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED', 'PENDING_APPROVAL').optional(),
  sortBy: Joi.string().valid('createdAt', 'email', 'lastLogin', 'personalInfo.firstName').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const checkUserPermissionBody = Joi.object({
  permission: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập permission',
    'any.required': 'Permission là bắt buộc'
  })
});

const deleteUserBody = Joi.object({
  reason: Joi.string().min(5).max(500).required().messages({
    'string.min': 'Lý do phải có ít nhất 5 ký tự',
    'string.max': 'Lý do không được vượt quá 500 ký tự',
    'string.empty': 'Vui lòng nhập lý do xóa',
    'any.required': 'Lý do xóa là bắt buộc'
  })
});

// 🎯 EXPORT CÁC SCHEMAS CHO TỪNG ROUTE
module.exports = {
  // 🎯 CHO CREATE USER
  createUser: {
    body: createUserBody
  },

  // 🎯 CHO UPDATE USER
  updateUser: {
    params: userIdParams,
    body: updateUserBody
  },

  // 🎯 CHO UPDATE USER PROFILE
  updateUserProfile: {
    body: updateUserProfileBody
  },

  // 🎯 CHO DISABLE USER
  disableUser: {
    params: userIdParams,
    body: disableUserBody
  },

  // 🎯 CHO ASSIGN ROLE
  assignRole: {
    params: userIdParams,
    body: assignRoleBody
  },

  // 🎯 CHO GET USER BY ID
  getUserById: {
    params: userIdParams
  },
  deleteUser: {
    params: userIdParams,
    body: deleteUserBody
  },

  // 🎯 CHO LIST USERS
  listUsers: {
    query: listUsersQuery
  },

  // 🎯 CHO CHECK USER PERMISSION
  checkUserPermission: {
    params: userIdParams,
    body: checkUserPermissionBody
  },

  

  // 🎯 EXPORT CÁC SCHEMAS RIÊNG LẺ (CHO LINH HOẠT)
  schemas: {
    createUserBody,
    updateUserBody,
    updateUserProfileBody,
    disableUserBody,
    assignRoleBody,
    userIdParams,
    listUsersQuery,
    checkUserPermissionBody
  }
};