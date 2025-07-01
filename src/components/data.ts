// data.ts

export const blogPost = {
  title: "Consider every mistake",
  date: "17 January 2021",
  categories: ["Business", "Fashion"],
  author: {
    name: "Lindsey Bucki",
    role: "Co-founder",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    bio: "Lorem ipsum is simply dummy text of the printing and industry lorem ipsum has been standard.",
  },
  image:
    "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=400&q=60",
  content: [
    "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s...",
    "There are many variations of passages of lorem ipsum available, but the majority have suffered alteration...",
    "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
  ],
};

export const categories = [
  "Business",
  "Fashion",
  "Technology",
  "Health",
  "Lifestyle",
];

export const relatedPosts = [
  {
    id: 1,
    title: "Why you need to fail to succeed",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=400&q=60",
    category: "Business",
    date: "10 March 2021",
  },
  {
    id: 2,
    title: "Dressing for the modern age",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=60",
    category: "Fashion",
    date: "12 March 2021",
  },
  {
    id: 3,
    title: "Embracing minimalism in design",
    image:
      "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=400&q=60",
    category: "Fashion",
    date: "15 March 2021",
  },
];
