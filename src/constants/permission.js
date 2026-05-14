const permissions = [
  // ── Products
  {
    key: "product_read",
    name: "product:read",
    description: "View product details and product list",
  },
  {
    key: "product_create",
    name: "product:create",
    description: "Create new products",
  },
  {
    key: "product_update",
    name: "product:update",
    description: "Update existing products",
  },
  {
    key: "product_delete",
    name: "product:delete",
    description: "Delete products",
  },
  {
    key: "product_bulk",
    name: "product:bulk",
    description: "Perform bulk operations on products",
  },

  // ── Orders──
  {
    key: "order_read",
    name: "order:read",
    description: "View orders and order details",
  },
  {
    key: "order_create",
    name: "order:create",
    description: "Create new orders",
  },
  {
    key: "order_update",
    name: "order:update",
    description: "Update order information and status",
  },
  {
    key: "order_delete",
    name: "order:delete",
    description: "Delete orders",
  },

  // ── Users───
  {
    key: "user_read",
    name: "user:read",
    description: "View users and user details",
  },
  {
    key: "user_create",
    name: "user:create",
    description: "Create new users",
  },
  {
    key: "user_update",
    name: "user:update",
    description: "Update user information",
  },
  {
    key: "user_delete",
    name: "user:delete",
    description: "Delete users",
  },

  // ── Roles───
  {
    key: "role_read",
    name: "role:read",
    description: "View roles and permissions",
  },
  {
    key: "role_create",
    name: "role:create",
    description: "Create new roles",
  },
  {
    key: "role_update",
    name: "role:update",
    description: "Update existing roles",
  },
  {
    key: "role_delete",
    name: "role:delete",
    description: "Delete roles",
  },
  {
    key: "role_assign",
    name: "role:assign",
    description: "Assign roles to users",
  },

  // ── Tenant Admin ──────────────────────────────────────────────────────────
  {
    key: "tenant_settings",
    name: "tenant:settings",
    description: "Manage tenant settings",
  },
  {
    key: "tenant_billing",
    name: "tenant:billing",
    description: "Manage tenant billing and subscriptions",
  },
];

export {
    permissions
}