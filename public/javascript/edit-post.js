async function editFormHandler(event) {
    event.preventDefault();
    const title = document.querySelector('input').value.trim();
    const blog_text = document.querySelector('textarea').value.trim();
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        blog_text
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }



  }
  
  document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);