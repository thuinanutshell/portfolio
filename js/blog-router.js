export async function loadMarkdownPost(slug) {
  const container = document.getElementById('blog-post-container');
  try {
    const response = await fetch(`../content/${slug}.md`);
    const markdown = await response.text();
    
    // Configure marked to use Prism classes
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && Prism.languages[lang]) {
          return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
      }
    });
    
    const html = marked.parse(markdown);
    document.getElementById('blog-post-container').innerHTML = html;
    
    // Apply syntax highlighting to any remaining code blocks
    Prism.highlightAll();
    
  } catch (error) {
    console.error('Error loading post:', error);
    document.getElementById('blog-post-container').innerHTML = '<p>Post not found.</p>';
  }
}