// src/routesConfig.ts

const routes = [
  "/",
  "/aboutus",
  "/booking",
  "/itinerypage",
  "/login",
  "/itinerary/:packageId",
  "/murdeshwar",
  "/murdeshwarpackages",
  "/blog/:id",
  "/blogs",
  "/blogs/category/:categoryId",
  "/media",
  "/faq",
  "/contactus",
  "/termsandcondition",
  "/privacypolicy",
  "/thankyou",

  // Admin routes
  "/admin/dashboard",
  "/admin/location",
  "/admin/location/add",
  "/admin/location/edit/:id",
  "/admin/coupon",
  "/admin/coupon/add",
  "/admin/coupon/edit/:id",
  "/admin/add-package",
  "/admin/package",
  "/admin/package/edit/:id",
  "/admin/booking",
  "/admin/booking/add",
  "/admin/report",
  "/admin/blogs",
  "/admin/add-blog",
  "/admin/edit-blog/:id",
  "/admin/blogcategories",
  "/admin/Addmedia",
  "/admin/AddTermscondition",
  "/admin/Termscondition",

  // Not found fallback
  "*",
];

export default routes;
