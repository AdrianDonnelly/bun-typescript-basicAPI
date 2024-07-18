
async function displayPosts(){
    const data = await GET()
    let postElement = document.getElementById("Post");
    postElement.innerHTML = '';



    data.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const IDElement = document.createElement('h2');
        IDElement.textContent = post.id;

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;

        const DeleteButton = document.createElement('button');
        DeleteButton.textContent = ('Delete')
        DeleteButton.onclick = () => (DELETE(post.id))

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.onclick = () => showUpdateForm(postDiv, post.id, post.title, post.content);

        
        postDiv.appendChild(IDElement);
        postDiv.appendChild(titleElement);
        postDiv.appendChild(contentElement);
        postDiv.appendChild(DeleteButton)
        postDiv.appendChild(updateButton)
        postElement.appendChild(postDiv);
    });

}

function showUpdateForm(postDiv, id, currentTitle, currentContent) {
    const form = document.createElement('form');
    form.onsubmit = async (event) => {
        event.preventDefault();
        const newTitle = form.querySelector('#title').value;
        const newContent = form.querySelector('#content').value;
        await PATCH(id, newTitle, newContent);
        displayPosts(); // Refresh the posts display after update
    };

    const titleInput = document.createElement('input');
    titleInput.id = 'title';
    titleInput.type = 'text';
    titleInput.value = currentTitle;

    const contentInput = document.createElement('input');
    contentInput.id = 'content';
    contentInput.type = 'text';
    contentInput.value = currentContent;

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';

    form.appendChild(titleInput);
    form.appendChild(contentInput);
    form.appendChild(submitButton);
    postDiv.appendChild(form);
}

async function submitForm(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    await POST(title, content);
}


async function GET() {
    try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
async function POST(title,content){
    const response = await fetch('http://localhost:3000/api/posts',{
        method: "POST",
        body: JSON.stringify({
            title: title,
            content: content,
            completed: false
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    });


}
async function DELETE(id){
    const response = await fetch(`http://localhost:3000/api/posts/${id}`,{
        method: "DELETE",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    })};

async function PATCH(id,title,content){
    const response = await fetch(`http://localhost:3000/api/posts/${id}`,{
        method: "PATCH",
        body: JSON.stringify({
            title: title,
            content: content,
            completed: false
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
    });    
}
