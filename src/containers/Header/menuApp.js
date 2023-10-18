export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud', link: '/system/user-manage'
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
                // subMenus: [
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
            // {
            //     name: 'menu.admin.manage-admin', link: '/system/user-admin'
            // },
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule'
            },

        ]
    },
    { //quản lý phòng khám

        name: 'menu.admin.manage-clinic',
        menus: [
            { name: 'menu.admin.manage-clinic', link: '/system/manage-clinic_RUD' },
            { name: 'Xem danh sách & thêm', link: '/system/manage-clinic_CR' }
        ]

    },
    { //quản lý chuyên khoa

        name: 'menu.admin.manage-speciatly',
        menus: [
            { name: 'menu.admin.manage-speciatly', link: '/system/manage-speciatly' }
        ]
    },
    { //quản lý cẩm nang

        name: 'menu.admin.manage-handbook',
        menus: [
            { name: 'menu.admin.manage-handbook', link: '/system/manage-handbook' },
            { name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient' } // dùng tạm ở đây để khỏi phải đăng xuất
        ]
    }
];

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            // quan ly ke hoach kham benh cua bac si
            { name: 'menu.doctor.manage-schedule', link: '/doctor/manage-schedule' },
            { name: 'menu.doctor.manage-patient', link: '/doctor/manage-patient' } // xài tạm trên kia đi
        ]
    }
]


/** Từ đây là khu vực mình tự code */

// export const musMediAdminMenu = [
//     {
//         name: 'Welcome',
//         menus: [
//             {
//                 name: 'Welcome', link: '/system/user-manage'
//             }
//         ]
//     },
//     {
//         name: 'Cơ sở Y tế',
//         menus: [
//             { name: 'Chỉnh sửa & xóa thông tin', link: '/system/manage-clinic_RUD' },
//             { name: 'Danh sách', link: '/system/manage-clinic_CR' },
//             { name: 'Thêm mới', link: '/system/addClinic' },
//         ]

//     },
//     {
//         name: 'Chuyên khoa',
//         menus: [
//             { name: 'menu.admin.manage-speciatly', link: '/system/manage-speciatly' }
//         ]
//     }
// ]

export const ClinicMenu = [
    {
        name: 'Đơn đặt lịch',
        menus: [
            {
                name: 'Đơn đặt lịch', link: '/system/user-manage',
            }
        ]
    },
    {
        name: 'Hồ sơ bác sĩ',
        menus: [
            { name: 'Danh sách', link: '/system/listDoctor' },
            { name: 'Chỉnh sửa thông tin', link: '/system/editDoctor' },
        ]
    },
    {
        name: 'Các gói dịch vụ',
        menus: [
            { name: 'Danh sách', link: '' },
            { name: 'Chỉnh sửa thông tin', link: '' },
        ]
    },
    {
        name: 'Lịch khám',
        menus: [
            { name: 'Lịch biểu', link: '' },
            { name: 'Thiết lập lịch biểu', link: '/system/editSchedule' },
        ]
    }
]