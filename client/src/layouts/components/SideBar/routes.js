export const roleEnum = {
  Customer: 1,
  Staff: 2,
  Admin: 3,
};

export const routes = [
  {
    title: "Overview",
    path: "/admin",
    exactly: true,
    permissions: [roleEnum.Staff, roleEnum.Admin],
  },
  {
    title: "Product Management",
    path: "/admin/product",
    subMenu: [
      {
        title: "Add Product",
        path: "/admin/product/add-card-shop",
      },
    ],
    permissions: [roleEnum.Staff],
  },

  {
    title: "Order Management",
    path: "/admin/order",
    permissions: [roleEnum.Staff],
  },
  {
    title: "Discount code",
    path: "/admin/voucher",
    permissions: [roleEnum.Staff],
  },
  {
    title: "Client Management",
    path: "/admin/customer",
    permissions: [roleEnum.Admin],
  },
  {
    title: "Staff Management",
    path: "/admin/staff",
    permissions: [roleEnum.Admin],
  },
];
