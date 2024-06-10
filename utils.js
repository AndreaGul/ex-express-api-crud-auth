const slugify = require('slugify');


const generateSlug= (name,posts)=>{
    baseSlug= slugify(name, { replacement: '-', lower: true, strict: true });
  
    slugs = posts.map(post => post.slug);
    let counter = 1;
    let slug = baseSlug;
    while(slugs.includes(slug)){
      slug= `${baseSlug}-${counter}`;
      counter ++
    }
    return slug
  }
  module.exports ={
    generateSlug,
  }